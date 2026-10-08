import { createPrivacyGatewayServer } from "../lib/privacy/server.mjs";

const host = process.env.KYUNGOKDANG_PRIVACY_HOST ?? "127.0.0.1";
const port = Number(process.env.KYUNGOKDANG_PRIVACY_PORT ?? "8788");
const loopbackHosts = new Set(["127.0.0.1", "::1", "localhost"]);

if (!loopbackHosts.has(host)) {
  console.error("Refusing non-loopback bind. Privacy gateway must remain local-only.");
  process.exit(2);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("Invalid KYUNGOKDANG_PRIVACY_PORT");
  process.exit(2);
}

const server = createPrivacyGatewayServer();
server.listen(port, host, () => {
  console.log(`Kyungokdang privacy gateway listening on http://${host}:${port}`);
  console.log("Raw request bodies are not logged. Service is restricted to loopback.");
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
