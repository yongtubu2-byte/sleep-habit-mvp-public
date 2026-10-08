import { createServer } from "node:http";
import { redactClinicalText } from "./redact.mjs";

const MAX_BODY_BYTES = 256 * 1024;

function json(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("request_too_large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("invalid_json");
    error.statusCode = 400;
    throw error;
  }
}

export function createPrivacyGatewayServer() {
  return createServer(async (req, res) => {
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("referrer-policy", "no-referrer");

    if (req.method === "GET" && req.url === "/health") {
      return json(res, 200, { ok: true, service: "kyungokdang-local-privacy-gateway" });
    }

    if (req.method !== "POST" || req.url !== "/redact") {
      return json(res, 404, { error: "not_found" });
    }

    try {
      const body = await readJson(req);
      if (typeof body.text !== "string" || body.text.length === 0) {
        return json(res, 400, { error: "text_required" });
      }

      const result = redactClinicalText(body.text, {
        caseId: body.caseId,
        names: body.context?.names,
        locations: body.context?.locations,
        birthDates: body.context?.birthDates,
        recordIds: body.context?.recordIds,
      });

      return json(res, 200, result);
    } catch (error) {
      const statusCode = Number(error?.statusCode) || 500;
      // Never log request bodies or raw clinical text.
      if (statusCode >= 500) {
        console.error("privacy_gateway_error", error instanceof Error ? error.message : "unknown");
      }
      return json(res, statusCode, {
        error: statusCode === 500 ? "internal_error" : error.message,
      });
    }
  });
}
