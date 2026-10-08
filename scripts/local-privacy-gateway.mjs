import { createPrivacyGatewayServer } from "../lib/privacy/server.mjs";

const host = process.env.KYUNGOKDANG_PRIVACY_HOST ?? "127.0.0.1";
const port = Number(process.env.KYUNGOKDANG_PRIVACY_PORT ?? "8788");

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("Invalid KYUNGOKDANG_PRIVACY_PORT");
  process.exit(2);
}

const server = createPrivacyGatewayServer();
server.listen(port, host, () => {
  console.log(`Kyungokdang privacy gateway listening on http://${host}:${port}`);
  console.log("Raw request bodies are not logged. Keep this service bound to localhost.");
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
