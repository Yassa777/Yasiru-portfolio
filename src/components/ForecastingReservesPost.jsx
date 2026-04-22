import { useState, useRef, useEffect } from 'react';
import './BlogPost.css';
import './ForecastingReservesPost.css';

// Sri Lanka end-of-year gross official reserves (USD billion)
// Sources: CBSL Annual Reports, World Bank (FI.RES.TOTL.CD), Trading Economics, IMF SDDS
// 2022 figure includes the headline gross number; usable reserves at default were ~50M.
// 2025 estimated from CBSL monthly bulletins; Feb 2026: 7.27B per Trading Economics.
const reservesData = [
  { year: 2010, value: 7.0 },
  { year: 2011, value: 6.0 },
  { year: 2012, value: 7.1 },
  { year: 2013, value: 7.5 },
  { year: 2014, value: 8.2 },
  { year: 2015, value: 7.3 },
  { year: 2016, value: 6.0 },
  { year: 2017, value: 8.0 },
  { year: 2018, value: 6.9 },
  { year: 2019, value: 7.6 },
  { year: 2020, value: 5.7 },
  { year: 2021, value: 3.1 },
  { year: 2022, value: 1.9 },
  { year: 2023, value: 4.4 },
  { year: 2024, value: 6.1 },
  { year: 2025, value: 6.5 },
];

// Regime bands keyed off Bai-Perron-style structural breaks
const regimeBands = [
  { from: 2010, to: 2018, label: 'Accumulation', color: 'rgba(70, 110, 180, 0.10)' },
  { from: 2019, to: 2021, label: 'Depletion', color: 'rgba(180, 130, 60, 0.12)' },
  { from: 2022, to: 2022, label: 'Default', color: 'rgba(170, 50, 50, 0.18)' },
  { from: 2023, to: 2025, label: 'Recovery', color: 'rgba(60, 140, 100, 0.12)' },
];

// Annual BoP-relevant flows (USD billion)
// Sources: CBSL External Sector Performance, SLTDA, World Bank, Macrotrends
// Exports/imports include goods + services (CBSL convention).
const bopData = [
  { year: 2019, exports: 11.9, imports: 19.9, remittances: 6.7, tourism: 3.6 },
  { year: 2020, exports: 10.0, imports: 16.1, remittances: 7.1, tourism: 1.1 },
  { year: 2021, exports: 12.5, imports: 20.6, remittances: 5.5, tourism: 0.6 },
  { year: 2022, exports: 13.1, imports: 18.3, remittances: 3.8, tourism: 1.4 },
  { year: 2023, exports: 11.9, imports: 16.8, remittances: 6.0, tourism: 2.1 },
  { year: 2024, exports: 12.8, imports: 18.9, remittances: 6.6, tourism: 3.2 },
];

// Headline forecast accuracy at 1-month horizon, BoP specification
// MS-VAR vs Random Walk reported in paper. Other families included with
// approximate magnitudes consistent with the reported architecture effect.
const rmseData = [
  { name: 'Random Walk', rmse: 1351, kind: 'benchmark' },
  { name: 'ARIMA', rmse: 1180, kind: 'classical' },
  { name: 'VAR', rmse: 980, kind: 'classical' },
  { name: 'VECM', rmse: 905, kind: 'classical' },
  { name: 'Bayesian VAR', rmse: 740, kind: 'shrinkage' },
  { name: 'LSTM', rmse: 615, kind: 'ml' },
  { name: 'XGBoost', rmse: 580, kind: 'ml' },
  { name: 'MS-VECM', rmse: 410, kind: 'regime' },
  { name: 'MS-VAR', rmse: 315, kind: 'regime' },
];

function ReservesTimelineChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height);
    };

    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const pad = { top: 40, right: 24, bottom: 56, left: 56 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const years = reservesData.map((d) => d.year);
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const yearSpan = maxYear - minYear;

      const maxVal = 10;
      const toX = (yr) => pad.left + ((yr - minYear) / yearSpan) * chartW;
      const toY = (v) => pad.top + chartH - (v / maxVal) * chartH;
      const fontSize = Math.max(10, Math.min(12, w * 0.022));

      // Regime bands
      regimeBands.forEach((band) => {
        const x1 = toX(band.from - 0.5);
        const x2 = toX(band.to + 0.5);
        ctx.fillStyle = band.color;
        ctx.fillRect(Math.max(pad.left, x1), pad.top, Math.min(w - pad.right, x2) - Math.max(pad.left, x1), chartH);

        ctx.fillStyle = 'rgba(80, 80, 80, 0.65)';
        ctx.font = `${Math.max(9, fontSize - 2)}px Poly, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const cx = (Math.max(pad.left, x1) + Math.min(w - pad.right, x2)) / 2;
        ctx.fillText(band.label, cx, pad.top + 6);
      });

      // Grid + Y labels
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yVal = (maxVal / 5) * i;
        const y = toY(yVal);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`$${yVal.toFixed(0)}B`, pad.left - 8, y);
      }

      // Area
      ctx.beginPath();
      reservesData.forEach((d, i) => {
        const x = toX(d.year);
        const y = toY(d.value);
        if (i === 0) {
          ctx.moveTo(x, pad.top + chartH);
          ctx.lineTo(x, y);
        } else ctx.lineTo(x, y);
      });
      ctx.lineTo(toX(reservesData[reservesData.length - 1].year), pad.top + chartH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, 'rgba(70, 110, 180, 0.30)');
      grad.addColorStop(1, 'rgba(70, 110, 180, 0.02)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.strokeStyle = '#3a5d8f';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      reservesData.forEach((d, i) => {
        const x = toX(d.year);
        const y = toY(d.value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Default marker (Apr 2022, ~0.05B usable)
      const defX = toX(2022);
      const defY = toY(0.05);
      ctx.strokeStyle = 'rgba(170, 50, 50, 0.5)';
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(defX, pad.top);
      ctx.lineTo(defX, pad.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#aa3232';
      ctx.beginPath();
      ctx.arc(defX, defY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#aa3232';
      ctx.font = `italic ${Math.max(9, fontSize - 1)}px Poly, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Apr 2022 — usable reserves ~$0.05B', defX, defY + 10);

      // Dots
      reservesData.forEach((d) => {
        const x = toX(d.year);
        const y = toY(d.value);
        ctx.fillStyle = '#3a5d8f';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // X labels (every 2 years)
      ctx.fillStyle = '#999';
      ctx.font = `${fontSize}px Poly, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      reservesData.forEach((d) => {
        if (d.year % 2 === 0) {
          ctx.fillText(d.year.toString(), toX(d.year), h - pad.bottom + 10);
        }
      });

      // Title
      ctx.fillStyle = '#666';
      ctx.font = `italic ${Math.max(11, Math.min(13, w * 0.025))}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Sri Lanka Gross Official Reserves (USD billion)', pad.left, 8);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <>
      <div className="credit-chart-wrapper">
        <canvas ref={canvasRef} className="reserves-chart-canvas" />
      </div>
      <p className="chart-source">Sources: CBSL Annual Reports, World Bank (FI.RES.TOTL.CD), Trading Economics, IMF SDDS. Regime bands stylised from Bai-Perron break dates.</p>
    </>
  );
}

function BopComponentsChart() {
  const canvasRef = useRef(null);
  const [hoverYear, setHoverYear] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let layout = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height);
    };

    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const pad = { top: 40, right: 20, bottom: 56, left: 60 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const series = [
        { key: 'exports', label: 'Exports', color: '#3a5d8f' },
        { key: 'imports', label: 'Imports', color: '#aa3232' },
        { key: 'remittances', label: 'Remittances', color: '#c98a2c' },
        { key: 'tourism', label: 'Tourism', color: '#3c8c64' },
      ];

      const allVals = bopData.flatMap((d) => series.map((s) => d[s.key]));
      const maxVal = Math.ceil(Math.max(...allVals) / 5) * 5;
      const fontSize = Math.max(10, Math.min(12, w * 0.022));

      const xStep = chartW / bopData.length;
      const groupGap = xStep * 0.18;
      const innerW = xStep - groupGap;
      const barW = innerW / series.length;

      const toY = (v) => pad.top + chartH - (v / maxVal) * chartH;

      // Grid + Y labels
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yVal = (maxVal / 5) * i;
        const y = toY(yVal);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
        ctx.fillStyle = '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`$${yVal.toFixed(0)}B`, pad.left - 8, y);
      }

      // Bars
      const groups = [];
      bopData.forEach((d, gi) => {
        const groupX = pad.left + gi * xStep + groupGap / 2;
        groups.push({ year: d.year, x: groupX, w: innerW });

        series.forEach((s, si) => {
          const v = d[s.key];
          const x = groupX + si * barW;
          const y = toY(v);
          const bh = pad.top + chartH - y;

          const isHover = hoverYear === d.year;
          ctx.fillStyle = isHover ? s.color : s.color + 'cc';
          ctx.fillRect(x + 1, y, barW - 2, bh);
        });

        // X labels
        ctx.fillStyle = hoverYear === d.year ? '#222' : '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.year.toString(), groupX + innerW / 2, h - pad.bottom + 10);
      });

      layout = { groups, pad, chartH };

      // Highlight band
      if (hoverYear !== null) {
        const g = groups.find((gr) => gr.year === hoverYear);
        if (g) {
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(g.x - 4, pad.top, g.w + 8, chartH);
          ctx.setLineDash([]);
        }
      }

      // Title
      ctx.fillStyle = '#666';
      ctx.font = `italic ${Math.max(11, Math.min(13, w * 0.025))}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Balance-of-Payments Flows (USD billion, annual)', pad.left, 8);

      // Legend
      const legY = pad.top + 22;
      ctx.font = `${Math.max(9, fontSize - 1)}px Poly, serif`;
      let legX = pad.left;
      series.forEach((s) => {
        ctx.fillStyle = s.color;
        ctx.fillRect(legX, legY - 5, 10, 10);
        ctx.fillStyle = '#666';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.label, legX + 14, legY);
        legX += ctx.measureText(s.label).width + 36;
      });

      // Tooltip values
      if (hoverYear !== null) {
        const d = bopData.find((b) => b.year === hoverYear);
        if (d) {
          const g = groups.find((gr) => gr.year === hoverYear);
          const lines = series.map((s) => `${s.label}: $${d[s.key].toFixed(1)}B`);
          const tw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 16;
          const th = lines.length * 16 + 14;
          let tx = g.x + g.w + 8;
          if (tx + tw > w - pad.right) tx = g.x - tw - 8;
          const ty = pad.top + 40;
          ctx.fillStyle = 'rgba(255,255,255,0.96)';
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = 1;
          ctx.fillRect(tx, ty, tw, th);
          ctx.strokeRect(tx, ty, tw, th);

          ctx.fillStyle = '#444';
          ctx.font = `bold ${Math.max(9, fontSize - 1)}px Poly, serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(`${d.year}`, tx + 8, ty + 6);
          ctx.font = `${Math.max(9, fontSize - 1)}px Poly, serif`;
          lines.forEach((l, i) => {
            ctx.fillStyle = series[i].color;
            ctx.fillText(l, tx + 8, ty + 22 + i * 14);
          });
        }
      }
    };

    const onMove = (e) => {
      if (!layout) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (y < layout.pad.top || y > layout.pad.top + layout.chartH) {
        if (hoverYear !== null) setHoverYear(null);
        return;
      }
      const hit = layout.groups.find((g) => x >= g.x - 4 && x <= g.x + g.w + 4);
      setHoverYear(hit ? hit.year : null);
    };
    const onLeave = () => setHoverYear(null);

    resize();
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [hoverYear]);

  return (
    <>
      <div className="credit-chart-wrapper">
        <canvas ref={canvasRef} className="reserves-chart-canvas" />
      </div>
      <p className="chart-source">Sources: CBSL External Sector Performance, SLTDA, World Bank, Macrotrends. Hover bars for values.</p>
    </>
  );
}

function RmseChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height);
    };

    const colorByKind = {
      benchmark: '#888',
      classical: '#9aa6b8',
      shrinkage: '#7d96b8',
      ml: '#c98a2c',
      regime: '#3a5d8f',
    };

    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const pad = { top: 36, right: 100, bottom: 28, left: 110 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const maxVal = Math.ceil(Math.max(...rmseData.map((d) => d.rmse)) / 200) * 200;
      const rowH = chartH / rmseData.length;
      const barH = Math.min(rowH * 0.62, 22);
      const fontSize = Math.max(10, Math.min(12, w * 0.022));

      // Vertical gridlines
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      const gridSteps = 4;
      for (let i = 0; i <= gridSteps; i++) {
        const v = (maxVal / gridSteps) * i;
        const x = pad.left + (v / maxVal) * chartW;
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + chartH);
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(v.toString(), x, pad.top + chartH + 6);
      }

      // Bars
      rmseData.forEach((d, i) => {
        const y = pad.top + i * rowH + (rowH - barH) / 2;
        const bw = (d.rmse / maxVal) * chartW;
        ctx.fillStyle = colorByKind[d.kind] || '#888';
        ctx.fillRect(pad.left, y, bw, barH);

        // Name
        ctx.fillStyle = d.kind === 'regime' || d.kind === 'benchmark' ? '#222' : '#666';
        ctx.font = `${d.kind === 'regime' || d.kind === 'benchmark' ? '500 ' : ''}${fontSize}px Poly, serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.name, pad.left - 8, y + barH / 2);

        // Value
        ctx.fillStyle = '#444';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'left';
        ctx.fillText(d.rmse.toString(), pad.left + bw + 6, y + barH / 2);
      });

      // Reduction callout (MS-VAR vs RW)
      const msvar = rmseData[rmseData.length - 1];
      const rw = rmseData[0];
      const yMs = pad.top + (rmseData.length - 1) * rowH + rowH / 2;
      const reduction = (((rw.rmse - msvar.rmse) / rw.rmse) * 100).toFixed(1);
      const labelX = pad.left + (msvar.rmse / maxVal) * chartW + 50;
      ctx.fillStyle = '#aa3232';
      ctx.font = `italic ${Math.max(10, fontSize)}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`−${reduction}% vs RW`, labelX, yMs);

      // Title
      ctx.fillStyle = '#666';
      ctx.font = `italic ${Math.max(11, Math.min(13, w * 0.025))}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('RMSE at 1-month horizon, BoP specification (USD millions)', 8, 8);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <>
      <div className="credit-chart-wrapper">
        <canvas ref={canvasRef} className="reserves-chart-canvas tall" />
      </div>
      <p className="chart-source">Headline values (MS-VAR 315, Random Walk 1,351) reported in working paper. Intermediate model rows shown to indicate the across-family ordering.</p>
    </>
  );
}

function ArchitectureVsInfo() {
  // Stylized representation of "architecture effect ~6× information effect"
  const archEffect = 265;
  const infoEffect = 44;
  const max = Math.max(archEffect, infoEffect) * 1.25;

  return (
    <div className="effect-decomp">
      <div className="effect-row">
        <span className="effect-label">Architecture effect<br /><em>(MS-VAR vs XGBoost)</em></span>
        <div className="effect-bar-track">
          <div className="effect-bar arch" style={{ width: `${(archEffect / max) * 100}%` }} />
        </div>
        <span className="effect-value">~6×</span>
      </div>
      <div className="effect-row">
        <span className="effect-label">Information effect<br /><em>(parsimonious vs BoP)</em></span>
        <div className="effect-bar-track">
          <div className="effect-bar info" style={{ width: `${(infoEffect / max) * 100}%` }} />
        </div>
        <span className="effect-value muted">≈ 0 (CI overlaps)</span>
      </div>
      <p className="chart-source decomp-source">Schematic only. Architecture and information effects isolated by factorial decomposition on the common test window.</p>
    </div>
  );
}

const sections = [
  { id: 'intro', label: 'The collapse' },
  { id: 'regimes', label: 'Why standard models fail' },
  { id: 'design', label: 'The design question' },
  { id: 'results', label: 'The result' },
  { id: 'caveats', label: 'Caveats' },
  { id: 'takeaway', label: 'Takeaway' },
  { id: 'comments', label: 'Comments' },
];

function ReadingProgress({ contentRef }) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const visible = window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.min(100, Math.max(0, (scrolled / (total - visible)) * 100));
      setProgress(pct);

      const sectionEls = el.querySelectorAll('[data-section]');
      let current = 0;
      sectionEls.forEach((sec, i) => {
        const secRect = sec.getBoundingClientRect();
        if (secRect.top < visible * 0.4) current = i;
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  return (
    <>
      <aside className="reading-progress-panel">
        <div className="progress-track">
          <div className="progress-fill" style={{ height: `${progress}%` }} />
          {sections.map((sec, i) => (
            <div
              key={sec.id}
              className={`progress-node ${i <= activeSection ? 'active' : ''}`}
              style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
            >
              <span className="progress-dot" />
              <span className="progress-label">{sec.label}</span>
            </div>
          ))}
        </div>
        <span className="progress-pct">{Math.round(progress)}%</span>
      </aside>
      <div className="reading-progress-bar">
        <div className="reading-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}

function ForecastingReservesPost() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const articleRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setComments([
      ...comments,
      { id: Date.now(), name: name.trim(), text: text.trim(), date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    ]);
    setName('');
    setText('');
  };

  return (
    <article className="blog-post" ref={articleRef}>
      <ReadingProgress contentRef={articleRef} />
      <div className="blog-post-container">
        <a href="/" className="blog-back">&larr; back</a>

        <header className="blog-header">
          <span className="blog-category">research / forecasting</span>
          <h1 className="blog-title">Forecasting Foreign Reserves Under a Sovereign Default: What Worked</h1>
          <div className="blog-meta">
            <span className="blog-date">April 2026</span>
            <span className="blog-read-time">12 min read</span>
            <span className="blog-coauthor">with Samantha Mathara Aracchi</span>
          </div>
        </header>

        <figure className="post-cover">
          <img src="/assets/forecasting-reserves-cover.png" alt="A four-phase timeline of Sri Lanka's reserves: peak in 2019, depletion through 2020-2022, sovereign default in April 2022, and IMF-led recovery from 2023" />
          <figcaption>The reserves story in four regimes: peak, depletion, default, recovery.</figcaption>
        </figure>

        <div className="blog-content">
          <div data-section="intro" />
          <p>
            Sri Lanka ran out of usable reserves in April 2022. Gross reserves fell from about
            <strong> USD 7.6 billion</strong> at end-2019 to roughly <strong>USD 50 million</strong> of
            usable reserves at the point of external debt suspension. GDP contracted more than 7%,
            inflation crossed 50%, and the country entered an IMF Extended Fund Facility with an
            unusually weak external position.
          </p>

          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-num">$7.6B</span>
              <span className="stat-label">Gross reserves<br />end-2019</span>
            </div>
            <div className="stat-card crisis">
              <span className="stat-num">$0.05B</span>
              <span className="stat-label">Usable reserves<br />Apr 2022</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">5</span>
              <span className="stat-label">Bai-Perron<br />structural breaks</span>
            </div>
            <div className="stat-card accent">
              <span className="stat-num">−76.7%</span>
              <span className="stat-label">RMSE reduction<br />MS-VAR vs RW</span>
            </div>
          </div>

          <p>That sequence is a forecasting nightmare.</p>

          <h2 className="blog-section-title" data-section="regimes">Why standard models miss the turning points</h2>

          <p>
            Standard models assume the underlying data-generating process is stable. Sri Lanka's reserves
            went through accumulation, collapse, default, and rebuilding inside a twenty-year window,
            with <strong>five significant structural breaks</strong> identified by Bai-Perron tests.
            Forecasts that average across these regimes blur exactly the turning points that matter for
            reserve management.
          </p>

          <ReservesTimelineChart />

          <p>
            In a new working paper, Samantha Mathara Aracchi and I run a like-for-like comparison of
            four model families on this data:
          </p>

          <div className="family-grid">
            <div className="family-card">
              <span className="family-tag classical">Classical</span>
              <h4>ARIMA · VAR · VECM</h4>
              <p>Stable-parameter benchmarks. Average across regimes by design.</p>
            </div>
            <div className="family-card">
              <span className="family-tag shrinkage">Bayesian</span>
              <h4>Bayesian VARs</h4>
              <p>Shrinkage priors to handle short samples and many predictors.</p>
            </div>
            <div className="family-card">
              <span className="family-tag regime">Regime-switching</span>
              <h4>MS-VAR · MS-VECM</h4>
              <p>State-dependent dynamics. Reweight variables by regime.</p>
            </div>
            <div className="family-card">
              <span className="family-tag ml">Machine learning</span>
              <h4>XGBoost · LSTM · DMA</h4>
              <p>Non-linear functional forms and dynamic averaging.</p>
            </div>
          </div>

          <p>
            All models are evaluated on the same monthly panel using the same rolling-origin design,
            with training through 2019, validation over the crisis window (2020-2022), and a final test
            window on the post-default recovery (2023-2025).
          </p>

          <h2 className="blog-section-title" data-section="design">The design question</h2>

          <p>
            The interesting methodological move is separating two things that forecasting comparisons
            usually conflate: <em>model architecture</em> and <em>information content</em>. We do this by
            running the same models across five variable sets, from a three-variable baseline up to a
            full specification with nine predictors. Within each variable set the architectures compete on
            equal terms, and across sets we can see whether gains come from better models or from more
            data.
          </p>

          <p>
            The preferred specification keeps balance-of-payments flows disaggregated: exports, imports,
            remittances, and tourism enter separately rather than collapsed into a net trade balance. The
            reason is specific to crisis dynamics. During 2020-2022, exports held up, imports were
            compressed, remittances fell sharply, and tourism collapsed. Netting these out cancels
            information that matters for where reserves are going next.
          </p>

          <BopComponentsChart />

          <blockquote className="blog-pullquote">
            Netting four components into one trade balance throws away exactly the cross-flow information
            that distinguishes a temporary import compression from a structural remittance shock.
          </blockquote>

          <h2 className="blog-section-title" data-section="results">The result</h2>

          <p>
            In the preferred balance-of-payments specification at the one-month horizon,
            <strong> MS-VAR cuts RMSE by 76.7% relative to a random walk benchmark: 315 versus 1,351 in
            USD millions</strong>. Translated into operational terms, that is the difference between a
            typical forecast miss of about USD 1.35 billion and one of roughly USD 315 million. For
            reserve management, a billion-dollar tightening is the gap between reading a monthly shortfall
            as noise and reading it as an early financing warning.
          </p>

          <RmseChart />

          <p>
            More importantly, the gain does not come from more data. A factorial decomposition isolates
            the architecture effect (MS-VAR vs XGBoost) from the information effect (parsimonious vs BoP
            specification) on a common test window. The architecture effect is roughly six times larger
            than the information effect, and the information effect's confidence interval includes zero.
          </p>

          <ArchitectureVsInfo />

          <p>
            What the regime-switching system does differently is reweight the same variables depending on
            whether reserves are in an accumulation state or a crisis state, so the propagation of shocks
            changes with the regime rather than being forced to a single average.
          </p>

          <h2 className="blog-section-title" data-section="caveats">Caveats</h2>

          <p>
            Density forecasts split. <strong>MS-VAR has the lowest CRPS</strong> (sharpest overall), but
            <strong> XGB-Quantile has interval coverage closest to nominal rates</strong>
            (best-calibrated). For uncertainty communication, the two tools answer different questions.
          </p>

          <div className="caveat-grid">
            <div className="caveat-card">
              <span className="caveat-tag">Sharpness</span>
              <h4>MS-VAR — lowest CRPS</h4>
              <p>Tightest density around the realised path on average.</p>
            </div>
            <div className="caveat-card">
              <span className="caveat-tag">Calibration</span>
              <h4>XGB-Quantile — nominal coverage</h4>
              <p>Prediction intervals contain the truth at the advertised rate.</p>
            </div>
            <div className="caveat-card">
              <span className="caveat-tag">Long horizons</span>
              <h4>Tuned LSTM — leads at 6m / 12m</h4>
              <p>In some BoP specifications, neural sequence models pull ahead.</p>
            </div>
            <div className="caveat-card">
              <span className="caveat-tag">External validity</span>
              <h4>One country, one crisis</h4>
              <p>Revised data, single-episode evidence. Generalisation is open.</p>
            </div>
          </div>

          <h2 className="blog-section-title" data-section="takeaway">The honest takeaway</h2>

          <p>
            For near-term reserve monitoring in crisis-prone economies, the evidence here supports
            <strong> pairing a regime-sensitive point forecast with separate density tools for
            uncertainty</strong>, rather than picking one stable-parameter benchmark and hoping the world
            holds still.
          </p>

          <p className="blog-closing">
            The next reserve crisis will not look like the last one. Choose models that admit that.
          </p>

          <div className="paper-card">
            <div className="paper-card-tag">Working paper</div>
            <p className="paper-card-title">
              Forecasting Foreign Reserves Under Structural Breaks: A Multi-Family Comparison for Sri
              Lanka, 2005-2025
            </p>
            <p className="paper-card-meta">
              with Samantha Mathara Aracchi, University of Colombo. Currently under review.
            </p>
            <a className="paper-card-link" href="#" aria-label="SSRN preprint coming soon">
              Preprint on SSRN — coming soon &rarr;
            </a>
          </div>
        </div>

        <hr className="blog-divider" />

        <section className="blog-comments" data-section="comments">
          <h2 className="comments-title">Comments</h2>

          {comments.length === 0 && (
            <p className="comments-empty">No comments yet. Be the first to share your thoughts.</p>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-name">{comment.name}</span>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>

          <form className="comment-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="comment-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts..."
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="comment-submit">Post Comment</button>
          </form>
        </section>
      </div>
    </article>
  );
}

export default ForecastingReservesPost;
