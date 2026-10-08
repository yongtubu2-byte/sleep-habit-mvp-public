const REGEX_RULES = [
  {
    type: "resident_registration_number",
    marker: "[RRN]",
    regex: /\b\d{6}-?[1-4]\d{6}\b/g,
  },
  {
    type: "phone",
    marker: "[PHONE]",
    regex: /\b(?:01[016789]|0\d{1,2})[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
  },
  {
    type: "email",
    marker: "[EMAIL]",
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    type: "korean_address",
    marker: "[ADDRESS]",
    regex:
      /(?:서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원(?:특별자치)?도|충청북도|충청남도|전북특별자치도|전라남도|경상북도|경상남도|제주특별자치도)\s+[가-힣0-9·-]+(?:시|군|구)?\s*[가-힣0-9·-]+(?:읍|면|동|로|길)(?:\s+\d+(?:-\d+)?)?/g,
  },
];

function replaceExactValues(text, values, type, marker, entities) {
  let output = text;
  for (const rawValue of values ?? []) {
    const value = String(rawValue ?? "").trim();
    if (!value) continue;

    const parts = output.split(value);
    const count = parts.length - 1;
    if (count === 0) continue;

    output = parts.join(marker);
    entities.push({ type, count });
  }
  return output;
}

function scanResidualRisk(text) {
  const flags = [];
  if (/\b\d{6}-?[1-4]\d{6}\b/.test(text)) flags.push("resident_registration_number");
  if (/\b(?:01[016789]|0\d{1,2})[-.\s]?\d{3,4}[-.\s]?\d{4}\b/.test(text)) flags.push("phone");
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) flags.push("email");

  if (/(회사|직장|대학교|학교|아파트|빌라|상가|사업장|보호자\s*이름)/.test(text)) {
    flags.push("possible_indirect_identifier");
  }

  return [...new Set(flags)];
}

/**
 * Local-first deterministic redaction.
 *
 * This function intentionally does not call any network service or model.
 * A local LLM may be layered before/after this function on the Mac mini,
 * but cloud inference must only receive the returned redactedText.
 */
export function redactClinicalText(input, context = {}) {
  if (typeof input !== "string") {
    throw new TypeError("Clinical input must be a string.");
  }

  const entities = [];
  let redactedText = input.normalize("NFC");

  redactedText = replaceExactValues(
    redactedText,
    context.names,
    "name",
    "[NAME]",
    entities,
  );
  redactedText = replaceExactValues(
    redactedText,
    context.locations,
    "location",
    "[LOCATION]",
    entities,
  );
  redactedText = replaceExactValues(
    redactedText,
    context.birthDates,
    "birth_date",
    "[BIRTH_DATE]",
    entities,
  );
  redactedText = replaceExactValues(
    redactedText,
    context.recordIds,
    "record_id",
    "[RECORD_ID]",
    entities,
  );

  for (const rule of REGEX_RULES) {
    let count = 0;
    redactedText = redactedText.replace(rule.regex, () => {
      count += 1;
      return rule.marker;
    });
    if (count > 0) entities.push({ type: rule.type, count });
  }

  const residualFlags = scanResidualRisk(redactedText);
  const removedCount = entities.reduce((sum, entity) => sum + entity.count, 0);
  const manualReview = residualFlags.length > 0;

  return {
    caseId: context.caseId ?? null,
    redactedText,
    removedEntities: entities,
    residualFlags,
    privacyRisk: manualReview ? "high" : removedCount > 0 ? "medium" : "low",
    manualReview,
  };
}
