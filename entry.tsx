import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Genogram from "./Genogram";

// 스플래시(카드 회전) 화면이 끝난 뒤 가계도를 띄운다.
// 기존 가이드 투어·챗봇 도움말은 다음 작업에서 새 기능에 맞게 다시 만들 예정 — 지금은 뺌.
function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const splash = document.getElementById("splash");
    const t = setTimeout(() => {
      if (splash) splash.classList.add("fade-out");
      setTimeout(() => {
        if (splash) splash.style.display = "none";
        setReady(true);
      }, 1200);
    }, 5800);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;
  return <Genogram />;
}

const container = document.getElementById("root")!;
createRoot(container).render(<App />);
