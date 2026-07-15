import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the sleep habit MVP landing screen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /<title>숙면습관 진단실 \| 안성경옥당한의원 김성혁 원장<\/title>/);
  assert.match(html, /나는 왜 자도 자도/);
  assert.match(html, /1분 진단 시작/);
  assert.match(html, /안성경옥당한의원/);
  assert.match(html, /자동 진단·자동 처방을 하지 않습니다/);
});

test("keeps SEO and safety-oriented metadata in the rendered page", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<meta name="description" content="1분 수면 습관 진단, 맞춤 실천 3가지, 매일 30초 수면일지와 변화 기록"\/>/);
  assert.match(html, /<meta property="og:title" content="숙면습관 진단실"\/>/);
  assert.match(html, /의학적 진단이나 치료를 대신하지 않습니다/);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|react-loading-skeleton/);
});
