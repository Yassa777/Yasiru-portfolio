import { useState, useRef, useEffect } from 'react';
import './BlogPost.css';

// Annual change in credit to private sector (LKR Bn)
// Sources: CBSL Annual Reports, EconomyNext, MacroColombo, DailyFT
// 2017: 14.7% YoY growth (IMF), outstanding ~4,810Bn → change ~615Bn
// 2018: Outstanding 5,561Bn (DailyFT) → change ~751Bn
// 2019: Growth slowed to ~4.3% (CBSL) → ~239Bn
// 2020: Moderate growth amid COVID moratoria → ~377Bn
// 2021: +810Bn (EconomyNext)
// 2022: 6.2% expansion (The Morning) on ~6,987Bn base → ~433Bn
// 2023: -47.7Bn contraction (EconomyNext)
// 2024: +789.6Bn (EconomyNext)
// 2025: +2,100Bn, highest on record since 1996 (MacroColombo)
const creditData = [
  { year: '2017', value: 615 },
  { year: '2018', value: 751 },
  { year: '2019', value: 239 },
  { year: '2020', value: 377 },
  { year: '2021', value: 810 },
  { year: '2022', value: 433 },
  { year: '2023', value: -48 },
  { year: '2024', value: 790 },
  { year: '2025', value: 2100 },
];

// CEFTS share of interbank retail transactions (%)
// Sources: CBSL Information Series Note (Feb 2025), CBSL Payments Bulletin Q4 2024
// 2018: 8% (CBSL), 2024: 67% (CBSL), 203M transactions worth Rs 17T (CBSL)
// Intermediate years estimated from CBSL annual reports and COVID-era acceleration
const ceftsData = [
  { year: '2016', volume: 2.1, value: 0.15 },
  { year: '2017', volume: 5.8, value: 0.42 },
  { year: '2018', volume: 12.5, value: 0.95 },
  { year: '2019', volume: 22, value: 1.8 },
  { year: '2020', volume: 45, value: 3.6 },
  { year: '2021', volume: 78, value: 6.2 },
  { year: '2022', volume: 115, value: 9.1 },
  { year: '2023', volume: 158, value: 13.2 },
  { year: '2024', volume: 203, value: 17.0 },
];

// CSE Average Daily Turnover (Rs Mn)
// Sources: CSE Annual Reports 2020/2021/2023, CEIC, EconomyNext, Xinhua
// 2017: 915 (CEIC database)
// 2018: ~850 (derived from CSE Annual Report 2020 comparative data)
// 2019: ~713 (derived: Rs 171.1Bn annual turnover / ~240 trading days, CSE AR 2020)
// 2020: 1,899 (CSE Annual Report 2020, "157% increase")
// 2021: 4,888 (CSE Annual Report 2021)
// 2022: ~1,500 (crisis year, shortened trading hours from Apr 2022, estimated from CSE AR 2023)
// 2023: 1,699 (CSE, referenced in multiple sources comparing to 2024)
// 2024: 2,233 (CSE, confirmed from multiple news sources)
// 2025: ~5,200 (average for full year; daily turnover Rs 6.27Bn by Sept 2025 per Xinhua)
const cseTurnoverData = [
  { year: '2017', value: 915 },
  { year: '2018', value: 850 },
  { year: '2019', value: 713 },
  { year: '2020', value: 1899 },
  { year: '2021', value: 4888 },
  { year: '2022', value: 1500 },
  { year: '2023', value: 1699 },
  { year: '2024', value: 2233 },
  { year: '2025', value: 5200 },
];

function CseTurnoverChart() {
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
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height);
    };

    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const pad = { top: 30, right: 20, bottom: 50, left: 65 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const values = cseTurnoverData.map((d) => d.value);
      const maxVal = Math.max(...values) * 1.12;

      const xStep = chartW / (cseTurnoverData.length - 1);
      const toX = (i) => pad.left + i * xStep;
      const toY = (v) => pad.top + chartH - (v / maxVal) * chartH;

      const fontSize = Math.max(10, Math.min(12, w * 0.025));

      // Grid lines + Y labels
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      const gridSteps = 5;
      for (let i = 0; i <= gridSteps; i++) {
        const yVal = (maxVal / gridSteps) * i;
        const y = toY(yVal);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const label = yVal >= 1000 ? `${(yVal / 1000).toFixed(1)}Bn` : `${Math.round(yVal)}Mn`;
        ctx.fillText(label, pad.left - 8, y);
      }

      // Area fill
      ctx.beginPath();
      cseTurnoverData.forEach((d, i) => {
        const x = toX(i);
        const y = toY(d.value);
        if (i === 0) {
          ctx.moveTo(x, pad.top + chartH);
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.lineTo(toX(cseTurnoverData.length - 1), pad.top + chartH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, 'rgba(184, 150, 62, 0.25)');
      grad.addColorStop(1, 'rgba(184, 150, 62, 0.02)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.strokeStyle = '#b8963e';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      cseTurnoverData.forEach((d, i) => {
        const x = toX(i);
        const y = toY(d.value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots + X labels
      cseTurnoverData.forEach((d, i) => {
        const x = toX(i);
        const y = toY(d.value);

        ctx.fillStyle = '#b8963e';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Value label on peak years
        if (d.value === Math.max(...values) || d.year === '2021') {
          ctx.fillStyle = '#666';
          ctx.font = `${Math.max(9, fontSize - 1)}px Poly, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const valStr = d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}Bn` : `${d.value}Mn`;
          ctx.fillText(valStr, x, y - 8);
        }

        ctx.fillStyle = '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.year, x, h - pad.bottom + 10);
      });

      // Title
      ctx.fillStyle = '#666';
      ctx.font = `italic ${Math.max(11, Math.min(13, w * 0.028))}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('CSE Average Daily Turnover (Rs)', pad.left, 6);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="credit-chart-wrapper">
      <canvas ref={canvasRef} className="credit-chart-canvas" />
      <p className="chart-source">Sources: CSE Annual Reports (2020, 2021, 2023), CEIC, EconomyNext, Xinhua. 2018, 2022 estimated from CSE comparative data.</p>
    </div>
  );
}

function CreditChart() {
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
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height);
    };

    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const pad = { top: 30, right: 20, bottom: 50, left: 60 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const values = creditData.map((d) => d.value);
      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);
      const range = maxVal - minVal;
      const yMin = minVal - range * 0.1;
      const yMax = maxVal + range * 0.1;

      const xStep = chartW / (creditData.length - 1);
      const toX = (i) => pad.left + i * xStep;
      const toY = (v) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

      // Grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      const gridSteps = 5;
      for (let i = 0; i <= gridSteps; i++) {
        const yVal = yMin + ((yMax - yMin) / gridSteps) * i;
        const y = toY(yVal);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();

        // Y-axis labels
        ctx.fillStyle = '#999';
        ctx.font = `${Math.max(10, Math.min(12, w * 0.025))}px Poly, serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(yVal)}B`, pad.left - 8, y);
      }

      // Zero line
      if (yMin < 0 && yMax > 0) {
        const zeroY = toY(0);
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pad.left, zeroY);
        ctx.lineTo(w - pad.right, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Bars
      const barWidth = Math.min(xStep * 0.5, 40);
      creditData.forEach((d, i) => {
        const x = toX(i);
        const zeroY = toY(0);
        const valY = toY(d.value);

        const isNeg = d.value < 0;
        ctx.fillStyle = isNeg ? 'rgba(180, 60, 60, 0.7)' : 'rgba(184, 150, 62, 0.65)';

        if (isNeg) {
          ctx.fillRect(x - barWidth / 2, zeroY, barWidth, valY - zeroY);
        } else {
          ctx.fillRect(x - barWidth / 2, valY, barWidth, zeroY - valY);
        }

        // X-axis labels
        ctx.fillStyle = '#999';
        ctx.font = `${Math.max(10, Math.min(12, w * 0.025))}px Poly, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.year, x, h - pad.bottom + 10);
      });

      // Line
      ctx.strokeStyle = 'var(--color-gold)';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      creditData.forEach((d, i) => {
        const x = toX(i);
        const y = toY(d.value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots
      creditData.forEach((d, i) => {
        const x = toX(i);
        const y = toY(d.value);
        ctx.fillStyle = d.value < 0 ? 'rgba(180, 60, 60, 0.9)' : '#b8963e';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Title
      ctx.fillStyle = '#666';
      ctx.font = `italic ${Math.max(11, Math.min(13, w * 0.028))}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Annual Net Credit to Private Sector (LKR Bn)', pad.left, 6);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="credit-chart-wrapper">
      <canvas ref={canvasRef} className="credit-chart-canvas" />
      <p className="chart-source">Sources: CBSL Annual Reports, EconomyNext, MacroColombo. 2017-2020 derived from CBSL growth rates and IMF data.</p>
    </div>
  );
}

function CeftsChart() {
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
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height);
    };

    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const pad = { top: 30, right: 55, bottom: 50, left: 60 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const volumes = ceftsData.map((d) => d.volume);
      const values = ceftsData.map((d) => d.value);
      const maxVol = Math.max(...volumes) * 1.15;
      const maxVal = Math.max(...values) * 1.15;

      const xStep = chartW / (ceftsData.length - 1);
      const toX = (i) => pad.left + i * xStep;
      const toYVol = (v) => pad.top + chartH - (v / maxVol) * chartH;
      const toYVal = (v) => pad.top + chartH - (v / maxVal) * chartH;

      // Grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      const fontSize = Math.max(10, Math.min(12, w * 0.025));
      for (let i = 0; i <= 5; i++) {
        const y = pad.top + (chartH / 5) * (5 - i);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();

        // Left axis (volume)
        ctx.fillStyle = 'rgba(184, 150, 62, 0.8)';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const volLabel = Math.round((maxVol / 5) * i);
        ctx.fillText(`${volLabel}M`, pad.left - 8, y);

        // Right axis (value)
        ctx.fillStyle = 'rgba(100, 150, 180, 0.8)';
        ctx.textAlign = 'left';
        const valLabel = ((maxVal / 5) * i).toFixed(1);
        ctx.fillText(`${valLabel}T`, w - pad.right + 8, y);
      }

      // Bars (volume)
      const barWidth = Math.min(xStep * 0.45, 35);
      ceftsData.forEach((d, i) => {
        const x = toX(i);
        const barH = (d.volume / maxVol) * chartH;
        ctx.fillStyle = 'rgba(184, 150, 62, 0.5)';
        ctx.fillRect(x - barWidth / 2, pad.top + chartH - barH, barWidth, barH);

        // X labels
        ctx.fillStyle = '#999';
        ctx.font = `${fontSize}px Poly, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(d.year, x, h - pad.bottom + 10);
      });

      // Line (value)
      ctx.strokeStyle = 'rgba(100, 150, 180, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ceftsData.forEach((d, i) => {
        const x = toX(i);
        const y = toYVal(d.value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots
      ceftsData.forEach((d, i) => {
        const x = toX(i);
        const y = toYVal(d.value);
        ctx.fillStyle = 'rgba(100, 150, 180, 1)';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Title
      ctx.fillStyle = '#666';
      ctx.font = `italic ${Math.max(11, Math.min(13, w * 0.028))}px Poly, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('CEFTS Transactions: Volume (bars) & Value (line)', pad.left, 6);

      // Legend
      const legY = h - 14;
      const legFontSize = Math.max(9, Math.min(11, w * 0.022));
      ctx.font = `${legFontSize}px Poly, serif`;

      ctx.fillStyle = 'rgba(184, 150, 62, 0.5)';
      ctx.fillRect(pad.left, legY - 5, 12, 10);
      ctx.fillStyle = '#999';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Volume (millions)', pad.left + 16, legY);

      const lineX = pad.left + 120;
      ctx.strokeStyle = 'rgba(100, 150, 180, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lineX, legY);
      ctx.lineTo(lineX + 12, legY);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.fillText('Value (LKR trillions)', lineX + 16, legY);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="credit-chart-wrapper">
      <canvas ref={canvasRef} className="credit-chart-canvas" />
      <p className="chart-source">Sources: CBSL Payments Bulletin Q4 2024, CBSL Information Series Note (Feb 2025). 2024 endpoints confirmed: 203M transactions, Rs 17T value. Intermediate years estimated from CBSL annual reports.</p>
    </div>
  );
}

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'credit-cycle', label: 'The Credit Cycle' },
  { id: 'formalization', label: 'Formalization' },
  { id: 'npls', label: 'NPLs' },
  { id: 'valuation', label: 'Valuation & Liquidity' },
  { id: 'conclusion', label: 'Conclusion' },
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

      // Determine active section
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
      {/* Desktop side panel */}
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

      {/* Mobile top bar */}
      <div className="reading-progress-bar">
        <div className="reading-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}

function BlogPost() {
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
          <span className="blog-category">macroeconomics</span>
          <h1 className="blog-title">The Sri Lankan Banking Thesis: A Closer Look</h1>
          <div className="blog-meta">
            <span className="blog-date">March 2026</span>
            <span className="blog-read-time">18 min read</span>
          </div>
        </header>

        <div className="blog-content">
          <div data-section="intro" />
          <p>
            A thesis has been making the rounds. You've probably encountered some version of it whether
            in a group chat or at a dinner table where someone's uncle just opened a CDS account. I
            first saw it on Bhanuka Harischandra's Instagram story (<a href="https://instagram.com/bhanoob" target="_blank" rel="noopener noreferrer">@Bhanoob</a>) that
            goes something like this: the banking sector sits at the chokepoint of the entire economy,
            credit is expanding at historic rates, banks are trading at absurdly low multiples, the
            economy is still overwhelmingly cash-based, and therefore the next decade belongs to anyone
            patient enough to buy and hold HNB and COMB on the Colombo Stock Exchange. Zero capital
            gains tax. Compounding credit growth. Doubling every 3 years. We're so early.
          </p>

          <div className="blog-images">
            <figure className="blog-figure">
              <img
                src="/assets/bhanoob-hnb-comb.PNG"
                alt="Bhanuka Harischandra's Instagram story showing HNB and COMB stock charts with annotations about 5-6x trailing earnings, 20-30% future growth, and cash economy thesis"
                loading="lazy"
              />
              <figcaption>HNB & COMB charts via @Bhanoob on Instagram</figcaption>
            </figure>
            <figure className="blog-figure">
              <img
                src="/assets/bhanoob-banking-thesis.PNG"
                alt="Bhanuka Harischandra's Instagram story about Sri Lanka's banking sector investment thesis with credit cycle chart"
                loading="lazy"
              />
              <figcaption>The banking thesis in @Bhanoob's own words</figcaption>
            </figure>
          </div>

          <p>That is a really seductive story. Parts of it are genuinely compelling. But it deserves more than a bar chart and a hot take. 
            So we’ll take apart the actual data, stress test assumptions and give an honest accounting of the risks that nobody in the Sri Lankan investing community seems to want to talk about. 
            Let’s do it. 
          </p>

          <h2 className="blog-section-title" data-section="credit-cycle">The Credit Cycle: What the Numbers Actually Show</h2>

          <p>
            Net credit to the private sector collapsed to negative 48 billion LKR in 2023 — the
            aftermath of the worst economic crisis in the country's post-independence history. By 2024
            it rebounded to 790 billion. By 2025 it surged past 2 trillion.
          </p>

          <CreditChart />

          <p>
            That's not a gentle recovery but a violent shift in the credit cycle. The underlying
            mechanics are pretty straightforward. The Central Bank Of Sri Lanka (CBSL) cut policy rates
            down from the crisis peak of 16.5% (SLFR) in early 2023 to the current Overnight Policy
            Rate of 7.75% (CBSL shifted from using a corridor system with two policy rates to using a
            single policy rate system). Which means cheaper borrowing. More borrowing means more
            economic activity channeled through bank balance sheets. The credit multiplier is doing
            exactly what the textbooks say it should be doing.
          </p>

          <blockquote className="blog-pullquote">
            The question isn't whether the credit cycle has turned. The question is whether what we're
            seeing is a genuine expansion of the banking sector or a rubber band snapping back.
          </blockquote>

          <p>
            But the question isn't whether the credit cycle has turned because it obviously has. The
            question is whether what we're seeing is a genuine expansion of the banking sector or a
            rubber band snapping back.
          </p>

          <p>
            Much of the current surge is mechanically explained by pent-up demand where the inverse of
            what happened in 2023 is happening — businesses are back to borrowing and drawing down
            deferred credit lines, vehicle imports resuming and construction activity back in full
            swing. The trend lines look spectacular. But whether it sustains depends on three things we
            don't have clean answers to yet:
          </p>

          <ul className="blog-questions">
            <li>Is new lending flowing into productive investment or consumption?</li>
            <li>Can deposit growth keep pace with credit expansion?</li>
            <li>Is the credit-to-GDP ratio returning to trend or overshooting it?</li>
          </ul>

          <p>We'll come back to these. For now, just hold them.</p>

          <h2 className="blog-section-title" data-section="formalization">The Formalization Thesis: What "90% Cash" Actually Means</h2>

          <p>
            The most provocative claim in the bull case is that roughly 90% of Sri Lanka's economy is
            still cash-based, and that as formalization happens, banks will passively capture an enormous
            wave of economic activity moving from informal to formal channels. It's the part of the
            thesis that makes people's eyes go wide. It's also the part that deserves the most scrutiny.
          </p>

          <p>
            Because there are actually two different claims hiding inside "90% cash," and they have very
            different implications for anyone buying bank stocks.
          </p>

          <p>
            The first is about transaction volume. Most daily transactions in Sri Lanka still happen in
            physical currency. Your grandmother buying vegetables at the {'\u0DC0\u0DD9\u0DC5\u0DAF\u0DB4\u0DDC\u0DC5'}. A three-wheeler
            fare paid in coins. A mason collecting his daily wage in a brown envelope. By sheer count,
            this is still broadly true. Though it's eroding faster than most people realize.
          </p>

          <p>
            The second is about economic value. The idea that most of the economy's output sits outside
            the banking system, untouched and waiting to be captured. This is the claim that actually
            matters for the investment thesis. And it's much harder to defend.
          </p>

          <p>
            Sri Lanka's formal economy already flows through bank balance sheets. The apparel exporters,
            the telecom companies, large-scale retail, the government wage bill, the banking sector
            itself. All of that is banked. The informal economy, by most credible estimates, accounts for
            roughly 36% of GDP. Significant? Absolutely. But it's not 90%. And when you're trying to
            size the addressable market for bank earnings growth, that distinction changes the entire
            calculus.
          </p>

          <p>
            Now here's the part nobody in the bull case wants to reckon with. The sectors that make up
            that 36% are precisely the sectors that are hardest to formalize. Smallholder agriculture.
            Petty trade. Informal construction labor. Domestic workers. These aren't industries waiting
            for a digital payment link to magically enter the banking system. The barriers are
            structural, not technological. Going formal means becoming visible to the tax authority. It
            means documentation requirements that exclude the least sophisticated participants. It means
            overcoming generational habits around cash that run deep, especially outside the Western
            Province.
          </p>

          <p>
            And the easy wins? They've mostly already happened. Most tuk-tuks in Colombo run on PickMe
            or Uber now. Construction in the city already moves through invoices and bank transfers. The
            low-hanging fruit has been picked. What remains is the harder stuff.
          </p>

          <blockquote className="blog-pullquote">
            The informal economy accounts for roughly 36% of GDP. That's significant. But it's not 90%,
            and the distinction changes the entire calculus.
          </blockquote>

          <p>
            All of that said, formalization is happening. And it's happening faster than the skeptics
            would have you believe.
          </p>

          <p>
            The best real-time proxy we have is CEFTS, the Common Electronic Fund Transfer Switch that
            underpins Sri Lanka's digital payment infrastructure. In 2018, CEFTS handled just 8% of
            interbank retail transactions. By 2024, that figure was 67%. In absolute terms, it processed
            203 million transactions worth Rs 17 trillion last year alone. That's more than half of GDP
            flowing through a single digital payment rail.
          </p>

          <CeftsChart />

          <p>
            That's not gentle adoption. That's a structural shift in how money moves through the economy.
            On top of that, LANKAQR is rolling out to small merchants across the country. JustPay keeps
            growing year on year. The government launched GovPay in February 2025 with 16 institutions
            now accepting digital payments. The infrastructure isn't theoretical anymore. It's being laid
            down in real time, and people are using it.
          </p>

          <p>So the question becomes: which version of the future are we actually buying into?</p>

          <p>
            In the bull case, digital payments continue on their current trajectory. LANKAQR becomes as
            ubiquitous among small merchants as QR payments became in India and China. The remaining
            informal economy gradually enters the banking system over the next decade, and banks capture
            this flow almost passively. Every new digital transaction, every small business that opens a
            current account, every wage that shifts from cash envelope to bank transfer shows up as
            incremental revenue in net interest margins and fee income. Formalization alone could add
            meaningful percentage points to bank earnings growth annually, compounding quietly beneath
            the surface.
          </p>

          <p>
            In the base case, formalization continues but eventually plateaus. Urban and semi-urban Sri
            Lanka goes digital. Colombo, Kandy, Galle, the tourist corridor. But rural agriculture, the
            deep informal service economy, and the cash-dependent segments prove sticky. Banks capture
            some of the flow. Enough to support steady growth, but not the transformative wave the thesis
            imagines. The informal share of GDP shrinks from 36% to maybe 25% over a decade. Useful, not
            revolutionary.
          </p>

          <p>
            In the bear case, most of the CEFTS growth curve turns out to be a COVID acceleration story
            layered on top of urban convenience. The structural barriers to deep formalization prove far
            stickier than a transaction volume chart suggests. Digital payment growth flattens out, and
            banks end up competing harder for the same formal economy they already serve.
          </p>

          <p>
            The honest read is that the base case is the most probable outcome. Formalization will
            continue. The infrastructure push, the regulatory momentum, the generational shift toward
            digital literacy all point in that direction. But this is a decade-long compounding story,
            not a catalyst. Anyone buying HNB or COMB on the formalization thesis alone needs to
            understand they're betting on a slow, grinding expansion of the banking sector's addressable
            market. Not a sudden re-rating event.
          </p>

          <p>
            That might be perfectly fine. Slow compounding is how real wealth actually gets built. But
            it's a different pitch from the one on the Instagram story.
          </p>

          <h2 className="blog-section-title" data-section="npls">NPLs: The Residual Risk Nobody Wants to Talk About</h2>

          <p>
            Yet another factor that we need to consider here is Non Performing Loans. For those
            unfamiliar with the term, a non-performing loan is exactly what it sounds like. A borrower
            stopped paying. Specifically, they've missed scheduled payments for 90 days or more. When
            enough borrowers stop paying at the same time, it becomes the banking sector's problem. And
            during Sri Lanka's crisis, it became a very big problem.
          </p>

          <p>
            By mid-2023, the banking sector's NPL ratio had spiked to 13.3%. To put that in context,
            anything above 3% is considered unhealthy. At 13.3%, you're looking at an industry where
            more than one in every eight rupees lent out has gone bad. Businesses defaulting on working
            capital lines. Personal loans souring. Construction projects frozen mid-build with
            half-drawn facilities sitting on bank books. The system came close enough to collapse that
            the IMF had to step in with a $2.9 billion program.
          </p>

          <p>
            The bull case for the banking sector here is making an implicit assumption that NPLs will
            continue declining smoothly from here. Credit where it's due: the recovery has been real.
            COMB brought its Stage 3 impaired loan ratio down to 4.08% by September 2024, from 5.85%
            at the end of 2023. Across the sector, the Stage 3 ratio came down to 12.3% by end of
            2024. Banks have been provisioning aggressively, coverage ratios are improving, and the
            latest numbers out of H1 2025 show an 81% year-on-year jump in net profits driven by lower
            impairment charges and stronger net interest income.
          </p>

          <p>
            So far so good. But the recovery is uneven. While banks like COMB and HNB have cleaned up
            their books meaningfully, sector-level NPLs at 12.3% are still four times what's
            considered healthy. And the pain is concentrated in specific pockets. Tourism sector NPLs
            were sitting around 40% through mid-2024. Transportation was at 30%. These aren't rounding
            errors. They're entire industries where a third to nearly half of all bank lending has gone
            bad, and the restructuring process is still grinding through.
          </p>

          <p>
            More importantly, NPL trajectories in post-crisis economies are rarely linear. They tend
            to have secondary spikes. This is one of the most consistent patterns in emerging market
            banking crises.
          </p>

          <p>
            Greece is the most dramatic example. NPLs peaked not during the initial crisis but years
            after, reaching nearly 49% in 2017. The resolution took over a decade, required
            government-backed securitization schemes, asset management companies, and massive secondary
            market sales. Turkey post-2018, India's twin balance sheet problem through the mid-2010s:
            the pattern repeats. The initial improvement gives way to a second wave before the genuine
            structural recovery takes hold.
          </p>

          <p>
            Now remember those three questions from the credit cycle section. Here's where they start
            to matter. If a meaningful portion of this credit expansion is flowing into consumption
            rather than productive investment, some of those newly originated loans will sour in the
            next downturn. If deposit growth can't keep pace with credit expansion, banks face a
            funding squeeze precisely when they need liquidity to absorb losses. If credit-to-GDP is
            overshooting rather than returning to trend, then the system is building up fragility even
            as the surface numbers look healthy.
          </p>

          <blockquote className="blog-pullquote">
            NPL trajectories in post-crisis economies are rarely linear. They tend to have secondary
            spikes. This is the pattern nobody in the Sri Lankan investing conversation seems to want
            to acknowledge.
          </blockquote>

          <p>
            None of this means the banking sector is heading for another crisis. The IMF program, the
            debt restructuring, and the CBSL's management of the monetary cycle have all been
            competent. But it does mean the path from 12.3% to a healthy sub-3% NPL ratio is likely
            to be longer, bumpier, and less linear than the bull case assumes.
          </p>

          <p>
            For the investor, the implication is specific. A secondary NPL spike doesn't kill the
            thesis. But it changes the timeline and the pain you have to sit through. If you buy HNB
            at 5x earnings and NPLs tick back up, that multiple can compress further before it
            re-rates. The bank will survive. The question is whether you have the patience and the
            stomach to hold through a potential drawdown that could last a year or two before the
            structural recovery reasserts itself.
          </p>

          <h2 className="blog-section-title" data-section="valuation">Is the Low Valuation a Liquidity Artifact?</h2>

          <p>
            When the bull case says "banks are trading at 5-6x earnings, therefore they're cheap,"
            there's an assumption buried in the statement that most people don't examine. The
            assumption is that the market price reflects something. That enough people are looking at
            HNB and COMB, analyzing their fundamentals, weighing the risks, and arriving at a
            consensus that gets expressed through the price. That the low P/E is the market telling
            you these stocks are undervalued.
          </p>

          <p>But what if the market isn't really telling you anything at all?</p>

          <p>
            The Colombo Stock Exchange's average daily turnover in 2025 was Rs. 5.2 billion. That
            sounds reasonable until you convert it. It's roughly $17 million. Per day. Across the
            entire exchange. To put that in perspective, a single mid-cap stock on the NSE in Mumbai
            will do that before lunch on a slow Tuesday. The entire CSE turns over less in a day than
            Apple does in about four seconds.
          </p>

          <p>
            The total market cap of every listed company on the CSE is around $26 billion. That's
            less than the market cap of a mid-tier Indian IT company. Foreign institutional
            participation is negligible and has been consistently net negative. The participant base
            is overwhelmingly domestic retail, with limited institutional or algorithmic presence.
          </p>

          <p>
            Under these conditions, the price of HNB or COMB doesn't represent the market's
            considered view on the future of Sri Lankan banking. It represents whatever the last few
            hundred retail traders happened to do that day. This isn't a market that "thinks." It's a
            market that barely has enough participants to form a coherent opinion.
          </p>

          <CseTurnoverChart />

          <p>So what does this mean for the thesis?</p>

          <p>
            It cuts both ways, and this is the part that makes the trade interesting.
          </p>

          <p>
            On one hand, you can't confidently say banks are "undervalued" just because they trade at
            low multiples. In a liquidity-starved market, low P/Es might simply be the structural
            equilibrium. There aren't enough buyers to bid the price up to where fundamentals might
            justify it. The valuation isn't a signal, it's an absence of signal.
          </p>

          <p>
            On the other hand, if liquidity improves, the re-rating could be far more explosive than
            earnings growth alone would justify. Think about what happens if foreign institutional
            capital starts flowing back in. If domestic institutional investors (the EPF, insurance
            companies, pension funds) increase their equity allocation. If the retail investor base
            broadens as digital brokerage access improves and the CSE's own outreach programs gain
            traction. You'd be getting two things at once: earnings improving from the credit cycle
            and formalization story, and the multiple expanding as more participants enter the market
            and price discovery actually starts to function. Earnings growth plus multiple expansion
            is the double engine that creates outsized returns.
          </p>

          <p>
            The 2025 numbers already hint at this. Average daily turnover jumped from around Rs. 700
            million in early 2024 to Rs. 5.2 billion by year end. The ASPI gained 42% for the year.
            That's not just fundamentals improving. That's liquidity coming back and repricing
            everything.
          </p>

          <blockquote className="blog-pullquote">
            This isn't a market that thinks. It's a market that barely has enough participants to
            form a coherent opinion.
          </blockquote>

          <p>
            But here's the uncomfortable truth. Liquidity is also the thing that can trap you. If
            you're right about the thesis but the market stays illiquid, you might sit on a
            fundamentally sound position for years without being able to exit at a fair price. Or
            worse, if something goes wrong and you need to sell, the bid might not be there. In a
            thin market, the door out is exactly as narrow as the door in.
          </p>

          <h2 className="blog-section-title" data-section="conclusion">So Is This a Good Investment?</h2>

          <p>
            We started with a thesis that was circulating on Instagram stories and dinner tables.
            Banks sit at the chokepoint. Credit is exploding. The economy is 90% cash. Buy HNB and
            COMB, hold for a decade, get rich. We've spent the last several thousand words pulling
            that thesis apart. Now it's time to put it back together and see what's actually left
            standing.
          </p>

          <p>Let's start with those three questions from the credit cycle section.</p>

          <p>
            <strong>Is new lending flowing into productive investment or consumption?</strong> The
            honest answer is both, and we don't have great data on the split. Construction activity
            is back, vehicle imports have resumed, and businesses are drawing down deferred credit
            lines. Some of that is productive. Some of it is catch-up consumption that will
            normalize. The first wave of credit growth is almost certainly a rubber band effect. What
            matters is what happens after the snap-back settles, probably late 2026 into 2027, when
            the base effects wear off and we find out whether the credit cycle has genuine structural
            momentum or whether it was just filling a hole.
          </p>

          <p>
            <strong>Can deposit growth keep pace with credit expansion?</strong> This is the one to
            watch most closely. The BCG banking sector data already flags weak deposit growth and
            falling credit-to-deposit ratios as a concern, particularly among government banks. If
            credit keeps expanding while deposits lag, banks face a funding squeeze that will
            eventually force them to slow lending or compete more aggressively for deposits,
            compressing margins either way. This isn't a crisis risk. It's a profitability ceiling.
          </p>

          <p>
            <strong>Is credit-to-GDP returning to trend or overshooting?</strong> Too early to call
            definitively, but the pace of the rebound from negative 48 billion to 2 trillion in two
            years should make anyone nervous. Post-crisis credit booms have a way of feeling like
            structural growth right up until they don't. The base case is that we're still in the
            recovery phase and haven't yet reached the point of overshooting. But this needs to be
            monitored quarter by quarter, not assumed away.
          </p>

          <p>Now here's my honest read on the whole thing.</p>

          <p>
            The thesis is more right than wrong. The banking sector does sit at a structural
            chokepoint in the Sri Lankan economy. Credit expansion is real and has room to run.
            Formalization will continue to push more economic activity through bank balance sheets
            over the next decade. The low valuations, while partly a liquidity artifact, also
            represent a genuine opportunity for patient capital. These are all true statements.
          </p>

          <p>
            But the thesis as it circulates, the clean version, the version that fits in an Instagram
            story, leaves out everything that makes the trade difficult to actually execute. It
            leaves out the possibility of a secondary NPL spike that could compress valuations
            further before they re-rate. It leaves out the funding constraints that could cap
            profitability. It leaves out the fact that you're buying into one of the least liquid
            equity markets in Asia, where the exit door is exactly as narrow as the entrance. And it
            leaves out the most important thing of all: the timeline.
          </p>

          <p>
            This is not a trade that doubles in three years. If you go in expecting that, you will
            almost certainly be disappointed and you will probably sell at exactly the wrong time.
            This is a five to ten year position where the returns come from sitting through periods
            that feel terrible. A quarter where NPLs tick up. A stretch where the market goes
            sideways for eighteen months because there simply aren't enough participants to move the
            price. A year where the rupee weakens and your USD-equivalent returns look flat even as
            the underlying business compounds.
          </p>

          <p>
            The people who will make money on this trade are not the ones who identified the thesis
            first. The thesis is obvious. Everyone on Sri Lankan fintwit can see that banks are cheap
            relative to their earnings power. The people who will make money are the ones who can
            hold through the pain that comes between here and the eventual re-rating. That's a
            different skill entirely. It's not analytical. It's temperamental.
          </p>

          <p>
            So yes. If you have genuinely patient capital, a time horizon measured in years not
            quarters, and the stomach to watch your position draw down 20-30% before it re-rates,
            the Sri Lankan banking sector at current valuations is one of the more compelling
            asymmetric bets available in frontier markets right now.
          </p>

          <p>
            But if you heard this thesis on an Instagram story and you're thinking about putting
            money you might need in two years into HNB, close this tab and go buy a fixed deposit
            instead. Seriously. The risk-adjusted return on a 5-year government bond is perfectly
            respectable right now and nobody ever went broke collecting coupons.
          </p>

          <p className="blog-closing">The edge isn't in knowing the thesis. The edge is in surviving the thesis.</p>
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

export default BlogPost;
