import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Genogram from "./Genogram";
import { TourOverlay, TOUR_STEPS } from "./Tour";

const TOUR_DONE_KEY = "gb_geo_tour_done";

// 투어 버튼 애니메이션(등장 + 은은한 펄스) — 과거 챗봇 FAB 버튼 느낌을 참고, 1회만 스타일 주입
function injectTourButtonAnim() {
  if (document.getElementById("geo-tour-btn-style")) return;
  const s = document.createElement("style");
  s.id = "geo-tour-btn-style";
  s.textContent = `
    @keyframes geoTourFloat{0%{opacity:0;transform:translateY(0) scale(.8)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes geoTourPulseSm{0%{box-shadow:0 3px 10px rgba(58,106,74,.35),0 0 0 0 rgba(58,106,74,.45)}70%{box-shadow:0 3px 10px rgba(58,106,74,.35),0 0 0 7px rgba(58,106,74,0)}100%{box-shadow:0 3px 10px rgba(58,106,74,.35),0 0 0 0 rgba(58,106,74,0)}}
    @keyframes geoTourIdleBob{0%,82%,100%{transform:translateY(0)}88%{transform:translateY(-5px)}94%{transform:translateY(0)}}
    .geo-tour-btn-inline{animation:geoTourFloat .35s ease both,geoTourPulseSm 2.4s ease-in-out .3s 4,geoTourIdleBob 6s ease-in-out 1s infinite;transition:transform .15s ease}
    .geo-tour-btn-inline:hover{transform:scale(1.1)}
    .geo-tour-btn-inline:active{transform:scale(.92)}
  `;
  document.head.appendChild(s);
}

// 스플래시(카드 회전) 화면이 끝난 뒤 가계도를 띄우고,
// 처음 방문이면 가이드 투어를 자동으로 시작한다. 저작권 표시 옆 버튼으로 언제든 다시 볼 수 있음.
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
      <Genogram onOpenTour={() => setTourStep(0)} />
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
