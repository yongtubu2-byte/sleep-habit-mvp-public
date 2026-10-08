import test from "node:test";
import assert from "node:assert/strict";
import { createPrivacyGatewayServer } from "../lib/privacy/server.mjs";

async function withServer(run) {
  const server = createPrivacyGatewayServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

test("privacy gateway redacts before returning clinical text", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/redact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        caseId: "CASE-HTTP-001",
        text: "김테스트 010-1234-5678 test@example.com 밤에 세 번 깬다.",
        context: { names: ["김테스트"] },
      }),
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.caseId, "CASE-HTTP-001");
    assert.doesNotMatch(body.redactedText, /김테스트/);
    assert.doesNotMatch(body.redactedText, /010-1234-5678/);
    assert.doesNotMatch(body.redactedText, /test@example.com/);
    assert.match(body.redactedText, /\[NAME\]/);
    assert.match(body.redactedText, /\[PHONE\]/);
    assert.match(body.redactedText, /\[EMAIL\]/);
  });
});

test("privacy gateway exposes a non-sensitive health endpoint", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      ok: true,
      service: "kyungokdang-local-privacy-gateway",
    });
  });
});
