import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Genogram from "./Genogram";
import { TourOverlay, TOUR_STEPS } from "./Tour";

const TOUR_DONE_KEY = "gb_geo_tour_done";

// ❓ 버튼 애니메이션(등장 + 은은한 둥둥/펄스) — 과거 챗봇 버튼의 느낌을 참고해 1회만 스타일 주입
function injectTourButtonAnim() {
  if (document.getElementById("geo-tour-btn-style")) return;
  const s = document.createElement("style");
  s.id = "geo-tour-btn-style";
  s.textContent = `
    @keyframes geoTourFloat{0%{opacity:0;transform:translateY(8px) scale(.9)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes geoTourBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    @keyframes geoTourPulse{0%{box-shadow:0 6px 16px rgba(58,106,74,.35),0 0 0 0 rgba(58,106,74,.45)}70%{box-shadow:0 6px 16px rgba(58,106,74,.35),0 0 0 10px rgba(58,106,74,0)}100%{box-shadow:0 6px 16px rgba(58,106,74,.35),0 0 0 0 rgba(58,106,74,0)}}
    .geo-tour-btn{animation:geoTourFloat .35s ease both,geoTourBob 2.8s ease-in-out .5s 3,geoTourPulse 2.8s ease-in-out 3;transition:transform .15s ease}
    .geo-tour-btn:hover{transform:scale(1.08) translateY(-2px)}
    .geo-tour-btn:active{transform:scale(.95)}
  `;
  document.head.appendChild(s);
}

// 스플래시(카드 회전) 화면이 끝난 뒤 가계도를 띄우고,
// 처음 방문이면 가이드 투어를 자동으로 시작한다. ❓ 버튼으로 언제든 다시 볼 수 있음.
function App() {
  const [ready, setReady] = useState(false);
  const [tourStep, setTourStep] = useState(-1);

  useEffect(() => {
    const splash = document.getElementById("splash");
    const t = setTimeout(() => {
      if (splash) splash.classList.add("fade-out");
      setTimeout(() => {
        if (splash) splash.style.display = "none";
        setReady(true);
        if (!localStorage.getItem(TOUR_DONE_KEY)) {
          setTimeout(() => setTourStep(0), 500);
        }
      }, 1200);
    }, 5800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { injectTourButtonAnim(); }, []);

  const closeTour = () => {
    setTourStep(-1);
    localStorage.setItem(TOUR_DONE_KEY, "1");
  };

  if (!ready) return null;

  return (
    <>
      <Genogram />
      <button
        onClick={() => setTourStep(0)}
        title="사용 안내 투어"
        className="geo-tour-btn"
        style={{
          position: "fixed", top: 12, right: 12, zIndex: 8500,
          width: 34, height: 34, borderRadius: 8,
          border: "1px solid #e5e7eb", background: "#fff",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, color: "#3a6a4a",
        }}
      >
        ❓
      </button>
      {tourStep >= 0 && tourStep < TOUR_STEPS.length && (
        <TourOverlay
          step={TOUR_STEPS[tourStep]}
          stepIndex={tourStep}
          total={TOUR_STEPS.length}
          onNext={() => {
            if (tourStep >= TOUR_STEPS.length - 1) closeTour();
            else setTourStep(s => s + 1);
          }}
          onPrev={() => setTourStep(s => Math.max(0, s - 1))}
          onClose={closeTour}
        />
      )}
    </>
  );
}

const container = document.getElementById("root")!;
createRoot(container).render(<App />);
