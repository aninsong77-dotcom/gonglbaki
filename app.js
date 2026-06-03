// ─── 타입 ─────────────────────────────────────────────────────

const NS = 56,
  SNAP = 18,
  CHILD_DROP = 70;
const uid = () => Math.random().toString(36).slice(2, 9);
const FAMILY_TYPES = ["결혼", "별거", "이혼", "재결합", "동거", "약혼", "사별"];
const EMO_TYPES = ["소원", "친밀", "밀착", "단절"];
const CONFLICT_TYPES = ["갈등", "융합된갈등"];
const ABUSE_TYPES = ["신체적학대", "성적학대"];
const MARRIAGE_TYPES = ["결혼", "별거", "이혼", "재결합", "동거", "약혼", "사별"];

// 선 색상
function lineColor(lt, bw, sel) {
  if (sel) return "#3a6a4a";
  if (bw) return "#222";
  if (["갈등", "융합된갈등", "신체적학대", "성적학대", "정서적학대", "방임", "통제", "단절", "소원", "무관심"].includes(lt)) return "#dc2626";
  if (lt === "친밀") return "#16a34a";
  if (lt === "밀착") return "#7c3aed";
  return "#222";
}
function nc(n) {
  return {
    x: n.x + NS / 2,
    y: n.y + NS / 2
  };
}
// 특수자녀 연결점 (도형 상단)
function ncTop(n) {
  if (n.gender === "자연유산" || n.gender === "인공유산") return {
    x: n.x + NS / 2,
    y: n.y + NS / 2 - 15
  };
  if (n.gender === "임신" || n.gender === "사산아") return {
    x: n.x + NS / 2,
    y: n.y + NS / 2 - 15
  };
  return {
    x: n.x + NS / 2,
    y: n.y
  };
}
function getEndpoint(id, nodes, lines) {
  const n = nodes.find(n => n.id === id);
  if (n) return nc(n);
  const l = lines.find(l => l.id === id);
  if (l) {
    const p1 = getEndpoint(l.from, nodes, lines);
    const p2 = getEndpoint(l.to, nodes, lines);
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }
  return {
    x: 0,
    y: 0
  };
}
function offsetPts(x1, y1, x2, y2, off) {
  const a = Math.atan2(y2 - y1, x2 - x1),
    p = a + Math.PI / 2;
  return {
    x1: x1 + Math.cos(p) * off,
    y1: y1 + Math.sin(p) * off,
    x2: x2 + Math.cos(p) * off,
    y2: y2 + Math.sin(p) * off
  };
}
function sharpZigzag(x1, y1, x2, y2, amp = 11) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const segLen = 20;
  const segs = Math.max(4, Math.round(dist / segLen));
  const dx = (x2 - x1) / segs,
    dy = (y2 - y1) / segs;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len * amp,
    ny = dx / len * amp;
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= segs; i++) {
    const mx = x1 + dx * (i - 0.5) + (i % 2 === 0 ? nx : -nx);
    const my = y1 + dy * (i - 0.5) + (i % 2 === 0 ? ny : -ny);
    d += ` L ${mx} ${my} L ${x1 + dx * i} ${y1 + dy * i}`;
  }
  return d;
}
function waveZigzag(x1, y1, x2, y2, amp = 10) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const segLen = 22;
  const segs = Math.max(3, Math.round(dist / segLen));
  const dx = (x2 - x1) / segs,
    dy = (y2 - y1) / segs;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len * amp,
    ny = dx / len * amp;
  let d = `M ${x1} ${y1}`;
  for (let i = 0; i < segs; i++) {
    const sx = x1 + dx * i,
      sy = y1 + dy * i,
      ex = x1 + dx * (i + 1),
      ey = y1 + dy * (i + 1);
    const s = i % 2 === 0 ? 1 : -1;
    d += ` C ${sx + dx * 0.25 + nx * s} ${sy + dy * 0.25 + ny * s} ${sx + dx * 0.75 + nx * s} ${sy + dy * 0.75 + ny * s} ${ex} ${ey}`;
  }
  return d;
}

// 선 미리보기
function LinePreview({
  type,
  size = 38,
  bw = false
}) {
  const h = 16,
    w = size,
    mid = h / 2;
  const col = bw ? "#222" : lineColor(type, false, false);
  const gray = "#222";
  if (type === "결혼") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: gray,
    strokeWidth: 3
  }));
  if (type === "별거") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: gray,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 - 3,
    y1: mid + 6,
    x2: w / 2 + 3,
    y2: mid - 6,
    stroke: gray,
    strokeWidth: 2
  }));
  if (type === "이혼") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: gray,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 - 7,
    y1: mid + 6,
    x2: w / 2 - 1,
    y2: mid - 6,
    stroke: gray,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 + 1,
    y1: mid + 6,
    x2: w / 2 + 7,
    y2: mid - 6,
    stroke: gray,
    strokeWidth: 2
  }));
  if (type === "재결합") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: gray,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 - 5,
    y1: mid + 6,
    x2: w / 2 - 1,
    y2: mid - 6,
    stroke: gray,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 + 1,
    y1: mid + 6,
    x2: w / 2 + 5,
    y2: mid - 6,
    stroke: gray,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 - 8,
    y1: mid - 8,
    x2: w / 2 + 8,
    y2: mid + 8,
    stroke: gray,
    strokeWidth: 2
  }));
  if (type === "동거") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: gray,
    strokeWidth: 2,
    strokeDasharray: "10 5"
  }));
  if (type === "소원") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: col,
    strokeWidth: 1.5,
    strokeDasharray: "2 3"
  }));
  if (type === "친밀") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid - 3,
    x2: w - 2,
    y2: mid - 3,
    stroke: col,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid + 3,
    x2: w - 2,
    y2: mid + 3,
    stroke: col,
    strokeWidth: 2
  }));
  if (type === "밀착") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid - 5,
    x2: w - 2,
    y2: mid - 5,
    stroke: col,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: col,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid + 5,
    x2: w - 2,
    y2: mid + 5,
    stroke: col,
    strokeWidth: 2
  }));
  if (type === "단절") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("line", {
    x1: 2,
    y1: mid,
    x2: w / 2 - 6,
    y2: mid,
    stroke: col,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 + 6,
    y1: mid,
    x2: w - 2,
    y2: mid,
    stroke: col,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 - 6,
    y1: mid - 6,
    x2: w / 2 - 6,
    y2: mid + 6,
    stroke: col,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: w / 2 + 6,
    y1: mid - 6,
    x2: w / 2 + 6,
    y2: mid + 6,
    stroke: col,
    strokeWidth: 2
  }));
  if (type === "갈등") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("path", {
    d: `M2,${mid} L8,3 L14,${h - 3} L20,3 L26,${h - 3} L${w - 2},${mid}`,
    stroke: col,
    strokeWidth: 2,
    fill: "none"
  }));
  if (type === "융합된갈등") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("path", {
    d: `M2,${mid - 4} L8,1 L14,${h - 5} L20,1 L26,${h - 5} L${w - 2},${mid - 4}`,
    stroke: col,
    strokeWidth: 1.5,
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M2,${mid + 4} L8,5 L14,${h - 1} L20,5 L26,${h - 1} L${w - 2},${mid + 4}`,
    stroke: col,
    strokeWidth: 1.5,
    fill: "none"
  }));
  if (type === "신체적학대") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("path", {
    d: `M2,${mid} C7,${mid - 5} 11,${mid + 5} 16,${mid} C21,${mid - 5} 25,${mid + 5} ${w - 8},${mid}`,
    stroke: col,
    strokeWidth: 2,
    fill: "none"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `${w - 2},${mid} ${w - 9},${mid - 4} ${w - 9},${mid + 4}`,
    fill: col
  }));
  if (type === "성적학대") return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, /*#__PURE__*/React.createElement("path", {
    d: `M2,${mid} L8,3 L14,${h - 3} L20,3 L${w - 8},${mid}`,
    stroke: col,
    strokeWidth: 2,
    fill: "none"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `${w - 2},${mid} ${w - 9},${mid - 4} ${w - 9},${mid + 4}`,
    fill: col
  }));
  if (type === "약혼") return /*#__PURE__*/React.createElement("svg", {width:w,height:h},
    /*#__PURE__*/React.createElement("line",{x1:2,y1:mid,x2:w-2,y2:mid,stroke:gray,strokeWidth:2}),
    /*#__PURE__*/React.createElement("circle",{cx:w/2,cy:mid,r:3,fill:"white",stroke:gray,strokeWidth:1.5}));
  if (type === "사별") return /*#__PURE__*/React.createElement("svg", {width:w,height:h},
    /*#__PURE__*/React.createElement("line",{x1:2,y1:mid,x2:w-2,y2:mid,stroke:gray,strokeWidth:2}),
    /*#__PURE__*/React.createElement("line",{x1:w/2,y1:mid-5,x2:w/2,y2:mid+5,stroke:gray,strokeWidth:2}));
  if (type === "무관심") return /*#__PURE__*/React.createElement("svg", {width:w,height:h},
    /*#__PURE__*/React.createElement("line",{x1:2,y1:mid,x2:w-2,y2:mid,stroke:col,strokeWidth:1.5,strokeDasharray:"8 5"}));
  if (type === "정서적학대") return /*#__PURE__*/React.createElement("svg", {width:w,height:h},
    /*#__PURE__*/React.createElement("line",{x1:2,y1:mid,x2:w-8,y2:mid,stroke:col,strokeWidth:2,strokeDasharray:"5 3"}),
    /*#__PURE__*/React.createElement("polygon",{points:`${w-2},${mid} ${w-9},${mid-4} ${w-9},${mid+4}`,fill:col}));
  if (type === "방임") return /*#__PURE__*/React.createElement("svg", {width:w,height:h},
    /*#__PURE__*/React.createElement("line",{x1:2,y1:mid,x2:w-8,y2:mid,stroke:col,strokeWidth:1.5,strokeDasharray:"3 4"}),
    /*#__PURE__*/React.createElement("polygon",{points:`${w-2},${mid} ${w-9},${mid-4} ${w-9},${mid+4}`,fill:col}));
  if (type === "통제") return /*#__PURE__*/React.createElement("svg", {width:w,height:h},
    /*#__PURE__*/React.createElement("line",{x1:9,y1:mid,x2:w-9,y2:mid,stroke:col,strokeWidth:2.5}),
    /*#__PURE__*/React.createElement("polygon",{points:`${w-2},${mid} ${w-9},${mid-4} ${w-9},${mid+4}`,fill:col}),
    /*#__PURE__*/React.createElement("polygon",{points:`2,${mid} 9,${mid-4} 9,${mid+4}`,fill:col}));
  return null;
}

// 두 줄 버튼
function TwoLineBtn({
  top,
  bottom,
  onClick,
  active,
  disabled,
  danger,
  preview,
  bw
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    className: `flex flex-col items-center justify-center px-1.5 py-1 rounded border text-[9px] font-medium transition-colors leading-tight min-w-[36px] gap-0.5
        ${danger ? "border-red-200 text-red-500 hover:bg-red-50 bg-white" : active ? "border-[#3a6a4a] bg-[#f0f7f2] text-[#2d7a3a]" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a]"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}`
  }, preview ? /*#__PURE__*/React.createElement(LinePreview, {
    type: preview,
    size: 32,
    bw: bw
  }) : /*#__PURE__*/React.createElement("span", {
    className: "text-[10px]"
  }, top), /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] whitespace-nowrap"
  }, bottom));
}

// ─── 메인 ─────────────────────────────────────────────────────
function Genogram() {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);
  const [marriages, setMarriages] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [lineType, setLineType] = useState("결혼");
  const [panelOpen, setPanelOpen] = useState(true);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectingMode, setConnectingMode] = useState("node");
  const [childLineType, setChildLineType] = useState("일반");
  const [twinSelectMode, setTwinSelectMode] = useState(false);
  const [twinPending, setTwinPending] = useState([]); // 쌍둥이로 묶을 자녀 id
  const [twinIdentical, setTwinIdentical] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editField, setEditField] = useState("label");
  const [editVal, setEditVal] = useState("");
  const [bw, setBw] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveMenuPos, setSaveMenuPos] = useState({
    top: 0,
    right: 0
  });
  const saveBtnRef = useRef(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [textBoxMode, setTextBoxMode] = useState(false);
  const [textBoxColor, setTextBoxColor] = useState("#222222");
  const [editingTbId, setEditingTbId] = useState(null);
  const tbDragRef = useRef(null);

  // 범례
  const [legendPos, setLegendPos] = useState(null);
  const [legendBoxW, setLegendBoxW] = useState(210);
  const [legendBoxH, setLegendBoxH] = useState(0); // 0 = auto
  const [legendFontScale, setLegendFontScale] = useState(1.0);
  const [legendSelected, setLegendSelected] = useState(false);
  const [legendVisible, setLegendVisible] = useState(true);
  const [legendLabelOverrides, setLegendLabelOverrides] = useState({});
  const [editingLegendKey, setEditingLegendKey] = useState(null);
  const legendDragRef = useRef(null);

  // Undo
  const [history, setHistory] = useState([]);
  const saveHistory = useCallback(() => {
    setHistory(h => [...h.slice(-30), {
      nodes: nodes.map(n => ({
        ...n
      })),
      lines: lines.map(l => ({
        ...l
      })),
      marriages: marriages.map(m => ({
        ...m,
        childIds: [...m.childIds]
      })),
      textBoxes: textBoxes.map(t => ({
        ...t
      }))
    }]);
  }, [nodes, lines, marriages]);
  const undo = useCallback(() => {
    setHistory(h => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setNodes(prev.nodes);
      setLines(prev.lines);
      setMarriages(prev.marriages);
      setTextBoxes(prev.textBoxes ?? []);
      return h.slice(0, -1);
    });
  }, []);
  const dragRef = useRef(null);
  const [rubber, setRubber] = useState(null);
  const rbStart = useRef(null);

  // 캔버스 실제 크기를 state로 관리 — display:none 탭에서 돌아올 때도 정확히 업데이트
  const [canvasSize, setCanvasSize] = useState({
    w: 800,
    h: 500
  });

  // ── 줌 / 패닝 ──
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({
    x: 0,
    y: 0
  });
  const panRef = useRef(null);
  const isPanning = useRef(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const {
        width,
        height
      } = entries[0].contentRect;
      if (width > 0 && height > 0) setCanvasSize({
        w: width,
        h: height
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const svgPt = (cx, cy) => {
    const r = wrapRef.current.getBoundingClientRect();
    // 줌/패닝 보정: 화면 좌표 → 캔버스 좌표
    return {
      x: (cx - r.left - pan.x) / zoom,
      y: (cy - r.top - pan.y) / zoom
    };
  };

  // 종료 확인 모달은 Index.tsx에서 처리

  useEffect(() => {
    const h = e => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") doDelete();
      if (e.key === "Escape") {
        setSelected(new Set());
        setConnectingFrom(null);
        setLegendSelected(false);
        setShowSaveMenu(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") undo();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selected, nodes, lines, marriages, history]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    if (!showSaveMenu) return;
    const close = () => setShowSaveMenu(false);
    setTimeout(() => window.addEventListener("click", close), 0);
    return () => window.removeEventListener("click", close);
  }, [showSaveMenu]);
  const addNode = gender => {
    saveHistory();
    const r = wrapRef.current?.getBoundingClientRect();
    const x = r ? r.width / 2 - NS / 2 + (Math.random() - 0.5) * 120 : 200;
    const y = r ? r.height / 3 + (Math.random() - 0.5) * 80 : 150;
    setNodes(p => [...p, {
      id: uid(),
      gender,
      dead: false,
      client: false,
      substance: ["임신", "사산아", "자연유산", "인공유산"].includes(gender) ? null : null,
      label: "",
      age: "",
      x,
      y
    }]);
  };
  const toggleDead = () => {
    const sel = Array.from(selected).filter(id => nodes.some(n => n.id === id));
    if (!sel.length) return;
    saveHistory();
    setNodes(p => p.map(n => sel.includes(n.id) ? {
      ...n,
      dead: !n.dead
    } : n));
  };
  const toggleSubstance = type => {
    const sel = Array.from(selected).filter(id => nodes.some(n => n.id === id));
    if (!sel.length) return;
    saveHistory();
    setNodes(p => p.map(n => sel.includes(n.id) ? {
      ...n,
      substance: n.substance === type ? null : type
    } : n));
  };
  const toggleClient = useCallback(() => {
    const sel = Array.from(selected).filter(id => nodes.some(n => n.id === id));
    if (!sel.length) return;
    saveHistory();
    setNodes(p => p.map(n => sel.includes(n.id) ? {
      ...n,
      client: !n.client
    } : n));
  }, [selected, nodes, saveHistory]);
  const snapPos = (x, y, excludeId) => {
    let sx = x,
      sy = y;
    const cx = x + NS / 2,
      cy = y + NS / 2;
    const MARRIAGE_SNAP = 32;

    // 노드끼리 스냅
    for (const n of nodes) {
      if (n.id === excludeId) continue;
      if (Math.abs(n.x - x) < SNAP) sx = n.x;
      if (Math.abs(n.y - y) < SNAP) sy = n.y;
      if (Math.abs(n.x + NS / 2 - (x + NS / 2)) < SNAP) sx = n.x;
      if (Math.abs(n.y + NS / 2 - (y + NS / 2)) < SNAP) sy = n.y;
    }

    // 결혼선 중앙 아래에 스냅 (자녀 철컥)
    for (const m of marriages) {
      const ml = lines.find(l => l.id === m.id);
      if (!ml) continue;
      const p1 = getEndpoint(ml.from, nodes, lines);
      const p2 = getEndpoint(ml.to, nodes, lines);
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const targetX = midX - NS / 2;
      const targetY = midY + CHILD_DROP - NS / 2;
      if (Math.abs(cx - midX) < MARRIAGE_SNAP && Math.abs(cy - (midY + CHILD_DROP)) < MARRIAGE_SNAP) {
        sx = targetX;
        sy = targetY;
      }
    }
    return {
      x: sx,
      y: sy
    };
  };
  const doDelete = useCallback(() => {
    // 범례 삭제
    if (legendSelected) {
      setLegendVisible(false);
      setLegendSelected(false);
      return;
    }
    // 텍스트박스 삭제
    if (textBoxes.some(t => selected.has(t.id))) {
      saveHistory();
      setTextBoxes(p => p.filter(t => !selected.has(t.id)));
      setSelected(new Set());
      return;
    }
    if (!selected.size) return;
    saveHistory();
    const sel = new Set(selected);
    setNodes(p => p.filter(n => !sel.has(n.id)));
    setLines(p => p.filter(l => !sel.has(l.id) && !sel.has(l.from) && !sel.has(l.to)));
    setMarriages(p => p.map(m => {
      if (sel.has(m.id)) return null;
      const rem = m.childIds.filter(c => !sel.has(c));
      return rem.length === 0 ? null : {
        ...m,
        childIds: rem
      };
    }).filter(Boolean));
    setSelected(new Set());
  }, [selected, legendSelected, saveHistory]);
  const connectNodes = (fromId, toId, lt) => {
    saveHistory();
    const key = (a, b) => [a, b].sort().join(":");
    const pairKey = key(fromId, toId);
    const isFamily = FAMILY_TYPES.includes(lt);
    setLines(prev => {
      let next = [...prev];
      if (isFamily) {
        const removed = next.filter(l => key(l.from, l.to) === pairKey && FAMILY_TYPES.includes(l.lineType));
        removed.forEach(r => setMarriages(m => m.filter(mm => mm.id !== r.id)));
        next = next.filter(l => !(key(l.from, l.to) === pairKey && FAMILY_TYPES.includes(l.lineType)));
      } else {
        next = next.filter(l => !(key(l.from, l.to) === pairKey && !FAMILY_TYPES.includes(l.lineType)));
      }
      const newLine = {
        id: uid(),
        from: fromId,
        to: toId,
        lineType: lt
      };
      if (MARRIAGE_TYPES.includes(lt)) setMarriages(m => [...m, {
        id: newLine.id,
        childIds: []
      }]);
      return [...next, newLine];
    });
  };
  const handleNodeClick = (e, id) => {
    e.stopPropagation();
    if (connectingFrom !== null) {
      if (connectingMode === "child") {
        saveHistory();
        setMarriages(p => p.map(m => m.id === connectingFrom ? {
          ...m,
          childIds: [...new Set([...m.childIds, id])],
          childLineTypes: {
            ...m.childLineTypes,
            [id]: childLineType
          }
        } : m));
        setConnectingFrom(null);
        return;
      }
      if (connectingFrom === id) {
        setConnectingFrom(null);
        return;
      }
      connectNodes(connectingFrom, id, lineType);
      setConnectingFrom(null);
      return;
    }
    if (e.shiftKey) {
      setSelected(p => {
        const n = new Set(p);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      });
    } else {
      setSelected(p => p.size === 1 && p.has(id) ? new Set() : new Set([id]));
    }
  };
  const handleLineClick = (e, id) => {
    e.stopPropagation();
    if (connectingFrom !== null) {
      setConnectingFrom(null);
      return;
    }
    if (e.shiftKey) {
      setSelected(p => {
        const n = new Set(p);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      });
    } else {
      setSelected(p => p.size === 1 && p.has(id) ? new Set() : new Set([id]));
    }
  };
  const handleLineRightClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (marriages.some(m => m.id === id)) {
      setConnectingFrom(id);
      setConnectingMode("child");
    }
  };
  const handleNodeRightClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setConnectingFrom(id);
    setConnectingMode("node");
  };
  const onNodeDown = (e, id) => {
    e.stopPropagation();
    if (connectingFrom) return;
    const pt = svgPt(e.clientX, e.clientY);
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    if (!selected.has(id) && !e.shiftKey) setSelected(new Set([id]));
    dragRef.current = {
      id,
      ox: pt.x - node.x,
      oy: pt.y - node.y
    };
  };
  const onMouseMove = e => {
    // 패닝 중
    if (isPanning.current && panRef.current) {
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      setPan({
        x: panRef.current.panX + dx,
        y: panRef.current.panY + dy
      });
      return;
    }
    if (dragRef.current) {
      const pt = svgPt(e.clientX, e.clientY);
      const {
        id,
        ox,
        oy
      } = dragRef.current;
      if (selected.has(id) && selected.size > 1) {
        const cur = nodes.find(n => n.id === id);
        if (cur) {
          const snapped = snapPos(pt.x - ox, pt.y - oy, id);
          const dx = snapped.x - cur.x,
            dy = snapped.y - cur.y;
          setNodes(p => p.map(n => selected.has(n.id) ? {
            ...n,
            x: n.x + dx,
            y: n.y + dy
          } : n));
        }
      } else {
        const snapped = snapPos(pt.x - ox, pt.y - oy, id);
        setNodes(p => p.map(n => n.id === id ? {
          ...n,
          x: snapped.x,
          y: snapped.y
        } : n));
      }
    }
    if (rbStart.current) {
      const pt = svgPt(e.clientX, e.clientY);
      setRubber({
        x: Math.min(rbStart.current.x, pt.x),
        y: Math.min(rbStart.current.y, pt.y),
        w: Math.abs(pt.x - rbStart.current.x),
        h: Math.abs(pt.y - rbStart.current.y)
      });
    }
    if (tbDragRef.current) {
      const pt = svgPt(e.clientX, e.clientY);
      const {
        id,
        type,
        ox,
        oy,
        initW,
        initH
      } = tbDragRef.current;
      if (type === "move") {
        setTextBoxes(p => p.map(t => t.id === id ? {
          ...t,
          x: pt.x - ox,
          y: pt.y - oy
        } : t));
      } else if (type === "resize") {
        setTextBoxes(p => p.map(t => t.id === id ? {
          ...t,
          w: Math.max(60, (initW || 100) + (pt.x - ox)),
          h: Math.max(30, (initH || 40) + (pt.y - oy))
        } : t));
      }
    }
    if (legendDragRef.current) {
      const pt = svgPt(e.clientX, e.clientY);
      const {
        type,
        ox,
        oy,
        initW,
        initH,
        initF
      } = legendDragRef.current;
      if (type === "move") {
        setLegendPos({
          x: pt.x - ox,
          y: pt.y - oy
        });
      } else if (type === "resizeBox") {
        const dw = pt.x - ox,
          dh = pt.y - oy;
        setLegendBoxW(Math.max(140, (initW || 210) + dw));
        if (initH) setLegendBoxH(Math.max(80, initH + dh));
      } else if (type === "resizeFont") {
        const dy = oy - pt.y; // 위로 드래그하면 커짐
        setLegendFontScale(Math.max(0.5, Math.min(2.5, (initF || 1) + dy / 80)));
      }
    }
  };
  const onMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      panRef.current = null;
      return;
    }
    if (rubber && rubber.w > 4 && rubber.h > 4) {
      const {
        x,
        y,
        w,
        h
      } = rubber;
      const s = new Set();
      nodes.forEach(n => {
        const cx = n.x + NS / 2,
          cy = n.y + NS / 2;
        if (cx >= x && cx <= x + w && cy >= y && cy <= y + h) s.add(n.id);
      });
      lines.forEach(l => {
        const p1 = getEndpoint(l.from, nodes, lines),
          p2 = getEndpoint(l.to, nodes, lines);
        const mx = (p1.x + p2.x) / 2,
          my = (p1.y + p2.y) / 2;
        if (mx >= x && mx <= x + w && my >= y && my <= y + h) s.add(l.id);
      });
      if (s.size) setSelected(s);
    }
    dragRef.current = null;
    rbStart.current = null;
    legendDragRef.current = null;
    tbDragRef.current = null;
    setRubber(null);
  };
  const onCanvasDown = e => {
    if (e.target.tagName !== "svg") return;
    setLegendSelected(false);
    // 마우스 가운데 버튼 또는 Alt+클릭 → 패닝
    if (e.button === 1 || e.altKey) {
      isPanning.current = true;
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y
      };
      e.preventDefault();
      return;
    }
    if (textBoxMode) {
      const pt = svgPt(e.clientX, e.clientY);
      saveHistory();
      const nb = {
        id: uid(),
        x: pt.x,
        y: pt.y,
        w: 120,
        h: 40,
        text: "텍스트",
        color: textBoxColor,
        fontSize: 14
      };
      setTextBoxes(p => [...p, nb]);
      setEditingTbId(nb.id);
      setTextBoxMode(false);
      return;
    }
    if (!connectingFrom) {
      setSelected(new Set());
      rbStart.current = svgPt(e.clientX, e.clientY);
    }
  };
  const onWheel = e => {
    e.preventDefault();
    const r = wrapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - r.left;
    const mouseY = e.clientY - r.top;
    const factor = Math.pow(0.999, e.deltaY);
    setZoom(prev => {
      const next = Math.min(4, Math.max(0.2, prev * factor));
      // 마우스 위치 기준으로 줌 (마우스 포인터 아래 내용 고정)
      setPan(p => ({
        x: mouseX - (mouseX - p.x) * (next / prev),
        y: mouseY - (mouseY - p.y) * (next / prev)
      }));
      return next;
    });
  };
  const startEdit = (e, id, field) => {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = null;
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    setEditId(id);
    setEditField(field);
    setEditVal(field === "label" ? node.label : node.age);
  };
  const commitEdit = () => {
    if (!editId) return;
    setNodes(p => p.map(n => n.id === editId ? {
      ...n,
      [editField]: editVal
    } : n));
    setEditId(null);
  };

  // ── JSON 저장 ──
  const saveJSON = () => {
    const data = {
      nodes,
      lines,
      marriages,
      textBoxes,
      legendPos,
      legendBoxW,
      legendBoxH,
      legendFontScale,
      legendLabelOverrides,
      legendVisible
    };
    const date = new Date().toLocaleDateString('ko-KR').replace(/\. /g, '-').replace('.', '');
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `가계도_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── JSON 불러오기 ──
  const loadJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          saveHistory();
          if (data.nodes) setNodes(data.nodes);
          if (data.lines) setLines(data.lines);
          if (data.marriages) setMarriages(data.marriages);
          if (data.textBoxes) setTextBoxes(data.textBoxes);
          if (data.legendPos !== undefined) setLegendPos(data.legendPos);
          if (data.legendBoxW) setLegendBoxW(data.legendBoxW);
          if (data.legendBoxH !== undefined) setLegendBoxH(data.legendBoxH);
          if (data.legendFontScale) setLegendFontScale(data.legendFontScale);
          if (data.legendLabelOverrides) setLegendLabelOverrides(data.legendLabelOverrides);
          if (data.legendVisible !== undefined) setLegendVisible(data.legendVisible);
        } catch {
          alert('파일을 읽을 수 없습니다. 올바른 가계도 파일인지 확인해주세요.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const saveImg = () => {
    const svg = svgRef.current;
    if (!svg || !nodes.length) return;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x - 10);
      minY = Math.min(minY, n.y - 10);
      maxX = Math.max(maxX, n.x + NS + 10);
      maxY = Math.max(maxY, n.y + NS + 30);
    });
    const canvasW = wrapRef.current?.clientWidth || canvasSize.w,
      canvasH = wrapRef.current?.clientHeight || canvasSize.h;
    const lx = legendPos?.x ?? canvasW - legendBoxW - 16,
      ly = legendPos?.y ?? canvasH - 300;
    minX = Math.min(minX, lx - 10);
    minY = Math.min(minY, ly - 10);
    maxX = Math.max(maxX, lx + legendBoxW + 10);
    maxY = Math.max(maxY, ly + (legendBoxH || 400) + 10);
    const pad = 20;
    const data = new XMLSerializer().serializeToString(svg);
    const modified = data.replace(/viewBox="[^"]*"/, `viewBox="${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}"`);
    const blob = new Blob([modified], {
      type: "image/svg+xml"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "가계도.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 노드 경계까지만 선이 닿도록 끝점을 조정 (화살표가 도형 위에 보이게)
  const clipToNodeBoundary = (cx, cy, tx, ty, nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return {
      x: tx,
      y: ty
    };
    const r = NS / 2 + 2; // 노드 반경 + 여백
    const dx = tx - cx,
      dy = ty - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return {
      x: tx,
      y: ty
    };
    return {
      x: tx - dx / dist * r,
      y: ty - dy / dist * r
    };
  };

  // 선 렌더
  const renderLine = l => {
    const isEmo = !FAMILY_TYPES.includes(l.lineType);
    const rawP1 = getEndpoint(l.from, nodes, lines),
      rawP2 = getEndpoint(l.to, nodes, lines);
    const isSel = selected.has(l.id);
    const col = lineColor(l.lineType, bw, isSel);
    const {
      x1,
      y1,
      x2,
      y2
    } = isEmo ? offsetPts(rawP1.x, rawP1.y, rawP2.x, rawP2.y, 10) : {
      x1: rawP1.x,
      y1: rawP1.y,
      x2: rawP2.x,
      y2: rawP2.y
    };
    const hit = /*#__PURE__*/React.createElement("path", {
      key: "hit",
      d: `M ${x1} ${y1} L ${x2} ${y2}`,
      stroke: "#000",
      strokeWidth: 22,
      opacity: 0,
      fill: "none",
      pointerEvents: "stroke"
    });
    const elems = [hit];
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpX = Math.cos(angle + Math.PI / 2),
      perpY = Math.sin(angle + Math.PI / 2);
    const midX = (x1 + x2) / 2,
      midY = (y1 + y2) / 2;
    if (l.lineType === "결혼") {
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 3
      }));
    } else if (l.lineType === "별거") {
      // 연결된 선 + 중간에 "/" 방향 사선 1개 (화면 기준 고정)
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("line", {
        key: "sl",
        x1: midX - 4,
        y1: midY + 8,
        x2: midX + 4,
        y2: midY - 8,
        stroke: col,
        strokeWidth: 2
      }));
    } else if (l.lineType === "이혼") {
      // 연결된 선 + 중간에 "/" 방향 사선 2개 (화면 기준 고정)
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 2
      }));
      [-6, 6].forEach((offset, i) => {
        const ox = Math.cos(angle) * offset,
          oy = Math.sin(angle) * offset;
        elems.push(/*#__PURE__*/React.createElement("line", {
          key: `sl${i}`,
          x1: midX + ox - 4,
          y1: midY + oy + 8,
          x2: midX + ox + 4,
          y2: midY + oy - 8,
          stroke: col,
          strokeWidth: 2
        }));
      });
    } else if (l.lineType === "재결합") {
      // // + \ 재결합 기호 — 세 선이 같은 중심에 겹침
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 2
      }));
      // / / 두 선 — 가깝게 붙임
      [-3, 3].forEach((offset, i) => {
        const ox = Math.cos(angle) * offset,
          oy = Math.sin(angle) * offset;
        elems.push(/*#__PURE__*/React.createElement("line", {
          key: `sl${i}`,
          x1: midX + ox - 4,
          y1: midY + oy + 7,
          x2: midX + ox + 4,
          y2: midY + oy - 7,
          stroke: col,
          strokeWidth: 2
        }));
      });
      // \ 한 선 — 더 길게 가로지름
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "sr",
        x1: midX - 9,
        y1: midY - 9,
        x2: midX + 9,
        y2: midY + 9,
        stroke: col,
        strokeWidth: 2
      }));
    } else if (l.lineType === "동거") {
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 2,
        strokeDasharray: "12 6"
      }));
    } else if (l.lineType === "소원") {
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l",
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 1.5,
        strokeDasharray: "2 3"
      }));
    } else if (l.lineType === "친밀") {
      const o1 = offsetPts(x1, y1, x2, y2, 3.5),
        o2 = offsetPts(x1, y1, x2, y2, -3.5);
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "d1",
        x1: o1.x1,
        y1: o1.y1,
        x2: o1.x2,
        y2: o1.y2,
        stroke: col,
        strokeWidth: 2
      }));
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "d2",
        x1: o2.x1,
        y1: o2.y1,
        x2: o2.x2,
        y2: o2.y2,
        stroke: col,
        strokeWidth: 2
      }));
    } else if (l.lineType === "밀착") {
      [-5, 0, 5].forEach((off, i) => {
        const o = offsetPts(x1, y1, x2, y2, off);
        elems.push(/*#__PURE__*/React.createElement("line", {
          key: `t${i}`,
          x1: o.x1,
          y1: o.y1,
          x2: o.x2,
          y2: o.y2,
          stroke: col,
          strokeWidth: 2
        }));
      });
    } else if (l.lineType === "단절") {
      // 두 선이 끊겨 있고, 끊긴 양쪽 끝에 수직 세로선
      const gap = 14;
      const ex1x = midX - Math.cos(angle) * gap,
        ex1y = midY - Math.sin(angle) * gap;
      const ex2x = midX + Math.cos(angle) * gap,
        ex2y = midY + Math.sin(angle) * gap;
      elems.push(/*#__PURE__*/React.createElement("line", {
        key: "l1",
        x1: x1,
        y1: y1,
        x2: ex1x,
        y2: ex1y,
        stroke: col,
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("line", {
        key: "l2",
        x1: ex2x,
        y1: ex2y,
        x2: x2,
        y2: y2,
        stroke: col,
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("line", {
        key: "bar1",
        x1: ex1x - perpX * 8,
        y1: ex1y - perpY * 8,
        x2: ex1x + perpX * 8,
        y2: ex1y + perpY * 8,
        stroke: col,
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("line", {
        key: "bar2",
        x1: ex2x - perpX * 8,
        y1: ex2y - perpY * 8,
        x2: ex2x + perpX * 8,
        y2: ex2y + perpY * 8,
        stroke: col,
        strokeWidth: 2
      }));
    } else if (l.lineType === "갈등") {
      elems.push(/*#__PURE__*/React.createElement("path", {
        key: "l",
        d: sharpZigzag(x1, y1, x2, y2),
        stroke: col,
        strokeWidth: 2,
        fill: "none"
      }));
    } else if (l.lineType === "융합된갈등") {
      const o1 = offsetPts(x1, y1, x2, y2, 4),
        o2 = offsetPts(x1, y1, x2, y2, -4);
      elems.push(/*#__PURE__*/React.createElement("path", {
        key: "z1",
        d: sharpZigzag(o1.x1, o1.y1, o1.x2, o1.y2),
        stroke: col,
        strokeWidth: 1.5,
        fill: "none"
      }));
      elems.push(/*#__PURE__*/React.createElement("path", {
        key: "z2",
        d: sharpZigzag(o2.x1, o2.y1, o2.x2, o2.y2),
        stroke: col,
        strokeWidth: 1.5,
        fill: "none"
      }));
    } else if (l.lineType === "신체적학대") {
      const tip = clipToNodeBoundary(x1, y1, x2, y2, l.to);
      const tipAngle = Math.atan2(tip.y - y1, tip.x - x1);
      const arrowLen = 14;
      const pathD = waveZigzag(x1, y1, tip.x - Math.cos(tipAngle) * arrowLen, tip.y - Math.sin(tipAngle) * arrowLen);
      elems.push(/*#__PURE__*/React.createElement("path", {
        key: "w",
        d: pathD,
        stroke: col,
        strokeWidth: 2,
        fill: "none"
      }));
      elems.push(/*#__PURE__*/React.createElement("polygon", {
        key: "a",
        points: `${tip.x},${tip.y} ${tip.x - Math.cos(tipAngle - Math.PI / 6) * arrowLen},${tip.y - Math.sin(tipAngle - Math.PI / 6) * arrowLen} ${tip.x - Math.cos(tipAngle + Math.PI / 6) * arrowLen},${tip.y - Math.sin(tipAngle + Math.PI / 6) * arrowLen}`,
        fill: col
      }));
    } else if (l.lineType === "성적학대") {
      const tip = clipToNodeBoundary(x1, y1, x2, y2, l.to);
      const tipAngle = Math.atan2(tip.y - y1, tip.x - x1);
      const arrowLen = 14;
      const pathD = sharpZigzag(x1, y1, tip.x - Math.cos(tipAngle) * arrowLen, tip.y - Math.sin(tipAngle) * arrowLen);
      elems.push(/*#__PURE__*/React.createElement("path", {
        key: "z",
        d: pathD,
        stroke: col,
        strokeWidth: 2,
        fill: "none"
      }));
      elems.push(/*#__PURE__*/React.createElement("polygon", {
        key: "a",
        points: `${tip.x},${tip.y} ${tip.x - Math.cos(tipAngle - Math.PI / 6) * arrowLen},${tip.y - Math.sin(tipAngle - Math.PI / 6) * arrowLen} ${tip.x - Math.cos(tipAngle + Math.PI / 6) * arrowLen},${tip.y - Math.sin(tipAngle + Math.PI / 6) * arrowLen}`,
        fill: col
      }));
    } else if (l.lineType === "약혼") {
      elems.push(/*#__PURE__*/React.createElement("line", {key:"l",x1,y1,x2,y2,stroke:col,strokeWidth:2}));
      elems.push(/*#__PURE__*/React.createElement("circle", {key:"c",cx:midX,cy:midY,r:5,fill:"white",stroke:col,strokeWidth:1.5}));
    } else if (l.lineType === "사별") {
      elems.push(/*#__PURE__*/React.createElement("line", {key:"l",x1,y1,x2,y2,stroke:col,strokeWidth:2}));
      const cl = 10;
      elems.push(/*#__PURE__*/React.createElement("line", {key:"c",x1:midX+perpX*cl,y1:midY+perpY*cl,x2:midX-perpX*cl,y2:midY-perpY*cl,stroke:col,strokeWidth:2}));
    } else if (l.lineType === "무관심") {
      elems.push(/*#__PURE__*/React.createElement("line", {key:"l",x1,y1,x2,y2,stroke:col,strokeWidth:1.5,strokeDasharray:"8 5"}));
    } else if (l.lineType === "정서적학대") {
      const tip2 = clipToNodeBoundary(x1,y1,x2,y2,l.to);
      const ta = Math.atan2(tip2.y-y1,tip2.x-x1);
      const al = 14;
      elems.push(/*#__PURE__*/React.createElement("line", {key:"l",x1,y1,x2:tip2.x-Math.cos(ta)*al,y2:tip2.y-Math.sin(ta)*al,stroke:col,strokeWidth:2,strokeDasharray:"5 3"}));
      elems.push(/*#__PURE__*/React.createElement("polygon", {key:"a",points:`${tip2.x},${tip2.y} ${tip2.x-Math.cos(ta-Math.PI/6)*al},${tip2.y-Math.sin(ta-Math.PI/6)*al} ${tip2.x-Math.cos(ta+Math.PI/6)*al},${tip2.y-Math.sin(ta+Math.PI/6)*al}`,fill:col}));
    } else if (l.lineType === "방임") {
      const tip3 = clipToNodeBoundary(x1,y1,x2,y2,l.to);
      const ta3 = Math.atan2(tip3.y-y1,tip3.x-x1);
      const al3 = 14;
      elems.push(/*#__PURE__*/React.createElement("line", {key:"l",x1,y1,x2:tip3.x-Math.cos(ta3)*al3,y2:tip3.y-Math.sin(ta3)*al3,stroke:col,strokeWidth:1.5,strokeDasharray:"3 4"}));
      elems.push(/*#__PURE__*/React.createElement("polygon", {key:"a",points:`${tip3.x},${tip3.y} ${tip3.x-Math.cos(ta3-Math.PI/6)*al3},${tip3.y-Math.sin(ta3-Math.PI/6)*al3} ${tip3.x-Math.cos(ta3+Math.PI/6)*al3},${tip3.y-Math.sin(ta3+Math.PI/6)*al3}`,fill:col}));
    } else if (l.lineType === "통제") {
      const tip4 = clipToNodeBoundary(x1,y1,x2,y2,l.to);
      const ta4 = Math.atan2(tip4.y-y1,tip4.x-x1);
      const al4 = 14;
      const tip4b = clipToNodeBoundary(x2,y2,x1,y1,l.from);
      const ta4b = Math.atan2(tip4b.y-y2,tip4b.x-x2);
      elems.push(/*#__PURE__*/React.createElement("line", {key:"l",x1:tip4b.x,y1:tip4b.y,x2:tip4.x,y2:tip4.y,stroke:col,strokeWidth:2.5}));
      elems.push(/*#__PURE__*/React.createElement("polygon", {key:"a1",points:`${tip4.x},${tip4.y} ${tip4.x-Math.cos(ta4-Math.PI/6)*al4},${tip4.y-Math.sin(ta4-Math.PI/6)*al4} ${tip4.x-Math.cos(ta4+Math.PI/6)*al4},${tip4.y-Math.sin(ta4+Math.PI/6)*al4}`,fill:col}));
      elems.push(/*#__PURE__*/React.createElement("polygon", {key:"a2",points:`${tip4b.x},${tip4b.y} ${tip4b.x-Math.cos(ta4b-Math.PI/6)*al4},${tip4b.y-Math.sin(ta4b-Math.PI/6)*al4} ${tip4b.x-Math.cos(ta4b+Math.PI/6)*al4},${tip4b.y-Math.sin(ta4b+Math.PI/6)*al4}`,fill:col}));
    }
    return elems;
  };
  const renderMarriage = m => {
    const ml = lines.find(l => l.id === m.id);
    if (!ml) return null;
    const p1 = getEndpoint(ml.from, nodes, lines),
      p2 = getEndpoint(ml.to, nodes, lines);
    const children = m.childIds.map(cid => nodes.find(n => n.id === cid)).filter(Boolean);
    if (!children.length) return null;
    const midX = (p1.x + p2.x) / 2,
      parentY = (p1.y + p2.y) / 2,
      dropY = parentY + CHILD_DROP;
    const xs = children.map(c => nc(c).x);
    const topOf = c => ["임신", "사산아", "자연유산", "인공유산"].includes(c.gender) ? ncTop(c) : {
      x: nc(c).x,
      y: c.y
    };
    const col = "#374151";
    const sw = 2;
    const twinGroups = m.twinGroups || [];
    const twinIds = new Set(twinGroups.flat());
    const nonTwinChildren = children.filter(c => !twinIds.has(c.id));
    return /*#__PURE__*/React.createElement("g", {
      key: `m-${m.id}`
    }, nonTwinChildren.length === 1 ? (() => {
      // 자녀 1명: parentY → 자녀 도형 상단까지 전체를 특수선으로
      const c = nonTwinChildren[0];
      const clt = m.childLineTypes?.[c.id] || "일반";
      const cx = nc(c).x;
      const ty = topOf(c).y;
      if (clt === "위탁") return /*#__PURE__*/React.createElement("line", {
        key: c.id,
        x1: midX,
        y1: parentY,
        x2: cx,
        y2: ty,
        stroke: col,
        strokeWidth: sw,
        strokeDasharray: "6 4"
      });
      if (clt === "입양") return /*#__PURE__*/React.createElement("g", {
        key: c.id
      }, /*#__PURE__*/React.createElement("line", {
        x1: midX - 3,
        y1: parentY,
        x2: cx - 3,
        y2: ty,
        stroke: col,
        strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: midX + 3,
        y1: parentY,
        x2: cx + 3,
        y2: ty,
        stroke: col,
        strokeWidth: sw,
        strokeDasharray: "5 4"
      }));
      // 일반
      return /*#__PURE__*/React.createElement("line", {
        key: c.id,
        x1: midX,
        y1: parentY,
        x2: cx,
        y2: ty,
        stroke: col,
        strokeWidth: sw
      });
    })() : nonTwinChildren.length > 1 ?
    /*#__PURE__*/
    // 자녀 2명 이상: 기존 방식 (수직선 → 수평바 → 각 자녀)
    React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: midX,
      y1: parentY,
      x2: midX,
      y2: dropY,
      stroke: col,
      strokeWidth: sw
    }), /*#__PURE__*/React.createElement("line", {
      x1: Math.min(...nonTwinChildren.map(c => nc(c).x)),
      y1: dropY,
      x2: Math.max(...nonTwinChildren.map(c => nc(c).x)),
      y2: dropY,
      stroke: col,
      strokeWidth: sw
    }), nonTwinChildren.map(c => {
      const clt = m.childLineTypes?.[c.id] || "일반";
      const cx = nc(c).x;
      const ty = topOf(c).y;
      if (clt === "위탁") return /*#__PURE__*/React.createElement("line", {
        key: c.id,
        x1: cx,
        y1: dropY,
        x2: cx,
        y2: ty,
        stroke: col,
        strokeWidth: sw,
        strokeDasharray: "6 4"
      });
      if (clt === "입양") return /*#__PURE__*/React.createElement("g", {
        key: c.id
      }, /*#__PURE__*/React.createElement("line", {
        x1: cx - 3,
        y1: dropY,
        x2: cx - 3,
        y2: ty,
        stroke: col,
        strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: cx + 3,
        y1: dropY,
        x2: cx + 3,
        y2: ty,
        stroke: col,
        strokeWidth: sw,
        strokeDasharray: "5 4"
      }));
      return /*#__PURE__*/React.createElement("line", {
        key: c.id,
        x1: cx,
        y1: dropY,
        x2: cx,
        y2: ty,
        stroke: col,
        strokeWidth: sw
      });
    })) : null, twinGroups.map((group, gi) => {
      const gc = group.map(id => nodes.find(n => n.id === id)).filter(Boolean);
      if (gc.length < 2) return null;
      const gxs = gc.map(c => nc(c).x);
      const gMid = (Math.min(...gxs) + Math.max(...gxs)) / 2;
      const isIdentical = gc.some(c => c.identical);
      const childMidY = Math.min(...gc.map(c => nc(c).y));
      return /*#__PURE__*/React.createElement("g", {
        key: gi
      }, gc.map(c => {
        const clt = m.childLineTypes?.[c.id] || "일반";
        const ty = topOf(c).y;
        const cx = nc(c).x;
        if (clt === "위탁") return /*#__PURE__*/React.createElement("line", {
          key: c.id,
          x1: gMid,
          y1: parentY,
          x2: cx,
          y2: ty,
          stroke: col,
          strokeWidth: sw,
          strokeDasharray: "6 4"
        });
        if (clt === "입양") return /*#__PURE__*/React.createElement("g", {
          key: c.id
        }, /*#__PURE__*/React.createElement("line", {
          x1: gMid - 3,
          y1: parentY,
          x2: cx - 3,
          y2: ty,
          stroke: col,
          strokeWidth: sw
        }), /*#__PURE__*/React.createElement("line", {
          x1: gMid + 3,
          y1: parentY,
          x2: cx + 3,
          y2: ty,
          stroke: col,
          strokeWidth: sw,
          strokeDasharray: "5 4"
        }));
        return /*#__PURE__*/React.createElement("line", {
          key: c.id,
          x1: gMid,
          y1: parentY,
          x2: cx,
          y2: ty,
          stroke: col,
          strokeWidth: sw
        });
      }), isIdentical && /*#__PURE__*/React.createElement("line", {
        x1: Math.min(...gxs),
        y1: childMidY,
        x2: Math.max(...gxs),
        y2: childMidY,
        stroke: col,
        strokeWidth: sw
      }));
    }));
  };
  const renderShape = (n, isSel, isConn) => {
    const s = isSel ? "#3a6a4a" : isConn ? "#f59e0b" : "#222";
    const sw = isSel || isConn ? 3 : 2,
      half = NS / 2;

    // 특수 자녀 도형 — 기본 도형 그리기 전에 early return
    if (n.gender === "임신") {
      const cx = NS / 2,
        by = NS / 2 + 15,
        ty = NS / 2 - 15,
        hw = 17;
      return /*#__PURE__*/React.createElement("g", {
        key: n.id
      }, /*#__PURE__*/React.createElement("polygon", {
        points: `${cx},${ty} ${cx + hw},${by} ${cx - hw},${by}`,
        fill: "white",
        stroke: s,
        strokeWidth: sw
      }));
    }
    if (n.gender === "사산아") {
      const sz = NS * 0.5, ox = (NS - sz) / 2, oy = (NS - sz) / 2;
      return /*#__PURE__*/React.createElement("g", {
        key: n.id
      }, /*#__PURE__*/React.createElement("rect", {
        x: ox, y: oy, width: sz, height: sz,
        fill: "white", stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: ox + 4, y1: oy + 4, x2: ox + sz - 4, y2: oy + sz - 4,
        stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: ox + sz - 4, y1: oy + 4, x2: ox + 4, y2: oy + sz - 4,
        stroke: s, strokeWidth: sw
      }));
    }
    if (n.gender === "자연유산") {
      const cx = NS/2, by = NS/2+15, ty = NS/2-15, hw = 17;
      return /*#__PURE__*/React.createElement("g", {
        key: n.id
      }, /*#__PURE__*/React.createElement("polygon", {
        points: `${cx},${ty} ${cx+hw},${by} ${cx-hw},${by}`,
        fill: "white", stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: cx-8, y1: NS/2-4, x2: cx+8, y2: NS/2+8, stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: cx+8, y1: NS/2-4, x2: cx-8, y2: NS/2+8, stroke: s, strokeWidth: sw
      }));
    }
    if (n.gender === "인공유산") {
      const cx = NS/2, by = NS/2+15, ty = NS/2-15, hw = 17;
      return /*#__PURE__*/React.createElement("g", {
        key: n.id
      }, /*#__PURE__*/React.createElement("polygon", {
        points: `${cx},${ty} ${cx+hw},${by} ${cx-hw},${by}`,
        fill: "white", stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: cx-8, y1: NS/2-4, x2: cx+8, y2: NS/2+8, stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: cx+8, y1: NS/2-4, x2: cx-8, y2: NS/2+8, stroke: s, strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        x1: cx-hw+2, y1: by-5, x2: cx+hw-2, y2: by-5, stroke: s, strokeWidth: sw
      }));
    }
    const parts = [];
    const gap = 4; // 이중도형 간격

    if (n.gender === "남성") {
      if (n.client) parts.push(/*#__PURE__*/React.createElement("rect", {
        key: "outer",
        x: 0,
        y: 0,
        width: NS,
        height: NS,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
      parts.push(/*#__PURE__*/React.createElement("rect", {
        key: "s",
        x: n.client ? gap : 3,
        y: n.client ? gap : 3,
        width: NS - (n.client ? gap * 2 : 6),
        height: NS - (n.client ? gap * 2 : 6),
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
    } else if (n.gender === "여성") {
      if (n.client) parts.push(/*#__PURE__*/React.createElement("circle", {
        key: "outer",
        cx: half,
        cy: half,
        r: half,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
      parts.push(/*#__PURE__*/React.createElement("circle", {
        key: "s",
        cx: half,
        cy: half,
        r: n.client ? half - gap : half - 3,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
    } else if (n.gender === "레즈비언") {
      // 원 (삼각형은 substance 패턴 이후 맨 마지막에 그림)
      if (n.client) parts.push(/*#__PURE__*/React.createElement("circle", {
        key: "outer",
        cx: half,
        cy: half,
        r: half,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
      const lr = n.client ? half - gap - 3 : half - 3;
      parts.push(/*#__PURE__*/React.createElement("circle", {
        key: "s",
        cx: half,
        cy: half,
        r: lr,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
    } else if (n.gender === "게이") {
      // 사각형 (삼각형은 substance 패턴 이후 맨 마지막에 그림)
      if (n.client) parts.push(/*#__PURE__*/React.createElement("rect", {
        key: "outer",
        x: 0,
        y: 0,
        width: NS,
        height: NS,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
      const gi2 = n.client ? gap : 3;
      parts.push(/*#__PURE__*/React.createElement("rect", {
        key: "s",
        x: gi2,
        y: gi2,
        width: NS - gi2 * 2,
        height: NS - gi2 * 2,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
    } else {
      // 논바이너리 마름모
      if (n.client) parts.push(/*#__PURE__*/React.createElement("polygon", {
        key: "outer",
        points: `${half},0 ${NS},${half} ${half},${NS} 0,${half}`,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
      parts.push(/*#__PURE__*/React.createElement("polygon", {
        key: "s",
        points: `${half},${n.client ? gap + 1 : 3} ${NS - (n.client ? gap + 1 : 3)},${half} ${half},${NS - (n.client ? gap + 1 : 3)} ${n.client ? gap + 1 : 3},${half}`,
        fill: "#fff",
        stroke: s,
        strokeWidth: sw
      }));
    }
    // 약물남용 패턴
    if (n.substance === "약물남용") {
      // 아래 절반 검정 채움 — 성별 도형 클리핑
      if (n.gender === "남성" || n.gender === "게이") {
        const inner = n.client ? 4 : 3;
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub",
          x: inner,
          y: NS / 2,
          width: NS - inner * 2,
          height: NS / 2 - inner,
          fill: "#222",
          stroke: "none"
        }));
      } else if (n.gender === "여성" || n.gender === "레즈비언") {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M ${half} ${half} m -${half - 3} 0 a ${half - 3} ${half - 3} 0 0 0 ${(half - 3) * 2} 0 Z`,
          fill: "#222",
          stroke: "none"
        }));
      } else {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M 3,${half} L ${half},${NS - 3} L ${NS - 3},${half} Z`,
          fill: "#222",
          stroke: "none"
        }));
      }
    } else if (n.substance === "정신신체문제") {
      // 좌측 절반 검정 채움
      if (n.gender === "남성" || n.gender === "게이") {
        const inner = n.client ? 4 : 3;
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub",
          x: inner,
          y: inner,
          width: NS / 2 - inner,
          height: NS - inner * 2,
          fill: "#222",
          stroke: "none"
        }));
      } else if (n.gender === "여성" || n.gender === "레즈비언") {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M ${half} 3 a ${half - 3} ${half - 3} 0 0 0 0 ${(half - 3) * 2} Z`,
          fill: "#222",
          stroke: "none"
        }));
      } else {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M 3,${half} L ${half},3 L ${half},${NS - 3} Z`,
          fill: "#222",
          stroke: "none"
        }));
      }
    } else if (n.substance === "약물정신신체") {
      // 3/4 검정 채움 (우상단 1/4만 비움)
      if (n.gender === "남성" || n.gender === "게이") {
        const inner = n.client ? 4 : 3;
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub",
          x: inner,
          y: inner,
          width: NS - inner * 2,
          height: NS - inner * 2,
          fill: "#222",
          stroke: "none"
        }));
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub2",
          x: NS / 2,
          y: inner,
          width: NS / 2 - inner,
          height: NS / 2 - inner,
          fill: "white",
          stroke: "none"
        }));
      } else if (n.gender === "여성" || n.gender === "레즈비언") {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M ${half} ${half} L ${NS - 3} ${half} A ${half - 3} ${half - 3} 0 1 1 ${half} 3 Z`,
          fill: "#222",
          stroke: "none"
        }));
      } else {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M ${half},3 L ${NS - 3},${half} L ${half},${NS - 3} L 3,${half} Z`,
          fill: "#222",
          stroke: "none"
        }));
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub2",
          d: `M ${half},3 L ${NS - 3},${half} L ${half},${half} Z`,
          fill: "white",
          stroke: "none"
        }));
      }
    } else if (n.substance === "약물남용의심") {
      // 아래 절반 회색 채움
      if (n.gender === "남성" || n.gender === "게이") {
        const inner = n.client ? 4 : 3;
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub",
          x: inner,
          y: NS / 2,
          width: NS - inner * 2,
          height: NS / 2 - inner,
          fill: "#999",
          stroke: "none"
        }));
      } else if (n.gender === "여성" || n.gender === "레즈비언") {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M ${half} ${half} m -${half - 3} 0 a ${half - 3} ${half - 3} 0 0 0 ${(half - 3) * 2} 0 Z`,
          fill: "#999",
          stroke: "none"
        }));
      } else {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub",
          d: `M 3,${half} L ${half},${NS - 3} L ${NS - 3},${half} Z`,
          fill: "#999",
          stroke: "none"
        }));
      }
    } else if (n.substance === "약물남용회복") {
      // 우하단 1/4 검정 + 좌하단 1/4 회색
      if (n.gender === "남성" || n.gender === "게이") {
        const inner = n.client ? 4 : 3;
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub1",
          x: NS / 2,
          y: NS / 2,
          width: NS / 2 - inner,
          height: NS / 2 - inner,
          fill: "#999",
          stroke: "none"
        }));
        parts.push(/*#__PURE__*/React.createElement("rect", {
          key: "sub2",
          x: inner,
          y: NS / 2,
          width: NS / 2 - inner,
          height: NS / 2 - inner,
          fill: "#222",
          stroke: "none"
        }));
      } else if (n.gender === "여성" || n.gender === "레즈비언") {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub1",
          d: `M ${half} ${half} L ${NS - 3} ${half} A ${half - 3} ${half - 3} 0 0 1 ${half} ${NS - 3} Z`,
          fill: "#999",
          stroke: "none"
        }));
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub2",
          d: `M ${half} ${half} L 3 ${half} A ${half - 3} ${half - 3} 0 0 0 ${half} ${NS - 3} Z`,
          fill: "#222",
          stroke: "none"
        }));
      } else {
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub1",
          d: `M ${half},${half} L ${NS - 3},${half} L ${half},${NS - 3} Z`,
          fill: "#999",
          stroke: "none"
        }));
        parts.push(/*#__PURE__*/React.createElement("path", {
          key: "sub2",
          d: `M ${half},${half} L 3,${half} L ${half},${NS - 3} Z`,
          fill: "#222",
          stroke: "none"
        }));
      }
    }
    // 특수 자녀 도형 — 중심 NS/2 기준, 작은 크기
    if (n.dead) {
      parts.push(/*#__PURE__*/React.createElement("line", {
        key: "x1",
        x1: 8,
        y1: 8,
        x2: NS - 8,
        y2: NS - 8,
        stroke: s,
        strokeWidth: sw
      }), /*#__PURE__*/React.createElement("line", {
        key: "x2",
        x1: NS - 8,
        y1: 8,
        x2: 8,
        y2: NS - 8,
        stroke: s,
        strokeWidth: sw
      }));
    }
    // 레즈비언/게이: 속빈 역삼각형을 맨 마지막에 그려서 substance 패턴 위에 표시
    if (n.gender === "레즈비언") {
      const lr = n.client ? half - gap - 3 : half - 3;
      const lt = lr - 5;
      const pts = `${half},${half + lt} ${half - lt},${half - lt * 0.6} ${half + lt},${half - lt * 0.6}`;
      parts.push(/*#__PURE__*/React.createElement("polygon", {
        key: "tri-outline",
        points: pts,
        fill: "none",
        stroke: "white",
        strokeWidth: sw + 2
      }));
      parts.push(/*#__PURE__*/React.createElement("polygon", {
        key: "tri",
        points: pts,
        fill: "none",
        stroke: s,
        strokeWidth: sw
      }));
    }
    if (n.gender === "게이") {
      const gi2 = n.client ? gap : 3;
      const gt = (NS - gi2 * 2) / 2 - 4;
      const pts = `${half},${half + gt} ${half - gt},${half - gt * 0.6} ${half + gt},${half - gt * 0.6}`;
      parts.push(/*#__PURE__*/React.createElement("polygon", {
        key: "tri-outline",
        points: pts,
        fill: "none",
        stroke: "white",
        strokeWidth: sw + 2
      }));
      parts.push(/*#__PURE__*/React.createElement("polygon", {
        key: "tri",
        points: pts,
        fill: "none",
        stroke: s,
        strokeWidth: sw
      }));
    }
    return parts;
  };

  // 범례: 실제 사용된 조합 추출

  const usedNodeEntries = [];
  const seenKeys = new Set();
  for (const n of nodes) {
    const key = `${n.gender}_${n.dead ? "dead" : ""}_${n.client ? "client" : ""}_${n.substance ?? ""}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      const subLabel = n.substance === "약물남용" ? "약물남용" : n.substance === "정신신체문제" ? "정신신체문제" : n.substance === "약물정신신체" ? "약물+정신/신체" : n.substance === "약물남용의심" ? "약물남용 의심" : n.substance === "약물남용회복" ? "약물남용 회복" : null;
      const deadLabel = n.dead ? "(사망)" : "";
      const clientLabel = n.client ? "(내담자)" : "";
      const label = `${n.gender}${subLabel ? `(${subLabel})` : ""}${deadLabel}${clientLabel}`;
      usedNodeEntries.push({
        key,
        gender: n.gender,
        dead: n.dead,
        client: n.client,
        substance: n.substance,
        label
      });
    }
  }
  const usedNodes = usedNodeEntries; // 하위 호환용
  const usedLineTypes = [...new Set(lines.map(l => l.lineType))];

  // 자녀 라인 (일반/위탁/입양) — marriages에서 실제 사용된 것만
  const usedChildLineTypesSet = new Set();
  for (const m of marriages) {
    for (const cid of m.childIds) {
      usedChildLineTypesSet.add(m.childLineTypes?.[cid] || "일반");
    }
  }
  const usedChildLineTypes = ["일반", "위탁", "입양"].filter(t => usedChildLineTypesSet.has(t));

  // 쌍둥이 라인 — twinGroups에서 일란성/이란성 구분
  let hasIdenticalTwin = false,
    hasFraternalTwin = false;
  for (const m of marriages) {
    for (const group of m.twinGroups || []) {
      const gc = group.map(id => nodes.find(n => n.id === id)).filter(Boolean);
      if (gc.some(c => c.identical)) hasIdenticalTwin = true;else hasFraternalTwin = true;
    }
  }
  const twinEntries = [];
  if (hasFraternalTwin) twinEntries.push("이란성쌍둥이");
  if (hasIdenticalTwin) twinEntries.push("일란성쌍둥이");
  const totalItems = usedNodeEntries.length + usedLineTypes.length + usedChildLineTypes.length + twinEntries.length;
  const canvasW = canvasSize.w,
    canvasH = canvasSize.h;
  const lx = legendPos?.x ?? canvasW - legendBoxW - 16;
  // autoH: 2열 여부에 따른 실제 높이 근사 계산
  const _cols = legendBoxW >= 240 ? 2 : 1;
  const _rowH = 22 * legendFontScale;
  const _secH = 17 * legendFontScale;
  const _sectionDefs = [{
    count: usedNodeEntries.length
  }, {
    count: usedLineTypes.length
  }, {
    count: usedChildLineTypes.length
  }, {
    count: twinEntries.length
  }].filter(s => s.count > 0);
  const autoH = 24 * legendFontScale + _sectionDefs.reduce((sum, s) => sum + _secH + Math.ceil(s.count / _cols) * _rowH + 4, 0) + 6;
  const lh = legendBoxH > 0 ? legendBoxH : autoH;
  const ly = legendPos?.y ?? canvasH - lh - 16;
  const lineCategories = [{
    label: "가족\n관계",
    types: FAMILY_TYPES
  }, {
    label: "감정\n관계선",
    types: EMO_TYPES
  }, {
    label: "학대\n갈등",
    types: [...CONFLICT_TYPES, ...ABUSE_TYPES]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full",
    style: {
      fontFamily: "'Malgun Gothic', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-b border-gray-200 px-2 flex flex-col shrink-0",
    style: {
      userSelect: "none",
      overflowX: "auto",
      overflowY: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    style: {
      height: "46px",
      minHeight: "46px",
      maxHeight: "46px",
      minWidth: "max-content",
      overflow: "visible",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    style: { flexShrink: 0 },
    'data-tour': 'geo-nodes'
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => addNode("남성"),
    className: "flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] leading-tight gap-0.5"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1.5",
    y: "1.5",
    width: "17",
    height: "17",
    fill: "white",
    stroke: "#374151",
    strokeWidth: "1.8"
  })), /*#__PURE__*/React.createElement("span", null, "\uB0A8\uC131")), /*#__PURE__*/React.createElement("button", {
    onClick: () => addNode("여성"),
    className: "flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] leading-tight gap-0.5"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "8.5",
    fill: "white",
    stroke: "#374151",
    strokeWidth: "1.8"
  })), /*#__PURE__*/React.createElement("span", null, "\uC5EC\uC131")), /*#__PURE__*/React.createElement("button", {
    onClick: () => addNode("논바이너리"),
    className: "flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] leading-tight gap-0.5"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "10,1.5 18.5,10 10,18.5 1.5,10",
    fill: "white",
    stroke: "#374151",
    strokeWidth: "1.8"
  })), /*#__PURE__*/React.createElement("span", null, "\uB17C\uBC14\uC774\uB108\uB9AC")), /*#__PURE__*/React.createElement("button", {
    onClick: () => addNode("레즈비언"),
    className: "flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] leading-tight gap-0.5"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "8",
    fill: "white",
    stroke: "#374151",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "10,16 4,6.5 16,6.5",
    fill: "none",
    stroke: "#374151",
    strokeWidth: "1.6"
  })), /*#__PURE__*/React.createElement("span", null, "\uB808\uC988\uBE44\uC5B8")), /*#__PURE__*/React.createElement("button", {
    onClick: () => addNode("게이"),
    className: "flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] leading-tight gap-0.5"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "18",
    height: "18",
    rx: "1",
    fill: "white",
    stroke: "#374151",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "10,16 4,7 16,7",
    fill: "none",
    stroke: "#374151",
    strokeWidth: "1.6"
  })), /*#__PURE__*/React.createElement("span", null, "\uAC8C\uC774")), /*#__PURE__*/React.createElement(TwoLineBtn, {
    top: "\uC0AC\uB9DD",
    bottom: "\uD1A0\uAE00",
    onClick: toggleDead,
    disabled: !Array.from(selected).some(id => nodes.some(n => n.id === id))
  }), /*#__PURE__*/React.createElement(TwoLineBtn, {
    top: "\uB0B4\uB2F4\uC790",
    bottom: "\uD1A0\uAE00",
    onClick: toggleClient,
    disabled: !Array.from(selected).some(id => nodes.some(n => n.id === id)),
    active: Array.from(selected).some(id => nodes.find(n => n.id === id)?.client)
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), React.createElement("div", { 'data-tour': 'geo-lines', style: { display: 'flex', alignItems: 'center' } }, lineCategories.map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat.label,
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] text-gray-400 font-bold mr-0.5 shrink-0 leading-tight text-center whitespace-pre-line"
  }, cat.label), cat.types.map(t => /*#__PURE__*/React.createElement(TwoLineBtn, {
    key: t,
    preview: t,
    bottom: t,
    onClick: () => setLineType(t),
    active: lineType === t,
    bw: bw
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200 mx-0.5"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    style: {
      height: "46px",
      minHeight: "46px",
      maxHeight: "46px",
      minWidth: "max-content",
      overflow: "visible",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    style: { flexShrink: 0 },
    'data-tour': 'geo-child-line'
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] text-gray-400 font-bold leading-tight text-center"
  }, "\uC790\uB140"), ["일반", "위탁", "입양"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setChildLineType(t),
    className: `flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium transition-colors leading-tight gap-0.5
                          ${childLineType === t ? "bg-[#e8f4e8] border-[#3a6a4a] text-[#2d7a3a]" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2]"}`
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "20",
    viewBox: "0 0 24 20"
  }, t === "일반" && /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "2",
    x2: "12",
    y2: "18",
    stroke: "#374151",
    strokeWidth: "2"
  }), t === "위탁" && /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "2",
    x2: "12",
    y2: "18",
    stroke: "#374151",
    strokeWidth: "2",
    strokeDasharray: "4 3"
  }), t === "입양" && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "18",
    stroke: "#374151",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "18",
    stroke: "#374151",
    strokeWidth: "2",
    strokeDasharray: "4 3"
  }))), /*#__PURE__*/React.createElement("span", null, t)))), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), (() => {
    const selectedChildIds = Array.from(selected).filter(id => nodes.some(n => n.id === id));
    const twinDisabled = selectedChildIds.length < 2;
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1",
      'data-tour': 'geo-twins'
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[8px] text-gray-400 font-bold leading-tight text-center"
    }, "\uC30D", /*#__PURE__*/React.createElement("br", null), "\uB465", /*#__PURE__*/React.createElement("br", null), "\uC774"), [{
      label: "쌍둥이",
      identical: false
    }, {
      label: "일란성",
      identical: true
    }].map(({
      label,
      identical
    }) => {
      const disabled = twinDisabled;
      return /*#__PURE__*/React.createElement("button", {
        key: label,
        disabled: disabled,
        onClick: () => {
          const selChildIds2 = Array.from(selected).filter(id => nodes.some(n => n.id === id));
          if (selChildIds2.length < 2) return;
          // 가장 가까운 결혼선 자동 탐색
          const avgX = selChildIds2.reduce((s, id) => s + (nodes.find(n => n.id === id)?.x ?? 0), 0) / selChildIds2.length;
          const avgY = selChildIds2.reduce((s, id) => s + (nodes.find(n => n.id === id)?.y ?? 0), 0) / selChildIds2.length;
          let pm = marriages.find(m => selChildIds2.filter(id => m.childIds.includes(id)).length >= 2);
          if (!pm) {
            // 가장 가까운 결혼선에 자동 연결
            let minDist = Infinity;
            marriages.forEach(m => {
              const ml = lines.find(l => l.id === m.id);
              if (!ml) return;
              const p1 = getEndpoint(ml.from, nodes, lines),
                p2 = getEndpoint(ml.to, nodes, lines);
              const midX = (p1.x + p2.x) / 2,
                midY = (p1.y + p2.y) / 2;
              const dist = Math.hypot(avgX - midX, avgY - midY);
              if (dist < minDist) {
                minDist = dist;
                pm = m;
              }
            });
            if (!pm) return;
            // 자녀로 등록
            setMarriages(prev => prev.map(m => m.id === pm.id ? {
              ...m,
              childIds: [...new Set([...m.childIds, ...selChildIds2])],
              childLineTypes: {
                ...m.childLineTypes,
                ...Object.fromEntries(selChildIds2.map(id => [id, "일반"]))
              }
            } : m));
          }
          saveHistory();
          if (identical) {
            setNodes(p => p.map(n => selChildIds2.includes(n.id) ? {
              ...n,
              identical: true
            } : n));
          } else {
            setNodes(p => p.map(n => selChildIds2.includes(n.id) ? {
              ...n,
              identical: false
            } : n));
          }
          setMarriages(p => p.map(m => m.id === pm.id ? {
            ...m,
            twinGroups: [...(m.twinGroups || []).filter(g => !g.some(id => selChildIds2.includes(id))), selChildIds2],
            twinDropOffsets: [...(m.twinDropOffsets || []).map((v, i) => v), 40]
          } : m));
        },
        className: `flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium transition-colors leading-tight gap-0.5
                            border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a]
                            ${disabled ? "opacity-40 cursor-not-allowed" : ""}`
      }, /*#__PURE__*/React.createElement("svg", {
        width: "32",
        height: "22",
        viewBox: "0 0 32 22"
      }, /*#__PURE__*/React.createElement("line", {
        x1: "16",
        y1: "2",
        x2: "9",
        y2: "13",
        stroke: "#374151",
        strokeWidth: "1.5"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "16",
        y1: "2",
        x2: "23",
        y2: "13",
        stroke: "#374151",
        strokeWidth: "1.5"
      }), identical && /*#__PURE__*/React.createElement("line", {
        x1: "9",
        y1: "17",
        x2: "23",
        y2: "17",
        stroke: "#374151",
        strokeWidth: "1.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "17",
        r: "4",
        fill: "white",
        stroke: "#374151",
        strokeWidth: "1.3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "23",
        cy: "17",
        r: "4",
        fill: "white",
        stroke: "#374151",
        strokeWidth: "1.3"
      })), /*#__PURE__*/React.createElement("span", null, label));
    }));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    'data-tour': 'geo-child-types'
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] text-gray-400 font-bold leading-tight text-center"
  }, "\uC790\uB140", /*#__PURE__*/React.createElement("br", null), "\uC720\uD615"), [{
    g: "임신",
    icon: /*#__PURE__*/React.createElement("polygon", {
      points: "10,3 17,16 3,16",
      fill: "white",
      stroke: "#374151",
      strokeWidth: "1.5"
    })
  }, {
    g: "사산아",
    icon: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: "5", y: "5", width: "10", height: "10",
      fill: "white", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "7", y1: "7", x2: "13", y2: "13", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "13", y1: "7", x2: "7", y2: "13", stroke: "#374151", strokeWidth: "1.5"
    }))
  }, {
    g: "자연유산",
    icon: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polygon", {
      points: "10,3 17,16 3,16", fill: "white", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6", y1: "8", x2: "14", y2: "14", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "14", y1: "8", x2: "6", y2: "14", stroke: "#374151", strokeWidth: "1.5"
    }))
  }, {
    g: "인공유산",
    icon: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polygon", {
      points: "10,3 17,16 3,16", fill: "white", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6", y1: "8", x2: "14", y2: "14", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "14", y1: "8", x2: "6", y2: "14", stroke: "#374151", strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3", y1: "14", x2: "17", y2: "14", stroke: "#374151", strokeWidth: "1.5"
    }))
  }].map(({
    g,
    icon
  }) => /*#__PURE__*/React.createElement("button", {
    key: g,
    onClick: () => addNode(g),
    className: "flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] leading-tight gap-0.5"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, icon), /*#__PURE__*/React.createElement("span", null, g)))), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), React.createElement("div", { 'data-tour': 'geo-substance', style: { display: 'flex', alignItems: 'center', gap: 4 } }, /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] text-gray-400 font-bold shrink-0 leading-tight text-center"
  }, "\uC57D\uBB3C", /*#__PURE__*/React.createElement("br", null), "\uC815\uC2E0", /*#__PURE__*/React.createElement("br", null), "\uC2E0\uCCB4"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, ["약물남용", "정신신체문제", "약물정신신체", "약물남용의심", "약물남용회복"].map(type => {
    const selNodes = Array.from(selected).map(id => nodes.find(n => n.id === id)).filter(Boolean);
    const isActive = selNodes.length > 0 && selNodes.every(n => n.substance === type);
    const isDisabled = selNodes.length === 0;
    const label = type === "약물남용" ? "약물남용" : type === "정신신체문제" ? "정신신체" : type === "약물정신신체" ? "약물+정신" : type === "약물남용의심" ? "의심" : "회복";
    return /*#__PURE__*/React.createElement("button", {
      key: type,
      onClick: () => toggleSubstance(type),
      disabled: isDisabled,
      title: type ?? "",
      className: `flex flex-col items-center justify-center px-1 py-1 rounded border text-[9px] font-medium transition-colors leading-tight min-w-[36px] gap-0.5
                            ${isActive ? "bg-[#e8f4e8] border-[#3a6a4a] text-[#2d7a3a]" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a]"}
                            ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`
    }, /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 22 22"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "1",
      width: "20",
      height: "20",
      rx: "1",
      fill: "white",
      stroke: "#888",
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "9",
      fill: "none",
      stroke: "#888",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "11,1 21,11 11,21 1,11",
      fill: "none",
      stroke: "#888",
      strokeWidth: "0.8"
    }), type === "약물남용" && /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "11",
      width: "18",
      height: "9",
      fill: "#222"
    }), type === "정신신체문제" && /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "2",
      width: "9",
      height: "18",
      fill: "#222"
    }), type === "약물정신신체" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "2",
      width: "18",
      height: "18",
      fill: "#222"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11",
      y: "2",
      width: "9",
      height: "9",
      fill: "white"
    })), type === "약물남용의심" && /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "11",
      width: "18",
      height: "9",
      fill: "#999"
    }), type === "약물남용회복" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "11",
      y: "11",
      width: "9",
      height: "9",
      fill: "#999"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "11",
      width: "9",
      height: "9",
      fill: "#222"
    }))), /*#__PURE__*/React.createElement("span", null, label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-4 w-px bg-gray-200 mx-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    'data-tour': 'geo-textbox'
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTextBoxMode(v => !v);
      setSelected(new Set());
    },
    className: `flex flex-col items-center justify-center px-1.5 py-1 rounded border text-[10px] font-medium transition-colors leading-tight min-w-[36px] gap-0.5
                        ${textBoxMode ? "bg-[#e8f4e8] border-[#3a6a4a] text-[#2d7a3a]" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a]"}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] font-bold leading-none"
  }, "T"), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px]"
  }, "\uD14D\uC2A4\uD2B8")), [["#222222", "검정"], ["#dc2626", "빨강"], ["#2563eb", "파랑"]].map(([col, label]) => /*#__PURE__*/React.createElement("button", {
    key: col,
    onClick: () => setTextBoxColor(col),
    title: label,
    className: `w-5 h-5 rounded-full border-2 transition-all ${textBoxColor === col ? "border-[#3a6a4a] scale-110" : "border-gray-300"}`,
    style: {
      background: col
    }
  })), Array.from(selected).some(id => textBoxes.some(t => t.id === id)) && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-0.5 ml-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      saveHistory();
      setTextBoxes(p => p.map(t => selected.has(t.id) ? {
        ...t,
        fontSize: Math.max(8, t.fontSize - 2)
      } : t));
    },
    className: "w-5 h-5 rounded border border-gray-200 bg-gray-50 text-xs flex items-center justify-center hover:bg-gray-100"
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-500 w-6 text-center"
  }, textBoxes.find(t => selected.has(t.id))?.fontSize ?? 14), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      saveHistory();
      setTextBoxes(p => p.map(t => selected.has(t.id) ? {
        ...t,
        fontSize: Math.min(48, t.fontSize + 2)
      } : t));
    },
    className: "w-5 h-5 rounded border border-gray-200 bg-gray-50 text-xs flex items-center justify-center hover:bg-gray-100"
  }, "+"))), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    'data-tour': 'geo-actions'
  }, /*#__PURE__*/React.createElement(TwoLineBtn, {
    top: "\uC790\uB140",
    bottom: "\uCD94\uAC00",
    onClick: () => {
      const selLine = lines.find(l => selected.has(l.id) && marriages.some(m => m.id === l.id));
      if (selLine) {
        setConnectingFrom(selLine.id);
        setConnectingMode("child");
      }
    },
    disabled: !lines.some(l => selected.has(l.id) && marriages.some(m => m.id === l.id))
  }), /*#__PURE__*/React.createElement("button", {
    onClick: undo,
    disabled: history.length === 0,
    className: `flex flex-col items-center justify-center px-1.5 py-1 rounded border text-[10px] font-medium transition-colors leading-tight min-w-[36px] gap-0.5
                        border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a]
                        ${history.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] leading-none"
  }, "\u21A9"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px]"
  }, "\uB4A4\uB85C")), /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-px bg-gray-200"
  }), React.createElement("div", { 'data-tour': 'geo-save', style: { display: 'flex', alignItems: 'center', gap: 4 } }, /*#__PURE__*/React.createElement(TwoLineBtn, {
    top: "\uD83D\uDCC2",
    bottom: "\uBD88\uB7EC\uC624\uAE30",
    onClick: loadJSON
  }), /*#__PURE__*/React.createElement("div", {
    ref: saveBtnRef
  }, /*#__PURE__*/React.createElement(TwoLineBtn, {
    top: "\uD83D\uDCBE",
    bottom: "\uC800\uC7A5",
    onClick: () => {
      if (saveBtnRef.current) {
        const r = saveBtnRef.current.getBoundingClientRect();
        setSaveMenuPos({
          top: r.bottom + 4,
          right: window.innerWidth - r.right
        });
      }
      setShowSaveMenu(v => !v);
    },
    active: showSaveMenu
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, !legendVisible && /*#__PURE__*/React.createElement("button", {
    onClick: () => setLegendVisible(true),
    className: "flex flex-col items-center justify-center px-1.5 py-1 rounded border text-[10px] font-medium transition-colors leading-tight min-w-[36px] gap-0.5 border-gray-300 bg-gray-100 text-gray-500 hover:bg-[#f0f7f2] hover:border-[#3a6a4a]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px]"
  }, "\uBC94\uB840"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px]"
  }, "\uD45C\uC2DC")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setBw(v => !v),
    className: `relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${bw ? "bg-gray-700" : "bg-[#3a6a4a]"}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `inline-block h-3 w-3 rounded-full bg-white transition-transform shadow ${bw ? "translate-x-3" : "translate-x-0.5"}`
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-500"
  }, bw ? "흑백" : "컬러")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setZoom(z => Math.max(0.2, +(z / 1.25).toFixed(3))),
    className: "w-6 h-8 flex items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] text-base font-bold leading-none",
    title: "축소"
  }, "−"), /*#__PURE__*/React.createElement("button", {
    onClick: () => { setZoom(1); setPan({x:0,y:0}); },
    className: "text-[9px] text-gray-500 min-w-[30px] text-center hover:text-[#3a6a4a] hover:underline",
    title: "100% \uB9AC\uC14B"
  }, Math.round(zoom * 100), "%"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setZoom(z => Math.min(4, +(z * 1.25).toFixed(3))),
    className: "w-6 h-8 flex items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#f0f7f2] hover:border-[#3a6a4a] text-base font-bold leading-none",
    title: "\uD655\uB300"
  }, "+")), /*#__PURE__*/React.createElement(TwoLineBtn, {
    top: "\uC0AD",
    bottom: "\uC81C",
    onClick: doDelete,
    disabled: selected.size === 0,
    danger: true
  })))), showSaveMenu && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: saveMenuPos.top,
      right: saveMenuPos.right,
      zIndex: 9000,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      padding: "6px",
      minWidth: 130
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#9ca3af",
      padding: "4px 10px 6px",
      fontFamily: "'Malgun Gothic',sans-serif"
    }
  }, "\uC800\uC7A5 \uD615\uC2DD \uC120\uD0DD"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      saveJSON();
      setShowSaveMenu(false);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      width: "100%",
      padding: "8px 12px",
      borderRadius: 6,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 12,
      color: "#374151",
      fontFamily: "'Malgun Gothic',sans-serif",
      textAlign: "left"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "#f0f7f2";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD83D\uDCBE"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "JSON \uC800\uC7A5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#9ca3af"
    }
  }, "\uC791\uC5C5 \uB0B4\uC6A9 \uC800\uC7A5 \xB7 \uC774\uC5B4\uD558\uAE30 \uAC00\uB2A5"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      saveImg();
      setShowSaveMenu(false);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      width: "100%",
      padding: "8px 12px",
      borderRadius: 6,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 12,
      color: "#374151",
      fontFamily: "'Malgun Gothic',sans-serif",
      textAlign: "left"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "#f0f7f2";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD83D\uDDBC\uFE0F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "SVG \uC800\uC7A5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#9ca3af"
    }
  }, "\uC774\uBBF8\uC9C0\uB85C \uB0B4\uBCF4\uB0B4\uAE30")))), /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    'data-tour': 'geo-canvas',
    className: "flex-1 relative overflow-hidden",
    style: {
      background: bw ? "#fff" : "#fafafa",
      backgroundImage: bw ? "none" : "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
      backgroundSize: "24px 24px"
    },
    onMouseDown: onCanvasDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp,
    onMouseLeave: onMouseUp,
    onWheel: onWheel
  }, connectingFrom && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-amber-500 text-white text-xs px-4 py-1.5 rounded-full shadow font-medium pointer-events-none"
  }, connectingMode === "child" ? "자녀 노드 클릭 — Esc 취소" : "연결할 도형 클릭 — Esc 취소"), /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${canvasW} ${canvasH}`,
    style: {
      cursor: isPanning.current ? "grab" : connectingFrom ? "crosshair" : "default"
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${pan.x},${pan.y}) scale(${zoom})`
  }, marriages.map(m => renderMarriage(m)), lines.map(l => /*#__PURE__*/React.createElement("g", {
    key: l.id,
    onClick: e => handleLineClick(e, l.id),
    onContextMenu: e => handleLineRightClick(e, l.id),
    style: {
      cursor: "pointer"
    },
    pointerEvents: "all"
  }, renderLine(l))), nodes.map(n => {
    const isSel = selected.has(n.id),
      isConn = connectingFrom === n.id && connectingMode === "node";
    return /*#__PURE__*/React.createElement("g", {
      key: n.id,
      transform: `translate(${n.x},${n.y})`,
      style: {
        cursor: "grab"
      },
      onMouseDown: e => onNodeDown(e, n.id),
      onClick: e => handleNodeClick(e, n.id),
      onDoubleClick: e => startEdit(e, n.id, "label"),
      onContextMenu: e => handleNodeRightClick(e, n.id)
    }, renderShape(n, isSel, isConn), !["임신", "사산아", "자연유산", "인공유산"].includes(n.gender) && (editId === n.id && editField === "age" ? /*#__PURE__*/React.createElement("foreignObject", {
      x: 4,
      y: 4,
      width: NS - 8,
      height: 20
    }, /*#__PURE__*/React.createElement("input", {
      autoFocus: true,
      value: editVal,
      onChange: e => setEditVal(e.target.value),
      onBlur: commitEdit,
      onKeyDown: e => {
        if (e.key === "Enter") commitEdit();
        if (e.key === "Escape") setEditId(null);
      },
      style: {
        width: "100%",
        fontSize: 16,
        textAlign: "center",
        border: "1px solid #3a6a4a",
        borderRadius: 2,
        padding: "1px 2px",
        outline: "none",
        background: "rgba(255,255,255,0.9)",
        transform: "scale(0.65)",
        transformOrigin: "left center"
      }
    })) : /*#__PURE__*/React.createElement("text", {
      x: NS / 2,
      y: n.gender === "논바이너리" ? n.client ? NS / 2 + 4 : 22 : n.client ? NS / 2 + 4 : 16,
      textAnchor: "middle",
      fontSize: 10,
      fill: n.age ? "#222" : "#bbb",
      stroke: n.substance ? "white" : "none",
      strokeWidth: n.substance ? 2.5 : 0,
      paintOrder: "stroke",
      fontFamily: "'Malgun Gothic', sans-serif",
      style: {
        cursor: "text"
      },
      onClick: e => {
        e.stopPropagation();
        startEdit(e, n.id, "age");
      }
    }, n.age || "나이")), (() => {
      const isSpecial = ["임신", "사산아", "자연유산", "인공유산"].includes(n.gender);
      const labelY = isSpecial ? NS / 2 + (n.gender === "자연유산" || n.gender === "인공유산" ? 20 : 28) : NS + 15;
      const foY = isSpecial ? labelY - 12 : NS + 2;
      return editId === n.id && editField === "label" ? /*#__PURE__*/React.createElement("foreignObject", {
        x: -20,
        y: foY,
        width: NS + 40,
        height: 26
      }, /*#__PURE__*/React.createElement("input", {
        autoFocus: true,
        value: editVal,
        onChange: e => setEditVal(e.target.value),
        onBlur: commitEdit,
        onKeyDown: e => {
          if (e.key === "Enter") commitEdit();
          if (e.key === "Escape") setEditId(null);
        },
        style: {
          width: "100%",
          fontSize: 16,
          textAlign: "center",
          border: "1px solid #3a6a4a",
          borderRadius: 3,
          padding: "1px 3px",
          outline: "none",
          transform: "scale(0.7)",
          transformOrigin: "left center"
        }
      })) : /*#__PURE__*/React.createElement("text", {
        x: NS / 2,
        y: labelY,
        textAnchor: "middle",
        fontSize: 11,
        fontWeight: "500",
        fill: n.label ? "#222" : "#ccc",
        fontFamily: "'Malgun Gothic', sans-serif"
      }, n.label || "더블클릭");
    })());
  }), legendVisible && totalItems > 0 && (() => {
    const fs = 10 * legendFontScale;
    const rowH = 22 * legendFontScale;
    const SEC_H = 17 * legendFontScale; // 섹션 헤더 높이
    const TITLE_H = 20 * legendFontScale; // "범 례" 타이틀 높이
    const ICON_W = 42 * legendFontScale; // 아이콘+간격 영역 너비
    const bxW = legendBoxW;
    const isLegSel = legendSelected;

    // ── 열 수 결정: 박스 너비 240px(scale 기준) 이상이면 2열
    const cols = bxW >= 240 ? 2 : 1;
    const colW = (bxW - 4) / cols; // 열 너비 (좌우 여백 4px 제외)

    // ── 레이블 렌더링 헬퍼 (더블클릭으로 편집)
    const renderLegendLabel = (key, defaultLabel, ix, iy, maxW) => {
      const label = legendLabelOverrides[key] ?? defaultLabel;
      if (editingLegendKey === key) {
        return /*#__PURE__*/React.createElement("foreignObject", {
          x: ix,
          y: iy - fs,
          width: maxW - ix - 2,
          height: rowH * 2
        }, /*#__PURE__*/React.createElement("textarea", {
          style: {
            width: "100%",
            height: "100%",
            fontSize: fs,
            fontFamily: "'Malgun Gothic', sans-serif",
            border: "1px solid #3a6a4a",
            borderRadius: 2,
            resize: "none",
            outline: "none",
            padding: "1px 2px",
            background: "rgba(255,255,255,0.95)",
            color: "#374151",
            lineHeight: 1.3
          },
          autoFocus: true,
          defaultValue: label,
          onBlur: e => {
            setLegendLabelOverrides(p => ({
              ...p,
              [key]: e.target.value
            }));
            setEditingLegendKey(null);
          },
          onKeyDown: e => {
            if (e.key === "Escape") setEditingLegendKey(null);
            e.stopPropagation();
          },
          onClick: e => e.stopPropagation()
        }));
      }
      const labelLines = label.split("\n");
      return /*#__PURE__*/React.createElement("text", {
        x: ix,
        y: iy,
        fontSize: fs,
        fill: "#374151",
        fontFamily: "'Malgun Gothic', sans-serif",
        style: {
          cursor: "text"
        },
        onDoubleClick: e => {
          e.stopPropagation();
          setEditingLegendKey(key);
        }
      }, labelLines.map((ln, li) => /*#__PURE__*/React.createElement("tspan", {
        key: li,
        x: ix,
        dy: li === 0 ? 0 : fs * 1.2
      }, ln)));
    };

    // ── 섹션별 항목 정의 (레이아웃 사전 계산용)

    const sectionDefs = [];
    if (usedNodeEntries.length > 0) sectionDefs.push({
      id: "node",
      label: "인물",
      count: usedNodeEntries.length
    });
    if (usedLineTypes.length > 0) sectionDefs.push({
      id: "line",
      label: "관계/정서선",
      count: usedLineTypes.length
    });
    if (usedChildLineTypes.length > 0) sectionDefs.push({
      id: "child",
      label: "자녀 연결선",
      count: usedChildLineTypes.length
    });
    if (twinEntries.length > 0) sectionDefs.push({
      id: "twin",
      label: "쌍둥이",
      count: twinEntries.length
    });

    // ── 섹션별 시작 Y 위치 계산
    // 타이틀("범 례"): TITLE_H, 그 다음부터 섹션들
    const sectionStartYs = {};
    let curY = TITLE_H + 4;
    for (const sec of sectionDefs) {
      sectionStartYs[sec.id] = curY + SEC_H; // 섹션 헤더 아래에서 아이템 시작
      const rows = Math.ceil(sec.count / cols);
      curY += SEC_H + rows * rowH + 4;
    }
    const contentH = curY + 6;
    const bxH = legendBoxH > 0 ? legendBoxH : contentH;

    // ── 항목별 x/y 계산 헬퍼
    const itemPos = (secId, idx) => {
      const startY = sectionStartYs[secId];
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      return {
        x: col * colW,
        y: startY + row * rowH
      };
    };
    return /*#__PURE__*/React.createElement("g", {
      transform: `translate(${lx},${ly})`
    }, /*#__PURE__*/React.createElement("rect", {
      x: -8,
      y: -8,
      width: bxW,
      height: bxH,
      fill: "white",
      stroke: isLegSel ? "#3a6a4a" : "#e5e7eb",
      strokeWidth: isLegSel ? 2 : 1,
      rx: 6,
      style: {
        filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.12))",
        cursor: "move"
      },
      onMouseDown: e => {
        e.stopPropagation();
        setLegendSelected(true);
        const r = wrapRef.current.getBoundingClientRect();
        legendDragRef.current = {
          type: "move",
          ox: e.clientX - r.left - lx,
          oy: e.clientY - r.top - ly
        };
      }
    }), isLegSel && /*#__PURE__*/React.createElement("g", {
      style: {
        cursor: "pointer"
      },
      onClick: e => {
        e.stopPropagation();
        setLegendVisible(false);
        setLegendSelected(false);
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: bxW - 14,
      cy: -14,
      r: 9,
      fill: "#ef4444"
    }), /*#__PURE__*/React.createElement("line", {
      x1: bxW - 18,
      y1: -18,
      x2: bxW - 10,
      y2: -10,
      stroke: "white",
      strokeWidth: 1.8
    }), /*#__PURE__*/React.createElement("line", {
      x1: bxW - 10,
      y1: -18,
      x2: bxW - 18,
      y2: -10,
      stroke: "white",
      strokeWidth: 1.8
    })), /*#__PURE__*/React.createElement("text", {
      x: 0,
      y: 13 * legendFontScale,
      fontSize: fs + 1,
      fontWeight: "700",
      fill: "#6b7280",
      fontFamily: "'Malgun Gothic', sans-serif"
    }, "\uBC94 \uB840"), usedNodeEntries.length > 0 && /*#__PURE__*/React.createElement("text", {
      x: 0,
      y: sectionStartYs["node"] - SEC_H + fs,
      fontSize: fs - 1,
      fill: "#9ca3af",
      fontFamily: "'Malgun Gothic', sans-serif"
    }, "\uC778\uBB3C"), usedNodeEntries.map((e, i) => {
      const {
        x: ix,
        y: iy
      } = itemPos("node", i);
      const sc = legendFontScale;
      const NS2 = 14 * sc;
      const half2 = NS2 / 2;
      const s = e.substance;
      const key = `node_${e.key}`;
      return /*#__PURE__*/React.createElement("g", {
        key: e.key,
        transform: `translate(${ix},${iy})`
      }, e.gender === "남성" && /*#__PURE__*/React.createElement("rect", {
        x: 0,
        y: 1,
        width: NS2,
        height: NS2,
        fill: "#fff",
        stroke: "#222",
        strokeWidth: 1.5
      }), e.gender === "여성" && /*#__PURE__*/React.createElement("circle", {
        cx: half2,
        cy: half2 + 1,
        r: half2,
        fill: "#fff",
        stroke: "#222",
        strokeWidth: 1.5
      }), e.gender === "논바이너리" && /*#__PURE__*/React.createElement("polygon", {
        points: `${half2},1 ${NS2},${half2 + 1} ${half2},${NS2 + 1} 0,${half2 + 1}`,
        fill: "#fff",
        stroke: "#222",
        strokeWidth: 1.5
      }), e.gender === "레즈비언" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: half2,
        cy: half2 + 1,
        r: half2,
        fill: "#fff",
        stroke: "#222",
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("polygon", {
        points: `${half2},${half2 + NS2 * 0.42} ${half2 - NS2 * 0.36},${half2 - NS2 * 0.2} ${half2 + NS2 * 0.36},${half2 - NS2 * 0.2}`,
        fill: "none",
        stroke: "#222",
        strokeWidth: 1.2
      })), e.gender === "게이" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: 0,
        y: 1,
        width: NS2,
        height: NS2,
        fill: "#fff",
        stroke: "#222",
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("polygon", {
        points: `${half2},${half2 + NS2 * 0.4} ${half2 - NS2 * 0.33},${half2 - NS2 * 0.18} ${half2 + NS2 * 0.33},${half2 - NS2 * 0.18}`,
        fill: "none",
        stroke: "#222",
        strokeWidth: 1.2
      })), e.gender === "임신" && /*#__PURE__*/React.createElement("polygon", {
        points: `${half2},1 ${NS2},${NS2} 0,${NS2}`,
        fill: "#fff",
        stroke: "#222",
        strokeWidth: 1.5
      }), e.gender === "사산아" && (() => { const sz2=NS2*0.5, ox2=(NS2-sz2)/2, oy2=(NS2-sz2)/2+1; return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {x:ox2, y:oy2, width:sz2, height:sz2, fill:"#fff", stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:ox2+2, y1:oy2+2, x2:ox2+sz2-2, y2:oy2+sz2-2, stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:ox2+sz2-2, y1:oy2+2, x2:ox2+2, y2:oy2+sz2-2, stroke:"#222", strokeWidth:1.5})); })(),
      e.gender === "자연유산" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {points:`${half2},1 ${NS2},${NS2+1} 0,${NS2+1}`, fill:"#fff", stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:half2-3, y1:NS2*0.4, x2:half2+3, y2:NS2*0.75, stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:half2+3, y1:NS2*0.4, x2:half2-3, y2:NS2*0.75, stroke:"#222", strokeWidth:1.5})),
      e.gender === "인공유산" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {points:`${half2},1 ${NS2},${NS2+1} 0,${NS2+1}`, fill:"#fff", stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:half2-3, y1:NS2*0.4, x2:half2+3, y2:NS2*0.75, stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:half2+3, y1:NS2*0.4, x2:half2-3, y2:NS2*0.75, stroke:"#222", strokeWidth:1.5}), /*#__PURE__*/React.createElement("line", {x1:1, y1:NS2, x2:NS2-1, y2:NS2, stroke:"#222", strokeWidth:1.5})),
      e.client && e.gender === "남성" && /*#__PURE__*/React.createElement("rect", {
        x: 2 * sc,
        y: 3 * sc,
        width: NS2 - 4 * sc,
        height: NS2 - 4 * sc,
        fill: "none",
        stroke: "#222",
        strokeWidth: 1
      }), e.client && e.gender === "여성" && /*#__PURE__*/React.createElement("circle", {
        cx: half2,
        cy: half2 + 1,
        r: half2 - 3 * sc,
        fill: "none",
        stroke: "#222",
        strokeWidth: 1
      }), s === "약물남용" && e.gender === "남성" && /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: half2 + 1,
        width: NS2 - 2,
        height: half2 - 1,
        fill: "#222"
      }), s === "약물남용" && e.gender === "여성" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} m -${half2 - 1} 0 a ${half2 - 1} ${half2 - 1} 0 0 0 ${(half2 - 1) * 2} 0 Z`,
        fill: "#222"
      }), s === "정신신체문제" && e.gender === "남성" && /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: 1,
        width: half2 - 1,
        height: NS2 - 2,
        fill: "#222"
      }), s === "정신신체문제" && e.gender === "여성" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} 1 a ${half2 - 1} ${half2 - 1} 0 0 0 0 ${(half2 - 1) * 2} Z`,
        fill: "#222"
      }), s === "약물정신신체" && e.gender === "남성" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: 1,
        width: NS2 - 2,
        height: NS2 - 2,
        fill: "#222"
      }), /*#__PURE__*/React.createElement("rect", {
        x: half2,
        y: 1,
        width: half2 - 1,
        height: half2 - 1,
        fill: "white"
      })), s === "약물정신신체" && e.gender === "여성" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} L ${NS2 - 1} ${half2 + 1} A ${half2 - 1} ${half2 - 1} 0 1 1 ${half2} 1 Z`,
        fill: "#222"
      }), s === "약물정신신체" && e.gender === "레즈비언" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} L ${NS2 - 1} ${half2 + 1} A ${half2 - 1} ${half2 - 1} 0 1 1 ${half2} 1 Z`,
        fill: "#222"
      }), s === "약물정신신체" && e.gender === "게이" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: 1, y: 1, width: NS2 - 2, height: NS2 - 2, fill: "#222"
      }), /*#__PURE__*/React.createElement("rect", {
        x: half2, y: 1, width: half2 - 1, height: half2 - 1, fill: "white"
      })), s === "약물남용" && e.gender === "게이" && /*#__PURE__*/React.createElement("rect", {
        x: 1, y: half2 + 1, width: NS2 - 2, height: half2 - 1, fill: "#222"
      }), s === "약물남용" && e.gender === "레즈비언" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} m -${half2 - 1} 0 a ${half2 - 1} ${half2 - 1} 0 0 0 ${(half2 - 1) * 2} 0 Z`,
        fill: "#222"
      }), s === "약물남용" && e.gender === "논바이너리" && /*#__PURE__*/React.createElement("path", {
        d: `M 0,${half2 + 1} L ${half2},${NS2 + 1} L ${NS2},${half2 + 1} Z`,
        fill: "#222"
      }), s === "정신신체문제" && e.gender === "게이" && /*#__PURE__*/React.createElement("rect", {
        x: 1, y: 1, width: half2 - 1, height: NS2 - 2, fill: "#222"
      }), s === "정신신체문제" && e.gender === "레즈비언" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} 1 a ${half2 - 1} ${half2 - 1} 0 0 0 0 ${(half2 - 1) * 2} Z`,
        fill: "#222"
      }), s === "정신신체문제" && e.gender === "논바이너리" && /*#__PURE__*/React.createElement("path", {
        d: `M 0,${half2 + 1} L ${half2},1 L ${half2},${NS2 + 1} Z`,
        fill: "#222"
      }), s === "약물정신신체" && e.gender === "논바이너리" && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("path", {
          d: `M ${half2},1 L ${NS2},${half2 + 1} L ${half2},${NS2 + 1} L 0,${half2 + 1} Z`,
          fill: "#222"
        }),
        /*#__PURE__*/React.createElement("path", {
          d: `M ${half2},1 L ${NS2},${half2 + 1} L ${half2},${half2 + 1} Z`,
          fill: "white"
        })
      ), s === "약물남용의심" && e.gender === "남성" && /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: half2 + 1,
        width: NS2 - 2,
        height: half2 - 1,
        fill: "#999"
      }), s === "약물남용의심" && e.gender === "여성" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} m -${half2 - 1} 0 a ${half2 - 1} ${half2 - 1} 0 0 0 ${(half2 - 1) * 2} 0 Z`,
        fill: "#999"
      }), s === "약물남용의심" && e.gender === "게이" && /*#__PURE__*/React.createElement("rect", {
        x: 1, y: half2 + 1, width: NS2 - 2, height: half2 - 1, fill: "#999"
      }), s === "약물남용의심" && e.gender === "레즈비언" && /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} m -${half2 - 1} 0 a ${half2 - 1} ${half2 - 1} 0 0 0 ${(half2 - 1) * 2} 0 Z`,
        fill: "#999"
      }), s === "약물남용의심" && e.gender === "논바이너리" && /*#__PURE__*/React.createElement("path", {
        d: `M 0,${half2 + 1} L ${half2},${NS2 + 1} L ${NS2},${half2 + 1} Z`,
        fill: "#999"
      }), s === "약물남용회복" && e.gender === "남성" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: half2,
        y: half2 + 1,
        width: half2 - 1,
        height: half2 - 1,
        fill: "#999"
      }), /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: half2 + 1,
        width: half2 - 1,
        height: half2 - 1,
        fill: "#222"
      })), s === "약물남용회복" && e.gender === "여성" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} L ${NS2 - 1} ${half2 + 1} A ${half2 - 1} ${half2 - 1} 0 0 1 ${half2} ${NS2} Z`,
        fill: "#999"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M ${half2} ${half2 + 1} L 1 ${half2 + 1} A ${half2 - 1} ${half2 - 1} 0 0 0 ${half2} ${NS2} Z`,
        fill: "#222"
      })), s === "약물남용회복" && e.gender === "게이" && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("rect", {
          x: half2, y: half2 + 1, width: half2 - 1, height: half2 - 1, fill: "#999"
        }),
        /*#__PURE__*/React.createElement("rect", {
          x: 1, y: half2 + 1, width: half2 - 1, height: half2 - 1, fill: "#222"
        })
      ), s === "약물남용회복" && e.gender === "레즈비언" && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("path", {
          d: `M ${half2} ${half2 + 1} L ${NS2 - 1} ${half2 + 1} A ${half2 - 1} ${half2 - 1} 0 0 1 ${half2} ${NS2} Z`,
          fill: "#999"
        }),
        /*#__PURE__*/React.createElement("path", {
          d: `M ${half2} ${half2 + 1} L 1 ${half2 + 1} A ${half2 - 1} ${half2 - 1} 0 0 0 ${half2} ${NS2} Z`,
          fill: "#222"
        })
      ), s === "약물남용회복" && e.gender === "논바이너리" && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("path", {
          d: `M ${half2},${half2 + 1} L ${NS2},${half2 + 1} L ${half2},${NS2 + 1} Z`,
          fill: "#999"
        }),
        /*#__PURE__*/React.createElement("path", {
          d: `M ${half2},${half2 + 1} L 0,${half2 + 1} L ${half2},${NS2 + 1} Z`,
          fill: "#222"
        })
      ), e.dead && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
        x1: 2,
        y1: 3,
        x2: NS2 - 2,
        y2: NS2 - 1,
        stroke: "#222",
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("line", {
        x1: NS2 - 2,
        y1: 3,
        x2: 2,
        y2: NS2 - 1,
        stroke: "#222",
        strokeWidth: 1.5
      })), renderLegendLabel(key, e.label, ICON_W, NS2 - 2, colW));
    }), usedLineTypes.length > 0 && /*#__PURE__*/React.createElement("text", {
      x: 0,
      y: sectionStartYs["line"] - SEC_H + fs,
      fontSize: fs - 1,
      fill: "#9ca3af",
      fontFamily: "'Malgun Gothic', sans-serif"
    }, "\uAD00\uACC4/\uC815\uC11C\uC120"), usedLineTypes.map((t, i) => {
      const {
        x: ix,
        y: iy
      } = itemPos("line", i);
      return /*#__PURE__*/React.createElement("g", {
        key: t,
        transform: `translate(${ix},${iy})`
      }, /*#__PURE__*/React.createElement("g", {
        transform: `scale(${legendFontScale})`
      }, /*#__PURE__*/React.createElement(LinePreview, {
        type: t,
        size: 36,
        bw: bw
      })), renderLegendLabel(`line_${t}`, t, ICON_W, 13 * legendFontScale, colW));
    }), usedChildLineTypes.length > 0 && /*#__PURE__*/React.createElement("text", {
      x: 0,
      y: sectionStartYs["child"] - SEC_H + fs,
      fontSize: fs - 1,
      fill: "#9ca3af",
      fontFamily: "'Malgun Gothic', sans-serif"
    }, "\uC790\uB140 \uC5F0\uACB0\uC120"), usedChildLineTypes.map((t, i) => {
      const {
        x: ix,
        y: iy
      } = itemPos("child", i);
      const defaultLabel = t === "일반" ? "일반 자녀" : t === "위탁" ? "위탁 자녀" : "입양 자녀";
      return /*#__PURE__*/React.createElement("g", {
        key: `child_${t}`,
        transform: `translate(${ix},${iy})`
      }, /*#__PURE__*/React.createElement("g", {
        transform: `scale(${legendFontScale})`
      }, t === "일반" && /*#__PURE__*/React.createElement("svg", {
        width: 36,
        height: 16
      }, /*#__PURE__*/React.createElement("line", {
        x1: 2,
        y1: 8,
        x2: 34,
        y2: 8,
        stroke: "#374151",
        strokeWidth: 2
      })), t === "위탁" && /*#__PURE__*/React.createElement("svg", {
        width: 36,
        height: 16
      }, /*#__PURE__*/React.createElement("line", {
        x1: 2,
        y1: 8,
        x2: 34,
        y2: 8,
        stroke: "#374151",
        strokeWidth: 2,
        strokeDasharray: "6 4"
      })), t === "입양" && /*#__PURE__*/React.createElement("svg", {
        width: 36,
        height: 16
      }, /*#__PURE__*/React.createElement("line", {
        x1: 2,
        y1: 5,
        x2: 34,
        y2: 5,
        stroke: "#374151",
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("line", {
        x1: 2,
        y1: 11,
        x2: 34,
        y2: 11,
        stroke: "#374151",
        strokeWidth: 2,
        strokeDasharray: "5 4"
      }))), renderLegendLabel(`child_${t}`, defaultLabel, ICON_W, 13 * legendFontScale, colW));
    }), twinEntries.length > 0 && /*#__PURE__*/React.createElement("text", {
      x: 0,
      y: sectionStartYs["twin"] - SEC_H + fs,
      fontSize: fs - 1,
      fill: "#9ca3af",
      fontFamily: "'Malgun Gothic', sans-serif"
    }, "\uC30D\uB465\uC774"), twinEntries.map((t, i) => {
      const {
        x: ix,
        y: iy
      } = itemPos("twin", i);
      const isIdentical = t === "일란성쌍둥이";
      const sc = legendFontScale;
      // 버튼 SVG 원본 viewBox: 32x22, scale 적용
      const tw = 32 * sc,
        th = 22 * sc;
      return /*#__PURE__*/React.createElement("g", {
        key: t,
        transform: `translate(${ix},${iy - 4 * sc})`
      }, /*#__PURE__*/React.createElement("svg", {
        width: tw,
        height: th,
        viewBox: "0 0 32 22",
        style: {
          overflow: "visible"
        }
      }, /*#__PURE__*/React.createElement("line", {
        x1: "16",
        y1: "2",
        x2: "9",
        y2: "13",
        stroke: "#374151",
        strokeWidth: "1.5"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "16",
        y1: "2",
        x2: "23",
        y2: "13",
        stroke: "#374151",
        strokeWidth: "1.5"
      }), isIdentical && /*#__PURE__*/React.createElement("line", {
        x1: "9",
        y1: "17",
        x2: "23",
        y2: "17",
        stroke: "#374151",
        strokeWidth: "1.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "17",
        r: "4",
        fill: "white",
        stroke: "#374151",
        strokeWidth: "1.3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "23",
        cy: "17",
        r: "4",
        fill: "white",
        stroke: "#374151",
        strokeWidth: "1.3"
      })), renderLegendLabel(`twin_${t}`, isIdentical ? "일란성 쌍둥이" : "이란성 쌍둥이", ICON_W, 13 * legendFontScale, colW));
    }), isLegSel && /*#__PURE__*/React.createElement("rect", {
      x: bxW - 18,
      y: bxH - 18,
      width: 14,
      height: 14,
      fill: "#3a6a4a",
      rx: 2,
      style: {
        cursor: "nw-resize"
      },
      onMouseDown: e => {
        e.stopPropagation();
        const r = wrapRef.current.getBoundingClientRect();
        legendDragRef.current = {
          type: "resizeBox",
          ox: e.clientX - r.left,
          oy: e.clientY - r.top,
          initW: legendBoxW,
          initH: legendBoxH > 0 ? legendBoxH : autoH
        };
      }
    }), isLegSel && /*#__PURE__*/React.createElement("rect", {
      x: -8,
      y: bxH - 18,
      width: 14,
      height: 14,
      fill: "#6b7280",
      rx: 2,
      style: {
        cursor: "ns-resize"
      },
      onMouseDown: e => {
        e.stopPropagation();
        const r = wrapRef.current.getBoundingClientRect();
        legendDragRef.current = {
          type: "resizeFont",
          ox: e.clientX - r.left,
          oy: e.clientY - r.top,
          initF: legendFontScale
        };
      }
    }));
  })(), textBoxes.map(tb => {
    const isSel = selected.has(tb.id);
    const isEditing = editingTbId === tb.id;
    return /*#__PURE__*/React.createElement("g", {
      key: tb.id
    }, /*#__PURE__*/React.createElement("rect", {
      x: tb.x,
      y: tb.y,
      width: tb.w,
      height: tb.h,
      fill: "transparent",
      stroke: isSel ? "#3a6a4a" : "transparent",
      strokeWidth: 1.5,
      rx: 3,
      style: {
        cursor: "move"
      },
      onMouseDown: e => {
        e.stopPropagation();
        setSelected(new Set([tb.id]));
        tbDragRef.current = {
          id: tb.id,
          type: "move",
          ox: e.clientX - wrapRef.current.getBoundingClientRect().left - tb.x,
          oy: e.clientY - wrapRef.current.getBoundingClientRect().top - tb.y
        };
      },
      onDoubleClick: e => {
        e.stopPropagation();
        setEditingTbId(tb.id);
      }
    }), isEditing ? /*#__PURE__*/React.createElement("foreignObject", {
      x: tb.x,
      y: tb.y,
      width: tb.w,
      height: tb.h
    }, /*#__PURE__*/React.createElement("textarea", {
      style: {
        width: "100%",
        height: "100%",
        border: "none",
        background: "transparent",
        resize: "none",
        fontSize: tb.fontSize,
        color: tb.color,
        fontFamily: "'Malgun Gothic', sans-serif",
        outline: "none",
        padding: "4px"
      },
      autoFocus: true,
      defaultValue: tb.text,
      onBlur: e => {
        setTextBoxes(p => p.map(t => t.id === tb.id ? {
          ...t,
          text: e.target.value
        } : t));
        setEditingTbId(null);
      },
      onKeyDown: e => {
        if (e.key === "Escape") setEditingTbId(null);
        e.stopPropagation();
      },
      onClick: e => e.stopPropagation()
    })) : /*#__PURE__*/React.createElement("text", {
      x: tb.x + 4,
      y: tb.y + tb.fontSize + 2,
      fontSize: tb.fontSize,
      fill: tb.color,
      fontFamily: "'Malgun Gothic', sans-serif",
      style: {
        whiteSpace: "pre-wrap",
        pointerEvents: "none"
      }
    }, tb.text.split("\n").map((line, i) => /*#__PURE__*/React.createElement("tspan", {
      key: i,
      x: tb.x + 4,
      dy: i === 0 ? 0 : tb.fontSize * 1.3
    }, line))), isSel && /*#__PURE__*/React.createElement("rect", {
      x: tb.x + tb.w - 10,
      y: tb.y + tb.h - 10,
      width: 10,
      height: 10,
      fill: "#3a6a4a",
      rx: 2,
      style: {
        cursor: "se-resize"
      },
      onMouseDown: e => {
        e.stopPropagation();
        tbDragRef.current = {
          id: tb.id,
          type: "resize",
          ox: e.clientX - wrapRef.current.getBoundingClientRect().left,
          oy: e.clientY - wrapRef.current.getBoundingClientRect().top,
          initW: tb.w,
          initH: tb.h
        };
      }
    }));
  }), rubber && /*#__PURE__*/React.createElement("rect", {
    x: rubber.x,
    y: rubber.y,
    width: rubber.w,
    height: rubber.h,
    fill: "rgba(58,106,74,0.08)",
    stroke: "#3a6a4a",
    strokeWidth: 1,
    strokeDasharray: "4 2"
  }))), nodes.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex items-center justify-center pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center text-gray-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-4xl mb-2"
  }, "\u25A1 \u25CB \u25C7"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium"
  }, "\uC0C1\uB2E8\uC5D0\uC11C \uC778\uBB3C\uC744 \uCD94\uAC00\uD558\uC138\uC694"))),
  // \uBBF8\uB2C8\uB9F5: \uB178\uB4DC\uAC00 \uD654\uBA74 \uBC16\uC73C\uB85C \uB098\uAC14\uC744 \uB54C\uB9CC \uD45C\uC2DC
  nodes.length > 0 && nodes.some(n => {
    const sx = (n.x + NS/2) * zoom + pan.x;
    const sy = (n.y + NS/2) * zoom + pan.y;
    return sx < 0 || sx > canvasSize.w || sy < 0 || sy > canvasSize.h;
  }) && (() => {
    const MAP_W = 160, MAP_H = 110;
    let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
    nodes.forEach(n => { mnX=Math.min(mnX,n.x); mnY=Math.min(mnY,n.y); mxX=Math.max(mxX,n.x+NS); mxY=Math.max(mxY,n.y+NS+20); });
    const pad=40; mnX-=pad; mnY-=pad; mxX+=pad; mxY+=pad;
    const wW=mxX-mnX, wH=mxY-mnY;
    const sc=Math.min(MAP_W/wW, MAP_H/wH);
    const offX=(MAP_W-wW*sc)/2, offY=(MAP_H-wH*sc)/2;
    const toMap=(wx,wy)=>({x:offX+(wx-mnX)*sc, y:offY+(wy-mnY)*sc});
    const vpX1=-pan.x/zoom, vpY1=-pan.y/zoom;
    const vpX2=vpX1+canvasSize.w/zoom, vpY2=vpY1+canvasSize.h/zoom;
    const vm1=toMap(vpX1,vpY1), vm2=toMap(vpX2,vpY2);
    const vrX=Math.max(0,vm1.x), vrY=Math.max(0,vm1.y);
    const vrW=Math.min(MAP_W,vm2.x)-vrX, vrH=Math.min(MAP_H,vm2.y)-vrY;
    return React.createElement("div", {
      style:{position:"absolute",bottom:12,right:panelOpen?160:40,zIndex:50,background:"rgba(255,255,255,0.93)",border:"1px solid #e5e7eb",borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.13)",overflow:"hidden",cursor:"crosshair"},
      onClick: e => {
        const r = e.currentTarget.getBoundingClientRect();
        const mx=e.clientX-r.left-offX, my=e.clientY-r.top-offY;
        const wx=mx/sc+mnX, wy=my/sc+mnY;
        setPan({x:canvasSize.w/2-wx*zoom, y:canvasSize.h/2-wy*zoom});
      }
    },
    React.createElement("svg", {width:MAP_W, height:MAP_H},
      lines.map(l => {
        const p1=getEndpoint(l.from,nodes,lines), p2=getEndpoint(l.to,nodes,lines);
        const m1=toMap(p1.x,p1.y), m2=toMap(p2.x,p2.y);
        return React.createElement("line",{key:l.id,x1:m1.x,y1:m1.y,x2:m2.x,y2:m2.y,stroke:"#d1d5db",strokeWidth:1});
      }),
      nodes.map(n => {
        const {x,y}=toMap(n.x+NS/2,n.y+NS/2);
        return React.createElement("circle",{key:n.id,cx:x,cy:y,r:n.client?4:3,fill:n.client?"#3a6a4a":"#6b7280",opacity:0.85});
      }),
      vrW>0&&vrH>0&&React.createElement("rect",{x:vrX,y:vrY,width:vrW,height:vrH,fill:"rgba(58,106,74,0.08)",stroke:"#3a6a4a",strokeWidth:1.5,rx:2})
    ),
    React.createElement("div",{style:{position:"absolute",top:3,left:6,fontSize:9,color:"#9ca3af",pointerEvents:"none",fontFamily:"Malgun Gothic,sans-serif"}},"\uBBF8\uB2C8\uB9F5 \u00B7 \uD074\uB9AD\uC774\uB3D9")
    );
  })(),
  // \uC0AC\uC774\uB4DC \uD328\uB110
  React.createElement("div", {
    'data-tour': 'geo-side-panel',
    style:{position:"absolute",top:0,right:0,height:"100%",width:panelOpen?148:28,background:"#fff",borderLeft:"1px solid #e5e7eb",display:"flex",flexDirection:"column",transition:"width 0.18s",overflow:"hidden",flexShrink:0,zIndex:40}
  },
    React.createElement("button",{
      onClick:()=>setPanelOpen(v=>!v),
      title:panelOpen?"\uD328\uB110 \uB2EB\uAE30":"\uCD94\uAC00 \uC120 \uC5F4\uAE30",
      style:{width:"100%",padding:"5px 0",background:"none",border:"none",borderBottom:"1px solid #e5e7eb",cursor:"pointer",fontSize:11,color:"#6b7280",flexShrink:0}
    }, panelOpen?"\u2715 \uC811\uAE30":"\uFF0B"),
    panelOpen && React.createElement("div",{style:{overflowY:"auto",flex:1,padding:"6px 0"}},
      // \uAC10\uC815\uAD00\uACC4\uC120
      React.createElement("div",{style:{padding:"4px 8px",fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:1}},"\uAC10\uC815\uAD00\uACC4\uC120"),
      ["\uBB34\uAD00\uC2EC"].map(t=>React.createElement("button",{
        key:t,
        onClick:()=>setLineType(t),
        style:{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 2px",border:"none",background:lineType===t?"#f0f7f2":"transparent",cursor:"pointer",gap:2,borderRadius:4}
      },
        React.createElement(LinePreview,{type:t,size:100,bw}),
        React.createElement("span",{style:{fontSize:9,color:lineType===t?"#2d7a3a":"#374151"}},"\uBB34\uAD00\uC2EC")
      )),
      // \uD559\uB300\u00B7\uAC08\uB4F1
      React.createElement("div",{style:{padding:"4px 8px",fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:1,marginTop:4}},"\uD559\uB300\u00B7\uAC08\uB4F1"),
      [["\uC815\uC11C\uC801\uD559\uB300","\uC815\uC11C\uC801\n\uD559\uB300"],["\uBC29\uC784","\uBC29\uC784"],["\uD1B5\uC81C","\uD1B5\uC81C"]].map(([t,label])=>React.createElement("button",{
        key:t,
        onClick:()=>setLineType(t),
        style:{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 2px",border:"none",background:lineType===t?"#f0f7f2":"transparent",cursor:"pointer",gap:2,borderRadius:4}
      },
        React.createElement(LinePreview,{type:t,size:100,bw}),
        React.createElement("span",{style:{fontSize:9,color:lineType===t?"#2d7a3a":"#374151",whiteSpace:"pre-line",textAlign:"center"}},label)
      ))
    )
  )
  ), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-t border-gray-200 shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-2.5 pb-1 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-[11px] text-gray-500 font-medium"
  }, /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "\uC6B0\uD074\uB9AD"), " \uC5F0\uACB0 \uC2DC\uC791"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "\uACB0\uD63C/\uB3D9\uAC70\uC120 \uC6B0\uD074\uB9AD"), " \uC790\uB140 \uC5F0\uACB0"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "\uB0B4\uB2F4\uC790 \uD1A0\uAE00"), " \uC774\uC911\uB3C4\uD615 \uC9C0\uC815"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "\uB354\uBE14\uD074\uB9AD"), " \uC774\uB984\uD3B8\uC9D1"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "\uB098\uC774\uD074\uB9AD"), " \uB098\uC774\uD3B8\uC9D1")), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto font-semibold shrink-0 text-right leading-tight text-[11px] text-gray-500 whitespace-nowrap",
    style: { transform: "translateY(-7px)", marginRight: 80 }
  }, "\xA9 2026. An In-song. Distributed for free.", /*#__PURE__*/React.createElement("br", null), "(2026. \uC548\uC778\uC131. \uBB34\uB8CC \uBC30\uD3EC)")), /*#__PURE__*/React.createElement("div", {
    className: "px-5 pb-2.5 flex items-center gap-3 text-[11px] text-gray-500 font-medium"
  }, /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "Shift+\uD074\uB9AD"), " \uB2E4\uC911\uC120\uD0DD"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "\uB4DC\uB798\uADF8"), " \uBC94\uC704\xB7\uC774\uB3D9"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "Del"), " \uC0AD\uC81C"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-semibold"
  }, "Ctrl+Z"), " \uB418\uB3CC\uB9AC\uAE30"))));
}


const { useState, useEffect, useRef, useCallback } = React;

// ── 투어 ─────────────────────────────────────────────────────────
const TOUR_STEPS = [
  { target: null,              title: "가계도 편집기 🌳",          body: "가족 구조와 구성원 간의 관계를\n시각적으로 그릴 수 있어요.\n주요 기능을 안내해 드릴게요." },
  { target: "geo-nodes",       title: "인물 추가 □ ○ ◇",          body: "버튼을 클릭하면 캔버스에 도형이 추가돼요.\n• 더블클릭: 이름 입력\n• 나이 자리 클릭: 나이 입력\n• 사망/내담자 토글로 상태 표시", position: "bottom" },
  { target: "geo-child-types", title: "자녀 유형",                  body: "유산·사산·임신 등 특수 자녀 도형이에요.\n• 임신: 빈 삼각형\n• 자연유산: 삼각형 + X\n• 인공유산: 삼각형 + X + 아랫선\n• 사산아: 작은 사각형 + X\n부모 관계선에 자녀로 연결해 사용해요.", position: "bottom" },
  { target: "geo-lines",       title: "관계선 연결",                body: "선 종류를 먼저 선택하세요.\n인물을 우클릭 → 연결 모드 시작\n연결할 인물을 클릭하면 선이 그어집니다.\nEsc로 취소", position: "bottom" },
  { target: "geo-child-line",  title: "자녀선 종류",                body: "자녀 연결선 종류를 선택해요.\n• 일반: 실선\n• 위탁: 점선\n• 입양: 이중선", position: "bottom" },
  { target: "geo-twins",       title: "쌍둥이",                     body: "Shift+클릭으로 자녀 2명 이상 선택 후\n쌍둥이 버튼을 클릭하면 선이 그어져요.\n• 쌍둥이: 이란성\n• 일란성: V자 + 가로선", position: "bottom" },
  { target: "geo-substance",   title: "약물 · 정신 · 신체 표시",    body: "인물을 선택한 뒤 버튼을 클릭하면\n도형 안에 표시가 채워져요.\n다시 클릭하면 표시가 해제돼요.", position: "bottom", width: 300 },
  { target: "geo-textbox",     title: "텍스트 상자 T",              body: "캔버스 어디든 메모나 설명을 추가할 수 있어요.\n① T 버튼 클릭 → 커서 모양 변경\n② 원하는 위치 클릭 → 텍스트 상자 생성\n더블클릭으로 수정, 드래그로 이동 가능", position: "bottom" },
  { target: "geo-side-panel",  title: "감정선 · 학대 · 갈등",       body: "오른쪽 패널에 추가 선 종류가 있어요.\n• 감정 관계선: 무관심\n• 학대·갈등: 정서적학대, 방임, 통제\n패널 닫기(✕) / 열기(+) 가능", position: "left" },
  { target: "geo-actions",     title: "자녀 추가 · 뒤로",           body: "자녀 추가: 결혼/동거선 선택 후 클릭 →\n연결할 자녀 노드 클릭\n↩ 뒤로: 최대 30단계 실행 취소 (Ctrl+Z)", position: "bottom" },
  { target: "geo-save",        title: "저장 · 불러오기",             body: "💾 저장: SVG(이미지) / JSON(이후 수정 가능)\n📂 열기: 저장된 JSON 파일 불러오기", position: "bottom" },
  { target: "geo-canvas",      title: "캔버스 조작",                body: "• 드래그: 인물 이동\n• Shift+클릭: 다중 선택\n• 휠 스크롤: 줌 인/아웃\n• Alt+드래그: 화면 이동\n• Delete: 선택 항목 삭제", position: "top" },
  { target: null,              title: "준비 완료! ✅",               body: "이제 직접 그려보세요!\n❓ 버튼으로 언제든 다시 볼 수 있어요." },
];

function renderTourBody(text) {
  return React.createElement('div', { style: { textWrap: 'pretty' } },
    text.split('\n').map((line, i) => {
      if (!line) return React.createElement('div', { key: i, style: { height: '0.4em' } });
      const m = line.match(/^([•·])\s/);
      if (m) {
        return React.createElement('div', { key: i, style: { display: 'flex', gap: '0.4em', alignItems: 'flex-start' } },
          React.createElement('span', { style: { flexShrink: 0, lineHeight: 1.6 } }, m[1]),
          React.createElement('span', { style: { flex: 1, minWidth: 0, lineHeight: 1.6 } }, line.slice(m[0].length))
        );
      }
      return React.createElement('div', { key: i, style: { lineHeight: 1.6 } }, line);
    })
  );
}

function TourOverlay({ step, stepIndex, total, onNext, onPrev, onClose }) {
  const [spotlight, setSpotlight] = React.useState(null);
  React.useEffect(() => {
    if (!step.target) { setSpotlight(null); return; }
    const el = document.querySelector('[data-tour="' + step.target + '"]');
    if (!el) { setSpotlight(null); return; }
    setSpotlight(el.getBoundingClientRect());
  }, [step]);
  const TW = step.width || 300, SP = 6, PAD = 10;
  function tooltipStyle() {
    if (!spotlight) return { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:9002, width:TW };
    const pos = step.position || 'bottom', cx = spotlight.left + spotlight.width / 2;
    let top, left;
    if (pos === 'bottom')      { top = spotlight.bottom + SP + PAD; left = cx - TW / 2; }
    else if (pos === 'top')    { top = spotlight.top - SP - PAD - 220; left = cx - TW / 2; }
    else if (pos === 'right')  { top = spotlight.top; left = spotlight.right + SP + PAD; }
    else                       { top = spotlight.top; left = spotlight.left - TW - SP - PAD; }
    return { position:'fixed', top: Math.max(8,top), left: Math.max(8, Math.min(left, window.innerWidth-TW-8)), zIndex:9002, width:TW };
  }
  return React.createElement(React.Fragment, null,
    !spotlight && React.createElement('div', { style:{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', zIndex:9000, pointerEvents:'none' } }),
    spotlight && React.createElement('div', { style:{ position:'fixed', top:spotlight.top-SP, left:spotlight.left-SP, width:spotlight.width+SP*2, height:spotlight.height+SP*2, borderRadius:10, boxShadow:'0 0 0 9999px rgba(0,0,0,0.35), 0 0 0 2px #d1d5db', zIndex:9001, pointerEvents:'none' } }),
    React.createElement('div', { style:{ ...tooltipStyle(), background:'#fff', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', border:'1px solid #e5e7eb', overflow:'hidden', fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif" } },
      React.createElement('div', { style:{ padding:'14px 16px' } },
        React.createElement('p', { style:{ fontWeight:600, color:'#374151', fontSize:14, marginBottom:6 } }, step.title),
        React.createElement('div', { style:{ fontSize:12, color:'#6b7280' } }, renderTourBody(step.body)),
        React.createElement('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px solid #f3f4f6' } },
          React.createElement('button', { onClick:onClose, style:{ fontSize:11, color:'#9ca3af', cursor:'pointer', background:'none', border:'none', padding:0 } }, '건너뛰기'),
          React.createElement('div', { style:{ display:'flex', gap:6 } },
            stepIndex > 0 && React.createElement('button', { onClick:onPrev, style:{ fontSize:12, padding:'5px 12px', borderRadius:6, border:'1px solid #e5e7eb', cursor:'pointer', background:'#f9fafb', color:'#374151' } }, '이전'),
            React.createElement('button', { onClick:onNext, style:{ fontSize:12, padding:'5px 12px', borderRadius:6, border:'1px solid #e5e7eb', cursor:'pointer', background:'#f9fafb', color:'#111827', fontWeight:600 } }, stepIndex === total-1 ? '완료' : '다음 →')
          )
        ),
        React.createElement('div', { style:{ display:'flex', justifyContent:'center', gap:6, marginTop:10 } },
          Array.from({ length: total }).map((_, i) =>
            React.createElement('div', { key:i, style:{ borderRadius:99, background: i===stepIndex ? '#6b7280' : '#e5e7eb', width: i===stepIndex ? 12 : 5, height:5, transition:'all 0.2s' } })
          )
        )
      )
    )
  );
}
// ─────────────────────────────────────────────────────────────────

// ── 줌 완전 차단 ──
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
window.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key==='+' || e.key==='-' || e.key==='=' || e.key==='0')) e.preventDefault();
});
window.addEventListener('touchmove', e => {
  if (e.touches && e.touches.length > 1) e.preventDefault();
}, { passive: false });

const LOGO_SRC = "images/logo.png";

// ════════════════════════════════════════════════════════════
//  사용 설명 챗봇 (스크립트형 — 외부 서버/API 없이 브라우저 안에서만 동작)
// ════════════════════════════════════════════════════════════
const GENO_FAQ = [
  { id:'what', q:'가계도가 뭔가요?',
    keywords:['가계도가뭐','가계도란','genogram','뭐하는','무엇','뭔가요','어떤도구','무슨앱','왜쓰'],
    a:'가계도(Genogram)는 가족 구조와 구성원 간의 관계를 시각화하는 도구예요. 상담에서 내담자의 가족 역동을 파악하고 기록하는 데 활용돼요.' },
  { id:'tour', q:'단계별 안내 투어 보기',
    keywords:['투어','처음','시작','따라하','단계별','가이드','안내투어','어떻게시작','뭐부터'],
    a:'상단 ❓ 버튼을 누르면 주요 기능을 단계별로 짚어주는 화면 투어가 시작돼요. 처음이시면 이걸 추천드려요!' },
  { id:'add', q:'인물(가족) 추가하기',
    keywords:['인물추가','사람추가','가족추가','사람넣','인물넣','남성','여성','논바이너리','도형추가','구성원','멤버','사람만들','가족넣'],
    a:'상단 툴바의 도형 버튼을 클릭하면 캔버스에 인물이 추가돼요.\n• □ 남성   • ○ 여성   • ◇ 논바이너리\n\n추가한 뒤에는\n• 더블클릭 → 이름 입력\n• 도형 안 나이 자리 클릭 → 나이 입력' },
  { id:'death', q:'사망 표시하기',
    keywords:['사망','죽','돌아가','엑스','고인','x표시'],
    a:'인물을 선택한 뒤 ✕(사망 토글) 버튼을 누르면 도형 안에 X가 생겨 사망을 나타내요. 다시 누르면 해제돼요.' },
  { id:'client', q:'내담자(IP) 표시하기',
    keywords:['내담자','ip','당사자','이중도형','주인공','지목환자'],
    a:'인물을 선택한 뒤 ⊡(내담자 토글) 버튼을 누르면 이중 도형으로 표시되어 내담자임을 나타내요.' },
  { id:'rel', q:'관계선(결혼·이혼 등) 그리기',
    keywords:['관계선','결혼','이혼','별거','재결합','동거','약혼','사별','선그리','선연결','줄긋','부부','혼인','연결하','선긋'],
    a:'① 상단 툴바에서 선 종류를 먼저 선택해요 (결혼/별거/이혼/재결합/동거/약혼/사별)\n② 시작 인물을 우클릭 → 연결 모드 시작\n③ 연결할 상대 인물을 클릭 → 선이 그어짐\n④ Esc로 취소' },
  { id:'emo', q:'정서선·학대·갈등선 그리기',
    keywords:['정서','감정선','소원','친밀','밀착','단절','갈등','융합','학대','신체적','성적','무관심','방임','통제','정서적학대'],
    a:'정서·학대·갈등선도 관계선과 같은 방법으로 그려요 (선 선택 → 인물 우클릭 → 상대 클릭).\n• 정서거리: 소원/친밀/밀착/단절\n• 갈등: 갈등/융합된갈등\n• 학대: 신체적학대/성적학대\n\n오른쪽 패널(+ 버튼)을 열면 무관심·정서적학대·방임·통제 같은 추가 선도 있어요.' },
  { id:'child', q:'자녀 연결하기',
    keywords:['자녀','아이','자식','아들','딸','자녀선','자녀추가','애기','부모자식','자녀연결'],
    a:'결혼/동거선에 자녀를 매달아요. 두 가지 방법:\n• 방법1(버튼): 결혼/동거선 클릭 → 상단 "자녀 추가" 버튼 → 자녀 인물 클릭\n• 방법2(우클릭): 결혼/동거선 우클릭 → 자녀 인물 클릭\n\n자녀선은 부모 관계선 중앙에서 수직으로 내려와 연결돼요.' },
  { id:'childline', q:'자녀선 종류 (일반·위탁·입양)',
    keywords:['일반선','위탁','입양','자녀선종류','점선','이중선'],
    a:'자녀 연결선 종류를 고를 수 있어요.\n• 일반: 실선   • 위탁: 점선   • 입양: 이중선' },
  { id:'special', q:'유산·사산·임신 등 특수 자녀',
    keywords:['임신','유산','자연유산','인공유산','사산','낙태','유산아','특수자녀'],
    a:'특수 자녀 도형이에요. 부모 관계선에 자녀로 연결해 사용해요.\n• 임신: 빈 삼각형\n• 자연유산: 삼각형 + X\n• 인공유산: 삼각형 + X + 아랫선\n• 사산아: 작은 사각형 + X' },
  { id:'twin', q:'쌍둥이 묶기',
    keywords:['쌍둥이','쌍동이','일란성','이란성','트윈'],
    a:'Shift+클릭으로 자녀 2명 이상을 선택한 뒤 "쌍둥이" 버튼을 눌러요.\n• 쌍둥이: 이란성   • 일란성: V자 + 가로선' },
  { id:'subst', q:'약물·정신·신체 표시',
    keywords:['약물','정신','신체','질환','중독','표시채우','문제표시'],
    a:'인물을 선택한 뒤 해당 버튼을 누르면 도형 안에 표시가 채워져요. 다시 누르면 해제돼요.' },
  { id:'text', q:'메모(텍스트 상자) 넣기',
    keywords:['텍스트','메모','글자','설명추가','t버튼','주석','텍스트상자','글씨'],
    a:'① 상단 T 버튼 클릭 → 커서 모양이 바뀜\n② 원하는 위치 클릭 → 텍스트 상자 생성\n더블클릭으로 수정, 드래그로 이동할 수 있어요.' },
  { id:'edit', q:'이름·나이 편집하기',
    keywords:['이름','나이','편집','수정','글자입력','이름바꾸','나이입력','이름고치'],
    a:'• 이름: 도형을 더블클릭 → 입력\n• 나이: 도형 안의 나이 텍스트를 클릭 → 입력' },
  { id:'move', q:'이동·다중 선택하기',
    keywords:['이동','옮기','움직','다중선택','여러개','범위선택','드래그','함께선택','한꺼번에'],
    a:'• 이동: 도형을 드래그\n• 다중 선택: Shift+클릭, 또는 빈 공간을 드래그해 범위 선택\n선택한 여러 개를 함께 이동할 수 있어요.' },
  { id:'del', q:'삭제하기',
    keywords:['삭제','지우','없애','제거','delete','지움'],
    a:'지울 항목을 선택한 뒤 Delete 키(또는 상단 삭제 버튼)를 누르면 삭제돼요.' },
  { id:'undo', q:'되돌리기 (실행 취소)',
    keywords:['되돌리','실행취소','undo','ctrlz','복구','이전으로','뒤로'],
    a:'Ctrl+Z(또는 상단 ↩ 뒤로 버튼)로 되돌릴 수 있어요. 최대 30단계까지 가능해요.' },
  { id:'save', q:'저장하기 (JSON·SVG)',
    keywords:['저장','세이브','save','내보내기','이미지저장','svg','json저장','파일저장'],
    a:'💾 저장 버튼을 누르면 두 형식 중 고를 수 있어요.\n• JSON: 나중에 불러와 이어서 수정 가능\n• SVG: 완성본을 벡터 이미지로 내보냄 (확대해도 선명)' },
  { id:'load', q:'불러오기 (이어서 작업)',
    keywords:['불러오','열기','load','파일열','이어서','복원','가져오기'],
    a:'📂 열기 버튼으로 저장해 둔 JSON 파일을 불러오면 그 상태에서 이어서 작업할 수 있어요.' },
  { id:'zoom', q:'확대·축소·화면 이동',
    keywords:['확대','축소','줌','zoom','화면이동','패닝','크게','작게','100'],
    a:'• 휠 스크롤: 줌 인/아웃\n• Alt+드래그: 화면 이동(패닝)\n• 상단 확대/축소/100% 버튼으로도 조절돼요.' },
  { id:'keys', q:'단축키 모아보기',
    keywords:['단축키','키보드','숏컷','hotkey','키설명','단축'],
    a:'⌨️ 단축키\n• 우클릭(인물): 연결 모드 시작\n• 우클릭(관계선): 자녀 연결 모드\n• 더블클릭: 이름 편집\n• Shift+클릭: 다중 선택\n• 빈 공간 드래그: 범위 선택\n• Delete: 삭제\n• Ctrl+Z: 되돌리기\n• Esc: 선택 해제/연결 취소' },
  { id:'privacy', q:'개인정보는 안전한가요?',
    keywords:['개인정보','보안','유출','서버','안전','프라이버시','저장되나','외부전송','데이터어디'],
    a:'🔒 모든 데이터는 이 브라우저 안에서만 처리돼요. 입력한 내용이 외부 서버로 전송되지 않아 상담 내용 유출 걱정 없이 쓸 수 있어요.' },
];
const GENO_FAQ_MAP = Object.fromEntries(GENO_FAQ.map(f => [f.id, f]));
const GENO_QUICK = ['add', 'rel', 'child', 'save', 'keys'];
const GENO_CATS = [
  ['🌱 시작하기',     ['what', 'tour', 'privacy']],
  ['👤 인물 추가',    ['add', 'death', 'client', 'subst', 'special']],
  ['🔗 관계선 그리기', ['rel', 'emo', 'child', 'childline', 'twin']],
  ['✏️ 편집·이동',    ['edit', 'move', 'del', 'undo', 'text', 'zoom']],
  ['💾 저장·단축키',  ['save', 'load', 'keys']],
];
const GENO_CAT_OF = {};
GENO_CATS.forEach(([, ids]) => ids.forEach(id => { GENO_CAT_OF[id] = ids; }));
function genoRelated(id) {
  return (GENO_CAT_OF[id] || []).filter(x => x !== id).slice(0, 3);
}

// 챗봇 전용 애니메이션 스타일 1회 주입
(function () {
  if (typeof document === 'undefined' || document.getElementById('geno-chat-style')) return;
  const s = document.createElement('style');
  s.id = 'geno-chat-style';
  s.textContent =
    '@keyframes gbcblink{0%,80%,100%{opacity:.25}40%{opacity:1}}' +
    '.gbc-dot{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:#9aa39a;animation:gbcblink 1.2s infinite both}' +
    '@keyframes gbcpulse{0%{box-shadow:0 8px 22px rgba(58,106,74,.4),0 0 0 0 rgba(58,106,74,.45)}70%{box-shadow:0 8px 22px rgba(58,106,74,.4),0 0 0 14px rgba(58,106,74,0)}100%{box-shadow:0 8px 22px rgba(58,106,74,.4),0 0 0 0 rgba(58,106,74,0)}}' +
    '@keyframes gbcfloat{0%{opacity:0;transform:translateY(8px) scale(.9)}100%{opacity:1;transform:translateY(0) scale(1)}}' +
    '@keyframes gbcbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}' +
    '.gbc-fab{animation:gbcfloat .35s ease both,gbcbob 2.8s ease-in-out 0.5s infinite;transition:box-shadow .18s ease}' +
    '.gbc-fab:hover{animation:gbcfloat .35s ease both;transform:scale(1.08) translateY(-2px)}' +
    '.gbc-fab:active{transform:scale(.95)}';
  document.head.appendChild(s);
})();

function genoFindFaq(input) {
  const t = (input || '').toLowerCase().replace(/\s+/g, '');
  if (!t) return null;
  if (/(안녕|하이|hello|^hi$|ㅎㅇ|반가|고마|감사|ㄳ|ㄱㅅ)/.test(t)) return { greeting: true };
  let best = null, score = 0;
  for (const f of GENO_FAQ) {
    let s = 0;
    for (const kw of f.keywords) if (t.includes(kw)) s += kw.length;
    if (s > score) { score = s; best = f; }
  }
  return score > 0 ? best : null;
}

function GenoChatLines(text) {
  return text.split('\n').map((ln, i) =>
    React.createElement('div', { key:i, style: ln ? null : { height:'6px' } }, ln));
}

function GenoChatbot() {
  const WELCOME = '안녕하세요! 가계도 스케치북 도우미예요 🌳\n궁금한 걸 입력하거나 아래 버튼을 눌러보세요.';
  const [open, setOpen] = React.useState(false);
  const [seen, setSeen] = React.useState(() => { try { return localStorage.getItem('gb_geo_chat_seen') === '1'; } catch (e) { return false; } });
  const [input, setInput] = React.useState('');
  const [msgs, setMsgs] = React.useState([
    { from:'bot', text:WELCOME, chips: GENO_QUICK.map(id => ({ label:GENO_FAQ_MAP[id].q, id })).concat([{ label:'📋 전체 메뉴', id:'__menu' }]) }
  ]);
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open]);

  // 타이핑(•••) 표시 후 실제 답변으로 교체
  const botSay = (payload, delay) => {
    const tid = 't' + Date.now() + Math.random();
    setMsgs(p => [...p, { from:'bot', typing:true, _id:tid }]);
    setTimeout(() => setMsgs(p => p.map(m => m._id === tid ? Object.assign({ from:'bot', _id:tid }, payload) : m)), delay || 420);
  };
  const quickChips = () => GENO_QUICK.map(id => ({ label:GENO_FAQ_MAP[id].q, id })).concat([{ label:'📋 전체 메뉴', id:'__menu' }]);
  const followups = (faq) => {
    const rel = genoRelated(faq.id).map(id => ({ label:GENO_FAQ_MAP[id].q, id }));
    const extra = faq.id === 'tour' ? [{ label:'▶ 투어 시작하기', id:'__tour' }] : [];
    return extra.concat(rel).concat([{ label:'📋 전체 메뉴', id:'__menu' }]);
  };
  const menuMsg = (lead) => ({
    text: lead || '무엇이 궁금하세요? 👇',
    grouped: GENO_CATS.map(([label, ids]) => ({ label, chips: ids.map(id => ({ label:GENO_FAQ_MAP[id].q, id })) })),
  });

  const handle = (text) => {
    const q = text.trim();
    if (!q) return;
    setMsgs(p => [...p, { from:'user', text:q }]);
    setInput('');
    const r = genoFindFaq(q);
    if (r && r.greeting) botSay({ text:'네, 무엇을 도와드릴까요? 😊', chips: quickChips() });
    else if (r) botSay({ text:r.a, chips: followups(r) });
    else botSay(menuMsg('음, 정확히 못 찾았어요. 아래에서 골라보시거나 다른 말로 물어봐 주세요!'));
  };

  const onChip = (id, label) => {
    if (id === '__tour') {
      setOpen(false);
      window.dispatchEvent(new CustomEvent('geno-chat-action', { detail:'tour' }));
      return;
    }
    if (id === '__menu') {
      setMsgs(p => [...p, { from:'user', text:'전체 메뉴' }]);
      botSay(menuMsg());
      return;
    }
    const faq = GENO_FAQ_MAP[id];
    if (!faq) return;
    setMsgs(p => [...p, { from:'user', text: label || faq.q }]);
    botSay({ text: faq.a, chips: followups(faq) });
  };

  const chipRow = (chips, kp) => React.createElement('div', { style:{ display:'flex', flexWrap:'wrap', gap:6 } },
    ...chips.map((c, j) => React.createElement('button', {
      key: kp + j, onClick: () => onChip(c.id, c.label),
      style:{ padding:'5px 10px', borderRadius:14, border:'1px solid #cfe0d4',
              background:'#fff', color:'#3a6a4a', fontSize:11, cursor:'pointer',
              fontWeight:500, whiteSpace:'nowrap' }
    }, c.label)));

  // 닫혀 있을 때: 떠 있는 버블 버튼 (첫 방문 시 펄스로 주목)
  if (!open) {
    const openChat = () => { setOpen(true); if (!seen) { setSeen(true); try { localStorage.setItem('gb_geo_chat_seen', '1'); } catch (e) {} } };
    return React.createElement('div', {
      style:{ position:'fixed', right:20, bottom:20, zIndex:8000, display:'flex', alignItems:'center', gap:10 }
    },
      !seen ? React.createElement('div', {
        onClick: openChat,
        style:{ background:'rgba(51,53,47,0.82)', backdropFilter:'blur(6px)', color:'#fff', fontSize:12, fontWeight:600,
                padding:'8px 13px', borderRadius:16, boxShadow:'0 3px 14px rgba(0,0,0,0.18)',
                cursor:'pointer', whiteSpace:'nowrap', animation:'gbcfloat .4s ease both' }
      }, '사용법이 궁금하면 눌러보세요 👉') : null,
      React.createElement('button', {
        onClick: openChat,
        title: '궁금한 기능을 질문하면 알려드려요!',
        className: 'gbc-fab',
        style:{
          width:58, height:58, borderRadius:'50%', border:'none', padding:0,
          background:'linear-gradient(135deg,#52916a 0%,#3a6a4a 100%)',
          cursor:'pointer',
          boxShadow: seen ? '0 8px 22px rgba(58,106,74,0.4)' : undefined,
          animation: seen ? undefined : 'gbcpulse 2s infinite',
          display:'flex', alignItems:'center', justifyContent:'center',
        }
      },
        React.createElement('svg', { width:27, height:27, viewBox:'0 0 24 24', fill:'none', xmlns:'http://www.w3.org/2000/svg' },
          React.createElement('path', { d:'M4 5.6C4 4.7 4.7 4 5.6 4h12.8C19.3 4 20 4.7 20 5.6v8.8c0 .9-.7 1.6-1.6 1.6H9.2l-3.6 3c-.6.5-1.6.1-1.6-.7V5.6Z', fill:'#fff' }),
          React.createElement('circle', { cx:8.8, cy:10, r:1.25, fill:'#3a6a4a' }),
          React.createElement('circle', { cx:12, cy:10, r:1.25, fill:'#3a6a4a' }),
          React.createElement('circle', { cx:15.2, cy:10, r:1.25, fill:'#3a6a4a' })
        )
      )
    );
  }

  // 열려 있을 때: 채팅창
  return React.createElement('div', {
    style:{
      position:'fixed', right:20, bottom:20, zIndex:8001,
      width:340, maxWidth:'calc(100vw - 40px)', height:480, maxHeight:'calc(100vh - 40px)',
      background:'#fff', borderRadius:14, overflow:'hidden',
      boxShadow:'0 8px 32px rgba(0,0,0,0.22)',
      display:'flex', flexDirection:'column',
      fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
    }
  },
    // 헤더
    React.createElement('div', {
      style:{ background:'linear-gradient(135deg,#52916a 0%,#3a6a4a 100%)', color:'#fff', padding:'12px 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }
    },
      React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:8 } },
        React.createElement('span', { style:{ fontSize:18 } }, '🌳'),
        React.createElement('div', null,
          React.createElement('div', { style:{ fontWeight:700, fontSize:14 } }, '가계도 도우미'),
          React.createElement('div', { style:{ fontSize:10, opacity:0.85 } }, '사용법을 알려드려요')
        )
      ),
      React.createElement('button', {
        onClick: () => setOpen(false),
        style:{ width:26, height:26, borderRadius:6, border:'none',
                background:'rgba(255,255,255,0.18)', color:'#fff', cursor:'pointer', fontSize:13 }
      }, '✕')
    ),
    // 메시지 본문
    React.createElement('div', {
      ref: bodyRef,
      style:{ flex:1, overflowY:'auto', padding:'14px', background:'#f6f7f5',
              display:'flex', flexDirection:'column', gap:10 }
    },
      ...msgs.map((m, i) => m.from === 'user'
        ? React.createElement('div', { key:i, style:{ alignSelf:'flex-end', maxWidth:'80%',
            background:'#3a6a4a', color:'#fff', padding:'8px 12px', borderRadius:'12px 12px 2px 12px',
            fontSize:12.5, lineHeight:1.5, whiteSpace:'pre-wrap' } }, m.text)
        : React.createElement('div', { key:i, style:{ alignSelf:'flex-start', maxWidth:'92%', display:'flex', flexDirection:'column', gap:7 } },
            m.typing
              ? React.createElement('div', { style:{ background:'#fff', padding:'11px 14px', width:'fit-content',
                  borderRadius:'12px 12px 12px 2px', border:'1px solid #e7e9e4' } },
                  React.createElement('span', { className:'gbc-dot' }),
                  React.createElement('span', { className:'gbc-dot' }),
                  React.createElement('span', { className:'gbc-dot' }))
              : React.createElement(React.Fragment, null,
                  m.text ? React.createElement('div', { style:{ background:'#fff', color:'#33352f', padding:'9px 12px',
                    borderRadius:'12px 12px 12px 2px', fontSize:12.5, lineHeight:1.55,
                    border:'1px solid #e7e9e4' } }, ...GenoChatLines(m.text)) : null,
                  m.grouped ? React.createElement('div', { style:{ display:'flex', flexDirection:'column', gap:9 } },
                    ...m.grouped.map((g, gi) => React.createElement('div', { key:'g'+gi },
                      React.createElement('div', { style:{ fontSize:10.5, fontWeight:700, color:'#7a8a7c', margin:'1px 2px 5px' } }, g.label),
                      chipRow(g.chips, 'g'+gi+'_')
                    ))
                  ) : null,
                  m.chips && m.chips.length ? chipRow(m.chips, 'c'+i+'_') : null
                )
          )
      )
    ),
    // 입력창
    React.createElement('div', {
      style:{ display:'flex', gap:8, padding:'10px 12px', borderTop:'1px solid #eceee9', background:'#fff', flexShrink:0 }
    },
      React.createElement('input', {
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => { if (e.key === 'Enter') handle(input); },
        placeholder: '예: 결혼선 어떻게 그려요?',
        style:{ flex:1, border:'1px solid #d8dad4', borderRadius:18, padding:'8px 14px',
                fontSize:12.5, outline:'none', fontFamily:'inherit' }
      }),
      React.createElement('button', {
        onClick: () => handle(input),
        style:{ width:38, height:38, borderRadius:'50%', border:'none', background:'#3a6a4a',
                color:'#fff', cursor:'pointer', fontSize:15, flexShrink:0 }
      }, '➤')
    )
  );
}

function App() {
  const [ready, setReady] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [tourStep, setTourStep] = React.useState(-1);
  const [showTourPrompt, setShowTourPrompt] = React.useState(false);


  React.useEffect(() => {
    const splash = document.getElementById('splash');
    const t1 = setTimeout(() => {
      if (splash) splash.classList.add('fade-out');
      setTimeout(() => {
        if (splash) splash.style.display = 'none';
        setReady(true);
        if (!localStorage.getItem('gb_geo_tour_done')) {
          setTimeout(() => setShowTourPrompt(true), 600);
        }
      }, 1200);
    }, 5800);
  }, []);

  React.useEffect(() => {
    const onAction = (e) => {
      if (e.detail === 'tour') { setShowTourPrompt(false); setTourStep(0); }
    };
    window.addEventListener('geno-chat-action', onAction);
    return () => window.removeEventListener('geno-chat-action', onAction);
  }, []);

  if (!ready) return null;

  return React.createElement(React.Fragment, null,
    // ── 헤더 ──
    React.createElement('div', {
      style:{
        height:'56px', minHeight:'56px', maxHeight:'56px',
        background:'#fff', borderBottom:'1px solid #e5e7eb',
        display:'flex', alignItems:'center', padding:'0 16px',
        flexShrink:0, userSelect:'none', position:'relative', zIndex:100,
      }
    },
      // 로고 + 타이틀
      React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:'10px' } },
        React.createElement('img', {
          src: LOGO_SRC,
          alt: '곤글박이 로고',
          style:{
            width:35, height:44, objectFit:'contain',
                      }
        }),
        React.createElement('div', { style:{ display:'flex', flexDirection:'column', alignItems:'stretch' } },
          React.createElement('div', {
            style:{ display:'flex', justifyContent:'space-between', width:'100%',
                     fontSize:'16.5px', fontWeight:700, color:'#2a2a22',
                     fontFamily:"'HCR Batang','함초롱바탕','Noto Serif KR','Malgun Gothic',serif",
                     lineHeight:1.2 }
          }, ...['곤','글','박','이'].map((ch,i) => React.createElement('span',{key:i},ch))),
          React.createElement('div', {
            style:{ fontSize:'11px', color:'#8a8a7a',
                     fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
                     lineHeight:1.2,
                     whiteSpace:'nowrap' }
          }, '가계도 스케치북')
        )
      ),
      // 우측 버튼
      React.createElement('div', { style:{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px' } },
        React.createElement('div', {
          style:{ fontSize:'11px', color:'#ccc',
                   fontFamily:"'Malgun Gothic',sans-serif", marginRight:8 }
        }, '모든 데이터는 서버에 저장되지 않습니다'),
        React.createElement('div', { style:{ width:'0.5px', height:20, background:'#e5e7eb', margin:'0 4px' } }),
        React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:8, marginRight:4 } },
          React.createElement('a', {
            href: 'https://drive.google.com/file/d/1F2c-l_Lezn7RBtAOCPBKCal8jxKYmire/view?usp=drive_link',
            target: '_blank', rel: 'noopener', title: '축어록 자동변환+가계도',
            style:{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'0 14px', height:34,
              background:'#fff', border:'0.5px solid #d1d5db', borderRadius:6,
              fontSize:12, fontWeight:500, color:'#374151',
              cursor:'pointer', whiteSpace:'nowrap', textDecoration:'none',
            }
          },
            React.createElement('svg', { xmlns:'http://www.w3.org/2000/svg', width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' },
              React.createElement('path', { d:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
              React.createElement('polyline', { points:'7 10 12 15 17 10' }),
              React.createElement('line', { x1:'12', y1:'15', x2:'12', y2:'3' })
            ),
            '곤글박이 다운로드'
          ),
          React.createElement('a', {
            href: 'https://blog.naver.com/rmsid1907/224284470652',
            target: '_blank', rel: 'noopener', title: '곤글박이 설명',
            style:{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'0 14px', height:34,
              background:'#3a6a4a', border:'0.5px solid #2d5a3c', borderRadius:6,
              fontSize:12, fontWeight:500, color:'#fff',
              cursor:'pointer', whiteSpace:'nowrap', textDecoration:'none',
            }
          },
            React.createElement('svg', { xmlns:'http://www.w3.org/2000/svg', width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' },
              React.createElement('path', { d:'M12 20h9' }),
              React.createElement('path', { d:'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' })
            ),
            '개발자 블로그'
          )
        ),
        React.createElement('div', { style:{ width:'0.5px', height:20, background:'#e5e7eb', margin:'0 4px' } }),
        React.createElement('button', {
          onClick: () => setTourStep(0),
          title: '사용 안내 투어',
          style:{
            width:32, height:32, borderRadius:6,
            border:'1px solid #e5e7eb',
            background:'#fff',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'14px', color:'#6b7280',
          }
        }, '❓')
      )
    ),
    // ── 정보 패널 (제거됨 — 💬 챗봇으로 대체) ──
    false ?
React.createElement('div', {
  style: {
    position:'fixed', top:64, right:12, zIndex:1000,
    background:'#fff', border:'1px solid #e5e7eb',
    borderRadius:10, padding:'0',
    boxShadow:'0 4px 24px rgba(0,0,0,0.13)',
    width:380, maxHeight:'calc(100vh - 80px)',
    display:'flex', flexDirection:'column',
    fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
    fontSize:'12px',
  }
},
  // 헤더
  React.createElement('div', {
    style:{ padding:'14px 18px 10px', borderBottom:'1px solid #f0f0f0',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }
  },
    React.createElement('div', { style:{ fontWeight:700, fontSize:'14px', color:'#2a2a22' } }, '곤글박이 사용 안내'),
    React.createElement('button', {
      onClick: () => setShowInfo(false),
      style:{ width:26, height:26, borderRadius:5, border:'1px solid #e5e7eb',
              background:'#f9fafb', cursor:'pointer', fontSize:'13px', color:'#6b7280',
              display:'flex', alignItems:'center', justifyContent:'center' }
    }, '✕')
  ),
  // 스크롤 본문
  React.createElement('div', {
    style:{ overflowY:'auto', padding:'14px 18px 18px', lineHeight:1.7, color:'#4a4a3a' }
  },
    // 가계도란?
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:6 } }, '🌳 가계도란?'),
      React.createElement('div', { style:{ color:'#5a5a4a', fontSize:'11.5px' } },
        '가계도(Genogram)는 가족 구조와 구성원 간의 관계를 시각화하는 도구입니다. 상담 장면에서 내담자의 가족 역동을 파악하고 기록하는 데 활용됩니다.'
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 인물 추가
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:8 } }, '👤 인물 추가'),
      ...[
        ['□ 남성', '네모 도형으로 표시됩니다. 상단 툴바의 □ 버튼을 클릭해 추가합니다.'],
        ['○ 여성', '원형 도형으로 표시됩니다. 상단 툴바의 ○ 버튼을 클릭해 추가합니다.'],
        ['◇ 논바이너리', '마름모 도형으로 표시됩니다. 상단 툴바의 ◇ 버튼을 클릭해 추가합니다.'],
        ['✕ 사망 토글', '인물을 선택한 후 클릭하면 도형 안에 X 표시가 생겨 사망을 나타냅니다.'],
        ['⊡ 내담자 토글', '인물을 선택한 후 클릭하면 이중 도형으로 표시되어 내담자임을 나타냅니다.'],
      ].map(([label, desc]) =>
        React.createElement('div', { key:label, style:{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' } },
          React.createElement('div', { style:{ minWidth:80, fontWeight:600, color:'#3a6a4a', fontSize:'11px', paddingTop:1 } }, label),
          React.createElement('div', { style:{ fontSize:'11px', color:'#5a5a4a' } }, desc)
        )
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 관계선 연결
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:8 } }, '🔗 관계선 연결'),
      React.createElement('div', { style:{ fontSize:'11px', color:'#5a5a4a', marginBottom:8, background:'#f9fafb', borderRadius:6, padding:'8px 10px', lineHeight:1.8 } },
        '① 상단 툴바에서 연결할 선 종류를 선택합니다', React.createElement('br'),
        '② 시작 인물을 ', React.createElement('strong', null, '우클릭'), '하면 연결 모드로 전환됩니다', React.createElement('br'),
        '③ 연결할 상대 인물을 클릭하면 선이 그어집니다', React.createElement('br'),
        '④ Esc를 누르면 연결 모드가 취소됩니다'
      ),
      ...[
        ['가족관계', '결혼 / 별거 / 이혼 / 재결합 / 동거'],
        ['정서거리', '소원 / 친밀 / 밀착 / 단절'],
        ['갈등역동', '갈등 / 융합된갈등'],
        ['학대', '신체적학대 / 성적학대'],
      ].map(([cat, types]) =>
        React.createElement('div', { key:cat, style:{ display:'flex', gap:8, marginBottom:4, alignItems:'flex-start' } },
          React.createElement('div', { style:{ minWidth:56, fontWeight:600, color:'#6b7280', fontSize:'10px', paddingTop:1 } }, cat),
          React.createElement('div', { style:{ fontSize:'11px', color:'#5a5a4a' } }, types)
        )
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 자녀 연결
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:8 } }, '👶 자녀 연결'),
      React.createElement('div', { style:{ fontSize:'11px', color:'#5a5a4a', lineHeight:1.8 } },
        React.createElement('div', null, React.createElement('strong', null, '방법 1 — 버튼:'), ' 결혼/동거선 클릭 → 상단 자녀 추가 버튼 → 자녀 인물 클릭'),
        React.createElement('div', null, React.createElement('strong', null, '방법 2 — 우클릭:'), ' 결혼/동거선 우클릭 → 자녀 인물 클릭'),
        React.createElement('div', { style:{ color:'#8a8a7a', marginTop:4 } }, '자녀선은 부모 관계선 중앙에서 수직으로 내려와 연결됩니다.')
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 편집
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:8 } }, '✏️ 편집'),
      ...[
        ['이름 편집', '도형 더블클릭 → 이름 입력'],
        ['나이 편집', '도형 안의 나이 텍스트 클릭'],
        ['이동', '드래그로 위치 조정. Shift+클릭으로 다중 선택 후 함께 이동'],
        ['삭제', 'Delete 키 또는 상단 삭제 버튼'],
        ['되돌리기', 'Ctrl+Z 또는 상단 뒤로 버튼 (최대 30단계)'],
      ].map(([label, desc]) =>
        React.createElement('div', { key:label, style:{ display:'flex', gap:8, marginBottom:5, alignItems:'flex-start' } },
          React.createElement('div', { style:{ minWidth:68, fontWeight:600, color:'#3a6a4a', fontSize:'11px', paddingTop:1 } }, label),
          React.createElement('div', { style:{ fontSize:'11px', color:'#5a5a4a' } }, desc)
        )
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 단축키
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:8 } }, '⌨️ 단축키'),
      React.createElement('div', { style:{ background:'#f9fafb', borderRadius:6, padding:'8px 10px' } },
        ...[
          ['우클릭 (인물)', '연결 모드 시작'],
          ['우클릭 (관계선)', '자녀 연결 모드'],
          ['더블클릭', '이름 편집'],
          ['Shift + 클릭', '다중 선택'],
          ['드래그 (빈 공간)', '범위 선택'],
          ['Delete', '선택 항목 삭제'],
          ['Ctrl + Z', '되돌리기'],
          ['Esc', '선택 해제 / 연결 취소'],
        ].map(([key, action]) =>
          React.createElement('div', { key, style:{ display:'flex', justifyContent:'space-between', padding:'2px 0', fontSize:'11px' } },
            React.createElement('span', { style:{ fontWeight:600, color:'#374151', fontFamily:'monospace' } }, key),
            React.createElement('span', { style:{ color:'#6b7280' } }, action)
          )
        )
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 저장
    React.createElement('div', { style:{ marginBottom:16 } },
      React.createElement('div', { style:{ fontWeight:700, fontSize:'13px', color:'#2a2a22', marginBottom:8 } }, '💾 저장 · 불러오기'),
      ...[
        ['💾 JSON 저장', '작업 내용을 파일로 저장. 나중에 불러와 이어 작업 가능'],
        ['📂 불러오기', '저장한 JSON 파일을 열어 작업 복원'],
        ['🖼️ SVG 저장', '완성된 가계도를 벡터 이미지로 내보냄. 확대해도 선명'],
      ].map(([label, desc]) =>
        React.createElement('div', { key:label, style:{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' } },
          React.createElement('div', { style:{ minWidth:72, fontWeight:600, color:'#3a6a4a', fontSize:'11px', paddingTop:1 } }, label),
          React.createElement('div', { style:{ fontSize:'11px', color:'#5a5a4a' } }, desc)
        )
      )
    ),
    React.createElement('hr', { style:{ border:'none', borderTop:'1px solid #f0f0f0', margin:'12px 0' } }),
    // 보안
    React.createElement('div', { style:{ background:'#f0f7f2', borderRadius:6, padding:'10px 12px', marginBottom:12 } },
      React.createElement('div', { style:{ fontWeight:700, color:'#2d7a3a', fontSize:'11.5px', marginBottom:4 } }, '🔒 개인정보 보호'),
      React.createElement('div', { style:{ fontSize:'11px', color:'#4a7a5a', lineHeight:1.7 } },
        '모든 데이터는 이 브라우저 안에서만 처리됩니다. 입력한 내용이 외부 서버로 전송되지 않아 상담 내용 유출 걱정 없이 사용할 수 있습니다.'
      )
    ),
    // 저작권
    React.createElement('div', { style:{ fontSize:'10px', color:'#bbb', textAlign:'center', paddingTop:4 } },
      '© 2026. An In-song. Distributed for free. (2026. 안인성. 무료 배포)'
    )
  )
)
 : null,
    // ── 가계도 앱 ──
    React.createElement('div', {
      style:{ flex:1, overflow:'hidden', height:'calc(100vh - 56px)' }
    },
      React.createElement(Genogram)
    ),
    // ── 투어 시작 안내 ──
    showTourPrompt && React.createElement('div', {
      style:{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }
    },
      React.createElement('div', {
        style:{ background:'#fff', borderRadius:12, padding:'28px 32px', boxShadow:'0 8px 32px rgba(0,0,0,0.18)', width:320, fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif", textAlign:'center' }
      },
        React.createElement('div', { style:{ fontSize:28, marginBottom:12 } }, '🌳'),
        React.createElement('p', { style:{ fontWeight:700, fontSize:16, color:'#1f2937', marginBottom:8 } }, '가계도 사용법 안내'),
        React.createElement('p', { style:{ fontSize:13, color:'#6b7280', lineHeight:1.7, marginBottom:24 } }, '처음 오셨나요?\n주요 기능을 단계별로 안내해 드릴게요.'),
        React.createElement('div', { style:{ display:'flex', gap:10, justifyContent:'center' } },
          React.createElement('button', {
            onClick: () => { setShowTourPrompt(false); localStorage.setItem('gb_geo_tour_done', '1'); },
            style:{ padding:'9px 20px', borderRadius:8, border:'1px solid #e5e7eb', background:'#f9fafb', color:'#6b7280', fontSize:13, cursor:'pointer', fontWeight:500 }
          }, '괜찮아요'),
          React.createElement('button', {
            onClick: () => { setShowTourPrompt(false); setTourStep(0); },
            style:{ padding:'9px 20px', borderRadius:8, border:'none', background:'#3a6a4a', color:'#fff', fontSize:13, cursor:'pointer', fontWeight:600 }
          }, '네, 보여주세요 →')
        )
      )
    ),
    // ── 투어 오버레이 ──
    tourStep >= 0 && tourStep < TOUR_STEPS.length && React.createElement(TourOverlay, {
      step: TOUR_STEPS[tourStep],
      stepIndex: tourStep,
      total: TOUR_STEPS.length,
      onNext: () => {
        if (tourStep >= TOUR_STEPS.length - 1) {
          localStorage.setItem('gb_geo_tour_done', '1');
          setTourStep(-1);
        } else {
          setTourStep(s => s + 1);
        }
      },
      onPrev: () => setTourStep(s => Math.max(0, s - 1)),
      onClose: () => { localStorage.setItem('gb_geo_tour_done', '1'); setTourStep(-1); }
    }),
    // ── 사용법 챗봇 ──
    React.createElement(GenoChatbot)
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
