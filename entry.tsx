import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Genogram from "./Genogram";
import { TourOverlay, TOUR_STEPS } from "./Tour";

const TOUR_DONE_KEY = "gb_geo_tour_done";

// 투어 버튼 애니메이션 — 과거 챗봇 FAB 버튼의 느낌(원형 그라디언트 + 펄스 + 살짝 둥둥)을 참고, 1회만 스타일 주입
function injectTourButtonAnim() {
  if (document.getElementById("geo-tour-btn-style")) return;
  const s = document.createElement("style");
  s.id = "geo-tour-btn-style";
  s.textContent = `
    @keyframes geoTourFloat{0%{opacity:0;transform:translateY(10px) scale(.85)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes geoTourBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes geoTourPulse{0%{box-shadow:0 8px 20px rgba(58,106,74,.38),0 0 0 0 rgba(58,106,74,.45)}70%{box-shadow:0 8px 20px rgba(58,106,74,.38),0 0 0 12px rgba(58,106,74,0)}100%{box-shadow:0 8px 20px rgba(58,106,74,.38),0 0 0 0 rgba(58,106,74,0)}}
    @keyframes geoTourLabelIn{0%{opacity:0;transform:translateX(-6px)}100%{opacity:1;transform:translateX(0)}}
    .geo-tour-btn{animation:geoTourFloat .4s ease both,geoTourBob 3s ease-in-out .6s 4,geoTourPulse 2.6s ease-in-out 4;transition:transform .18s ease,box-shadow .18s ease}
    .geo-tour-btn:hover{transform:scale(1.08) translateY(-2px)}
    .geo-tour-btn:active{transform:scale(.94)}
    .geo-tour-label{animation:geoTourLabelIn .4s ease .5s both}
  `;
  document.head.appendChild(s);
}

// 스플래시(카드 회전) 화면이 끝난 뒤 가계도를 띄우고,
// 처음 방문이면 가이드 투어를 자동으로 시작한다. 좌측 하단 버튼으로 언제든 다시 볼 수 있음.
function App() {
  const [ready, setReady] = useState(false);
  const [tourStep, setTourStep] = useState(-1);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const splash = document.getElementById("splash");
    const t = setTimeout(() => {
      if (splash) splash.classList.add("fade-out");
      setTimeout(() => {
        if (splash) splash.style.display = "none";
        setReady(true);
        if (!localStorage.getItem(TOUR_DONE_KEY)) {
          setTimeout(() => setTourStep(0), 500);
        } else {
          setShowLabel(true);
          setTimeout(() => setShowLabel(false), 4000);
        }
      }, 1200);
    }, 5800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { injectTourButtonAnim(); }, []);

  const openTour = () => { setShowLabel(false); setTourStep(0); };
  const closeTour = () => {
    setTourStep(-1);
    localStorage.setItem(TOUR_DONE_KEY, "1");
  };

  if (!ready) return null;

  return (
    <>
      <Genogram />
      <div style={{ position: "fixed", left: 16, bottom: 44, zIndex: 8500, display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={openTour}
          title="사용 안내 투어 다시 보기"
          className="geo-tour-btn"
          style={{
            width: 52, height: 52, borderRadius: "50%", border: "none", padding: 0,
            background: "linear-gradient(135deg,#52916a 0%,#3a6a4a 100%)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <circle cx={12} cy={12} r={9.5} stroke="#fff" strokeWidth={1.8} />
            <path d="M9.3 9.4a2.7 2.7 0 1 1 3.9 2.4c-.8.45-1.2.85-1.2 1.7" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={12} cy={16.6} r={1.05} fill="#fff" />
          </svg>
        </button>
        {showLabel && (
          <div className="geo-tour-label" style={{
            background: "rgba(51,53,47,0.85)", backdropFilter: "blur(6px)", color: "#fff",
            fontSize: 12, fontWeight: 600, padding: "8px 13px", borderRadius: 16,
            boxShadow: "0 3px 14px rgba(0,0,0,0.18)", whiteSpace: "nowrap", cursor: "pointer",
          }} onClick={openTour}>
            👈 사용 안내 투어 다시 보기
          </div>
        )}
      </div>
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
