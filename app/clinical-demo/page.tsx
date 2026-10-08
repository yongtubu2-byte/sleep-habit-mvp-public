import { notFound } from "next/navigation";
import { syntheticClinicalCase } from "@/data/synthetic-clinical-fixtures";
import { buildDoctorBrief } from "@/lib/clinical/doctorBrief";

export const dynamic = "force-dynamic";

export default function ClinicalDemoPage() {
  if (process.env.KYUNGOKDANG_CLINICAL_DEMO !== "1") {
    notFound();
  }

  const brief = buildDoctorBrief(syntheticClinicalCase);
  const latest = syntheticClinicalCase.checkpoints.at(-1);

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 20px 64px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "6px 10px",
          borderRadius: 999,
          background: "#f2f2f2",
          fontSize: 13,
          marginBottom: 16,
        }}
      >
        합성환자 전용 · 실환자 데이터 아님
      </div>

      <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>경옥당 OS · Doctor Brief</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        진료 전 30초 안에 장기 경과와 오늘 확인할 항목을 파악하는 내부 데모입니다.
      </p>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 16,
          padding: 20,
          marginTop: 28,
        }}
      >
        <h2 style={{ marginTop: 0 }}>{brief.header}</h2>
        <p>
          주요 호소: {syntheticClinicalCase.concerns.join(" · ")}
          <br />
          최근 기록: {latest?.date ?? "-"}
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>최근 변화</h2>
        <ul>
          {brief.changes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>오늘 확인할 것</h2>
        <ol>
          {brief.questions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      {brief.cautions.length > 0 && (
        <section
          style={{
            marginTop: 28,
            padding: 16,
            border: "1px solid #bbb",
            borderRadius: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>주의 신호</h2>
          <ul>
            {brief.cautions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <p style={{ marginTop: 36, color: "#666", fontSize: 14 }}>{brief.sourceNote}</p>
    </main>
  );
}
