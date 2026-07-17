import { useEffect, useState } from "react";

export type TourStep = {
  target: string | null;
  title: string;
  body: string;
  position?: "top" | "bottom" | "left" | "right";
  width?: number;
};

// 과거(2026-06-03) 가계도 스케치북 투어 내용을 기반으로,
// 오늘 새로 생긴 "글씨 크기·굵기(Aa 글씨)" · "자녀선 위치 드래그" 기능을 추가함.
export const TOUR_STEPS: TourStep[] = [
  { target: null, title: "가계도 편집기 🌳", body: "가족 구조와 구성원 간의 관계를\n시각적으로 그릴 수 있어요.\n주요 기능을 안내해 드릴게요." },
  { target: "geo-nodes", title: "인물 추가 □ ○ ◇", body: "버튼을 클릭하면 캔버스에 도형이 추가돼요.\n• 더블클릭: 이름 입력\n• 나이 자리 클릭: 나이 입력\n• 사망/내담자 토글로 상태 표시", position: "bottom" },
  { target: "geo-child-types", title: "자녀 유형", body: "유산·사산·임신 등 특수 자녀 도형이에요.\n• 임신: 빈 삼각형\n• 자연유산: 삼각형 + X\n• 인공유산: 삼각형 + X + 아랫선\n• 사산아: 작은 사각형 + X\n부모 관계선에 자녀로 연결해 사용해요.", position: "bottom" },
  { target: "geo-lines", title: "관계선 연결", body: "선 종류를 먼저 선택하세요.\n인물을 우클릭 → 연결 모드 시작\n연결할 인물을 클릭하면 선이 그어집니다.\nEsc로 취소", position: "bottom" },
  { target: "geo-child-line", title: "자녀선 종류", body: "자녀 연결선 종류를 선택해요.\n• 일반: 실선\n• 위탁: 점선\n• 입양: 이중선", position: "bottom" },
  { target: "geo-twins", title: "쌍둥이", body: "Shift+클릭으로 자녀 2명 이상 선택 후\n쌍둥이 버튼을 클릭하면 선이 그어져요.\n• 쌍둥이: 이란성\n• 일란성: V자 + 가로선", position: "bottom" },
  { target: "geo-substance", title: "약물 · 정신 · 신체 표시", body: "인물을 선택한 뒤 버튼을 클릭하면\n도형 안에 표시가 채워져요.\n다시 클릭하면 표시가 해제돼요.", position: "bottom", width: 300 },
  { target: "geo-textbox", title: "텍스트 상자 T", body: "캔버스 어디든 메모나 설명을 추가할 수 있어요.\n① T 버튼 클릭 → 커서 모양 변경\n② 원하는 위치 클릭 → 텍스트 상자 생성\n더블클릭으로 수정, 드래그로 이동 가능", position: "bottom" },
  { target: "geo-textstyle", title: "글씨 크기 · 굵기 Aa (새 기능)", body: "이름 · 나이 · 텍스트 상자 글씨를\n하나의 버튼으로 조절해요.\n① 크기를 바꿀 대상을 클릭해 선택\n② \"Aa 글씨\" 버튼 → 숫자로 크기 입력, 굵게 토글\n이름 편집 칸에서 Enter를 누르면 두 줄로도 쓸 수 있어요.", position: "bottom" },
  { target: "geo-side-panel", title: "감정선 · 학대 · 갈등", body: "오른쪽 패널에 추가 선 종류가 있어요.\n• 감정 관계선: 무관심\n• 학대·갈등: 정서적학대, 방임, 통제\n패널 닫기(✕) / 열기(+) 가능", position: "left" },
  { target: "geo-actions", title: "자녀 추가 · 뒤로", body: "자녀 추가: 결혼/동거선 선택 후 클릭 →\n연결할 자녀 노드 클릭\n\n(새 기능) 결혼선을 선택하면 자녀선이 갈라지는\n지점에 작은 손잡이가 생겨요 — 좌우로 드래그해\n위치를 옮길 수 있어요.\n↩ 뒤로: 최대 30단계 실행 취소 (Ctrl+Z)", position: "bottom" },
  { target: "geo-save", title: "저장 · 불러오기", body: "💾 저장: SVG(이미지) / JSON(이후 수정 가능)\n📂 열기: 저장된 JSON 파일 불러오기", position: "bottom" },
  { target: "geo-canvas", title: "캔버스 조작", body: "• 드래그: 인물 이동\n• Shift+클릭: 다중 선택\n• 휠 스크롤: 줌 인/아웃\n• Alt+드래그: 화면 이동\n• Delete: 선택 항목 삭제", position: "top" },
  { target: null, title: "준비 완료! ✅", body: "이제 직접 그려보세요!\n❓ 버튼으로 언제든 다시 볼 수 있어요." },
];

function TourBody({ text }: { text: string }) {
  return (
    <div style={{ textWrap: "pretty" as any }}>
      {text.split("\n").map((line, i) => {
        if (!line) return <div key={i} style={{ height: "0.4em" }} />;
        const m = line.match(/^([•·])\s/);
        if (m) {
          return (
            <div key={i} style={{ display: "flex", gap: "0.4em", alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, lineHeight: 1.6 }}>{m[1]}</span>
              <span style={{ flex: 1, minWidth: 0, lineHeight: 1.6 }}>{line.slice(m[0].length)}</span>
            </div>
          );
        }
        return <div key={i} style={{ lineHeight: 1.6 }}>{line}</div>;
      })}
    </div>
  );
}

export function TourOverlay({
  step, stepIndex, total, onNext, onPrev, onClose,
}: {
  step: TourStep; stepIndex: number; total: number;
  onNext: () => void; onPrev: () => void; onClose: () => void;
}) {
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!step.target) { setSpotlight(null); return; }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) { setSpotlight(null); return; }
    setSpotlight(el.getBoundingClientRect());
  }, [step]);

  const TW = step.width || 300, SP = 6, PAD = 10;

  function tooltipStyle(): React.CSSProperties {
    if (!spotlight) {
      return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 9002, width: TW };
    }
    const pos = step.position || "bottom", cx = spotlight.left + spotlight.width / 2;
    let top: number, left: number;
    if (pos === "bottom") { top = spotlight.bottom + SP + PAD; left = cx - TW / 2; }
    else if (pos === "top") { top = spotlight.top - SP - PAD - 220; left = cx - TW / 2; }
    else if (pos === "right") { top = spotlight.top; left = spotlight.right + SP + PAD; }
    else { top = spotlight.top; left = spotlight.left - TW - SP - PAD; }
    return {
      position: "fixed",
      top: Math.max(8, top),
      left: Math.max(8, Math.min(left, window.innerWidth - TW - 8)),
      zIndex: 9002, width: TW,
    };
  }

  return (
    <>
      {!spotlight && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 9000, pointerEvents: "none" }} />
      )}
      {spotlight && (
        <div style={{
          position: "fixed", top: spotlight.top - SP, left: spotlight.left - SP,
          width: spotlight.width + SP * 2, height: spotlight.height + SP * 2,
          borderRadius: 10, boxShadow: "0 0 0 9999px rgba(0,0,0,0.35), 0 0 0 2px #d1d5db",
          zIndex: 9001, pointerEvents: "none", transition: "all 0.2s ease",
        }} />
      )}
      <div style={{
        ...tooltipStyle(), background: "#fff", borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)", border: "1px solid #e5e7eb",
        overflow: "hidden", fontFamily: "'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
        transition: "top 0.2s ease, left 0.2s ease",
      }}>
        <div style={{ padding: "14px 16px" }}>
          {!step.target && stepIndex === 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <circle cx={8} cy={9} r={4} stroke="#3a6a4a" strokeWidth={1.7} />
                <path d="M12 11.5l7 7-2 2-1.5-1.5-1.5 1.5-1.5-1.5 1-1L12 16.5" stroke="#3a6a4a" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <p style={{ fontWeight: 600, color: "#374151", fontSize: 14, marginBottom: 6, textAlign: (!step.target && stepIndex === 0) ? "center" : undefined }}>
            {step.title.replace("🌳", "").trim()}
          </p>
          <div style={{ fontSize: 12, color: "#6b7280" }}><TourBody text={step.body} /></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
            <button onClick={onClose} style={{ fontSize: 11, color: "#9ca3af", cursor: "pointer", background: "none", border: "none", padding: 0 }}>건너뛰기</button>
            <div style={{ display: "flex", gap: 6 }}>
              {stepIndex > 0 && (
                <button onClick={onPrev} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer", background: "#f9fafb", color: "#374151" }}>이전</button>
              )}
              <button onClick={onNext} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer", background: "#f9fafb", color: "#111827", fontWeight: 600 }}>
                {stepIndex === total - 1 ? "완료" : "다음 →"}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ borderRadius: 99, background: i === stepIndex ? "#6b7280" : "#e5e7eb", width: i === stepIndex ? 12 : 5, height: 5, transition: "all 0.2s" }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
