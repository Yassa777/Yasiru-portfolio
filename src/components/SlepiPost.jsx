import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './BlogPost.css';
import './SlepiPost.css';
import {
  slepiCascadeStages,
  slepiMethodMetrics,
  slepiMethodNotes,
  slepiMoments,
  slepiPipelineSteps,
  slepiQualityNotes,
  slepiReleaseMatrix,
  slepiStatCards,
  slepiTimeline,
} from '../data/slepiStoryData';

const sections = [
  { id: 'intro', label: 'Why build it' },
  { id: 'design', label: 'Design problem' },
  { id: 'cascade', label: 'Stress cascade' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'freshness', label: 'Freshness' },
  { id: 'signal', label: 'Signal' },
  { id: 'method', label: 'Method' },
  { id: 'takeaway', label: 'Takeaway' },
];

const componentConfig = [
  { key: 'reserve', label: 'Reserve adequacy', color: '#f47f5d', angle: -70 },
  { key: 'fx', label: 'FX market', color: '#f0b347', angle: 15 },
  { key: 'balance', label: 'Underlying balance', color: '#e96f8d', angle: 105 },
  { key: 'buffers', label: 'Buffer inflows', color: '#92bbc0', angle: 195 },
];

const matrixRows = [
  { key: 'fx', label: 'FX market pressure' },
  { key: 'reserve', label: 'Import-cover reserve block' },
  { key: 'balance', label: 'Underlying external balance' },
  { key: 'buffers', label: 'Remittances + tourism buffer' },
];

function formatMonth(dateString, options = {}) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(dateString));
}

function scoreLabel(score) {
  if (score >= 1.5) return 'acute pressure';
  if (score >= 0.5) return 'elevated pressure';
  if (score > -0.5) return 'near neutral';
  return 'supportive';
}

function buildLinePath(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
}

function buildAreaPath(points, baselineY) {
  if (!points.length) return '';
  const first = points[0];
  const last = points[points.length - 1];
  return `M${first.x},${baselineY} L${first.x},${first.y} ${points
    .slice(1)
    .map((point) => `L${point.x},${point.y}`)
    .join(' ')} L${last.x},${baselineY} Z`;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return prefersReducedMotion;
}

function CascadeIcon({ id }) {
  if (id === 'shock') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <circle className="cascade-orb cascade-orb-a" cx="22" cy="24" r="7" />
        <circle className="cascade-orb cascade-orb-b" cx="50" cy="21" r="6" />
        <path className="cascade-droplet" d="M36 15C42 24 45 29 45 34C45 40.0751 40.0751 45 34 45C27.9249 45 23 40.0751 23 34C23 29.5 25.8 24.5 36 15Z" />
        <path className="cascade-shock-line" d="M12 53C20 47 29 45 37 49C43 52 49 53 60 48" />
      </svg>
    );
  }

  if (id === 'current-account') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <rect className="cascade-ledger" x="15" y="18" width="42" height="36" rx="10" />
        <path className="cascade-flow-in" d="M24 29H41M36 24L41 29L36 34" />
        <path className="cascade-flow-out" d="M48 43H31M36 38L31 43L36 48" />
        <line className="cascade-ledger-line" x1="25" y1="36" x2="47" y2="36" />
      </svg>
    );
  }

  if (id === 'reserves') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <rect className="cascade-tank" x="19" y="12" width="34" height="46" rx="12" />
        <path className="cascade-tank-fill" d="M25 28C31 31 35 31 41 28C45 26 48 26 47 27V52H25V28Z" />
        <path className="cascade-tank-level" d="M25 28C31 31 35 31 41 28C45 26 48 26 47 27" />
      </svg>
    );
  }

  if (id === 'currency') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <path className="cascade-rate-frame" d="M14 19H58V53H14" />
        <path className="cascade-rate-line" d="M19 29L31 27L42 33L53 46" />
        <path className="cascade-rate-fall" d="M49 41L53 46L58 38" />
      </svg>
    );
  }

  if (id === 'inflation') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <rect className="cascade-box cascade-box-a" x="13" y="26" width="14" height="18" rx="4" />
        <rect className="cascade-box cascade-box-b" x="29" y="22" width="14" height="22" rx="4" />
        <rect className="cascade-box cascade-box-c" x="45" y="17" width="14" height="27" rx="4" />
        <path className="cascade-price-arrow" d="M34 57V45M34 45L29 50M34 45L39 50" />
      </svg>
    );
  }

  if (id === 'debt') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <rect className="cascade-debt-shadow" x="24" y="18" width="28" height="34" rx="8" />
        <rect className="cascade-debt-body" x="18" y="18" width="28" height="34" rx="8" />
        <path className="cascade-debt-lines" d="M24 29H40M24 36H35M24 43H38" />
        <path className="cascade-debt-arrow" d="M55 47V25M55 25L49 31M55 25L61 31" />
      </svg>
    );
  }

  if (id === 'risk') {
    return (
      <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
        <path className="cascade-spread-base" d="M15 52H57" />
        <path className="cascade-spread-left" d="M23 52L31 27" />
        <path className="cascade-spread-right" d="M49 52L41 20" />
        <circle className="cascade-spread-dot" cx="31" cy="27" r="4" />
        <circle className="cascade-spread-dot" cx="41" cy="20" r="4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="cascade-icon-svg" aria-hidden="true">
      <path className="cascade-pipe-body" d="M13 26H34C41 26 41 46 48 46H59" />
      <path className="cascade-pipe-neck" d="M31 26C38 26 38 46 45 46" />
      <path className="cascade-pipe-arrow" d="M48 36H60M55 31L60 36L55 41" />
    </svg>
  );
}

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
      sectionEls.forEach((sectionEl, index) => {
        const sectionRect = sectionEl.getBoundingClientRect();
        if (sectionRect.top < visible * 0.38) current = index;
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
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`progress-node ${index <= activeSection ? 'active' : ''}`}
              style={{ top: `${(index / (sections.length - 1)) * 100}%` }}
            >
              <span className="progress-dot" />
              <span className="progress-label">{section.label}</span>
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

function SlepiTimelineChart() {
  const shellRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(slepiTimeline.length - 1);
  const width = 760;
  const height = 360;
  const pad = { top: 28, right: 24, bottom: 46, left: 44 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const minScore = -2.1;
  const maxScore = 3.2;
  const hovered = slepiTimeline[hoveredIndex];

  const toX = (index) => pad.left + (index / (slepiTimeline.length - 1)) * chartWidth;
  const toY = (score) => pad.top + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;

  const points = slepiTimeline.map((point, index) => ({
    ...point,
    x: toX(index),
    y: toY(point.score),
  }));

  const zeroY = toY(0);
  const peakPoint = points.reduce((best, point) => (point.score > best.score ? point : best), points[0]);
  const latestPoint = points[points.length - 1];
  const areaPath = buildAreaPath(points, zeroY);
  const linePath = buildLinePath(points);

  const onMove = (event) => {
    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rawX = ((event.clientX - rect.left) / rect.width) * width;
    const clamped = Math.min(pad.left + chartWidth, Math.max(pad.left, rawX));
    const index = Math.round(((clamped - pad.left) / chartWidth) * (slepiTimeline.length - 1));
    setHoveredIndex(index);
  };

  const yearTicks = [2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025];
  const gridValues = [-2, -1, 0, 1, 2, 3];

  return (
    <div className="slepi-chart-card">
      <div className="slepi-chart-header">
        <div>
          <span className="slepi-kicker">Long run</span>
          <h3>The index does exactly what I wanted in the crisis window</h3>
        </div>
        <div className="slepi-mini-stat">
          <span className="slepi-mini-label">Hovered month</span>
          <strong>{formatMonth(hovered.date)}</strong>
          <span>{hovered.score.toFixed(2)} · {scoreLabel(hovered.score)}</span>
        </div>
      </div>

      <div
        ref={shellRef}
        className="slepi-timeline-shell"
        onMouseMove={onMove}
        onMouseLeave={() => setHoveredIndex(slepiTimeline.length - 1)}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="slepi-timeline" role="img" aria-label="Timeline of the adjusted SLEPI score from 2011 to 2026">
          <defs>
            <linearGradient id="slepi-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(243, 115, 68, 0.32)" />
              <stop offset="65%" stopColor="rgba(243, 115, 68, 0.12)" />
              <stop offset="100%" stopColor="rgba(243, 115, 68, 0.02)" />
            </linearGradient>
          </defs>

          <rect x={pad.left} y={pad.top} width={chartWidth} height={chartHeight} fill="rgba(255,255,255,0.34)" rx="24" />

          {gridValues.map((value) => (
            <g key={value}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={toY(value)}
                y2={toY(value)}
                className={`slepi-grid-line ${value === 0 ? 'zero' : ''}`}
              />
              <text x={pad.left - 10} y={toY(value) + 4} className="slepi-axis-label slepi-axis-left">
                {value}
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#slepi-area-fill)" />
          <line x1={pad.left} x2={width - pad.right} y1={zeroY} y2={zeroY} className="slepi-zero-line" />
          <path d={linePath} className="slepi-line-path" />

          {yearTicks.map((year) => {
            const index = slepiTimeline.findIndex((point) => point.date.startsWith(`${year}-01`));
            if (index === -1) return null;
            return (
              <g key={year}>
                <line x1={toX(index)} x2={toX(index)} y1={height - pad.bottom + 2} y2={height - pad.bottom + 8} className="slepi-axis-tick" />
                <text x={toX(index)} y={height - 14} className="slepi-axis-label slepi-axis-year">
                  {year}
                </text>
              </g>
            );
          })}

          <line x1={peakPoint.x} x2={peakPoint.x} y1={pad.top} y2={height - pad.bottom} className="slepi-marker-line" />
          <circle cx={peakPoint.x} cy={peakPoint.y} r="5.5" className="slepi-marker-dot peak" />
          <text x={peakPoint.x + 12} y={peakPoint.y - 10} className="slepi-callout">
            Apr 2022 peak
          </text>

          <circle cx={latestPoint.x} cy={latestPoint.y} r="5.5" className="slepi-marker-dot latest" />
          <text x={latestPoint.x - 10} y={latestPoint.y - 10} textAnchor="end" className="slepi-callout">
            Latest complete
          </text>

          <line
            x1={points[hoveredIndex].x}
            x2={points[hoveredIndex].x}
            y1={pad.top}
            y2={height - pad.bottom}
            className="slepi-hover-line"
          />
          <circle cx={points[hoveredIndex].x} cy={points[hoveredIndex].y} r="6" className="slepi-hover-dot" />
        </svg>

        <div
          className="slepi-tooltip"
          style={{
            left: `${((points[hoveredIndex].x - pad.left) / chartWidth) * 100}%`,
            top: `${((points[hoveredIndex].y - pad.top) / chartHeight) * 100}%`,
          }}
        >
          <strong>{formatMonth(hovered.date)}</strong>
          <span>{hovered.score.toFixed(2)}</span>
        </div>
      </div>

      <p className="chart-source">
        Source: adjusted SLEPI series rebuilt from the Charts.lk project panel. The crisis peak lands in April 2022 at 2.79; the latest complete month is February 2026 at -0.36.
      </p>
    </div>
  );
}

function BloomExplorer() {
  const [activeId, setActiveId] = useState(slepiMoments[0].id);
  const activeMoment = slepiMoments.find((moment) => moment.id === activeId) || slepiMoments[0];

  return (
    <div className="slepi-chart-card">
      <div className="slepi-chart-header">
        <div>
          <span className="slepi-kicker">Composition explorer</span>
          <h3>The same score means different things in different regimes</h3>
        </div>
      </div>

      <div className="slepi-pill-row" role="tablist" aria-label="Selected SLEPI moments">
        {slepiMoments.map((moment) => (
          <button
            key={moment.id}
            type="button"
            className={`slepi-pill ${moment.id === activeMoment.id ? 'active' : ''}`}
            onClick={() => setActiveId(moment.id)}
          >
            <span>{moment.label}</span>
            <strong>{moment.title}</strong>
          </button>
        ))}
      </div>

      <div className="bloom-layout">
        <div className="bloom-stage">
          <div className="bloom-halo bloom-halo-warm" />
          <div className="bloom-halo bloom-halo-cool" />
          {componentConfig.map((component) => {
            const value = activeMoment[component.key];
            const magnitude = Math.min(1, Math.abs(value) / 5);
            const tone = value >= 0 ? 'pressure' : 'support';
            return (
              <div
                key={component.key}
                className={`bloom-petal ${tone}`}
                style={{
                  '--petal-angle': `${component.angle}deg`,
                  '--petal-scale': (0.55 + magnitude * 0.8).toFixed(3),
                  '--petal-opacity': (0.38 + magnitude * 0.38).toFixed(3),
                  '--petal-color': component.color,
                }}
              >
                <span className="bloom-petal-label">{component.label}</span>
              </div>
            );
          })}

          <div className="bloom-center">
            <span className="bloom-center-label">{scoreLabel(activeMoment.score)}</span>
            <strong>{activeMoment.score.toFixed(2)}</strong>
            <small>{formatMonth(activeMoment.date)}</small>
          </div>
        </div>

        <div className="bloom-copy">
          <p className="bloom-note">{activeMoment.note}</p>
          <div className="bloom-metrics">
            {componentConfig.map((component) => {
              const value = activeMoment[component.key];
              return (
                <div key={component.key} className="bloom-metric-card">
                  <span className="bloom-metric-label">{component.label}</span>
                  <strong>{value > 0 ? '+' : ''}{value.toFixed(2)}</strong>
                  <span className={`bloom-metric-tone ${value >= 0 ? 'pressure' : 'support'}`}>
                    {value >= 0 ? 'adding pressure' : 'adding support'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="chart-source">
        This botanical view is interpretive rather than literal: longer petals mean larger absolute z-scores, and warmer petals indicate pressure instead of support.
      </p>
    </div>
  );
}

function FreshnessMatrix() {
  const [activeMonth, setActiveMonth] = useState(slepiReleaseMatrix[1]);

  return (
    <div className="slepi-chart-card">
      <div className="slepi-chart-header">
        <div>
          <span className="slepi-kicker">Freshness logic</span>
          <h3>The hard part is that the blocks do not arrive at the same time</h3>
        </div>
      </div>

      <div className="freshness-grid" role="table" aria-label="Availability of SLEPI input blocks by month">
        <div className="freshness-cell freshness-corner" />
        {slepiReleaseMatrix.map((column) => (
          <button
            key={column.month}
            type="button"
            className={`freshness-cell freshness-month ${activeMonth.month === column.month ? 'active' : ''}`}
            onMouseEnter={() => setActiveMonth(column)}
            onFocus={() => setActiveMonth(column)}
            onClick={() => setActiveMonth(column)}
          >
            {column.month}
          </button>
        ))}

        {matrixRows.map((row) => (
          <div key={row.key} className="freshness-row-group">
            <div key={`${row.key}-label`} className="freshness-cell freshness-row-label">
              {row.label}
            </div>
            {slepiReleaseMatrix.map((column) => (
              <button
                key={`${row.key}-${column.month}`}
                type="button"
                className={`freshness-cell freshness-status ${column.status[row.key] ? 'ready' : 'pending'} ${activeMonth.month === column.month ? 'active' : ''}`}
                onMouseEnter={() => setActiveMonth(column)}
                onFocus={() => setActiveMonth(column)}
                onClick={() => setActiveMonth(column)}
                aria-label={`${row.label} in ${column.month}: ${column.status[row.key] ? 'available' : 'pending'}`}
              >
                <span />
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="freshness-note">{activeMonth.note}</p>
      <p className="chart-source">
        The release cadence in the methodology note is the reason the dashboard keeps a freshness layer instead of manufacturing a fake all-in daily series.
      </p>
    </div>
  );
}

function MethodBars() {
  return (
    <div className="slepi-chart-card">
      <div className="slepi-chart-header">
        <div>
          <span className="slepi-kicker">Method cleanup</span>
          <h3>I kept the signal, but removed the double counting</h3>
        </div>
      </div>

      <div className="method-bars">
        {slepiMethodMetrics.map((metric) => {
          const max = Math.max(metric.adjusted, metric.userSpec) * 1.08;
          return (
            <div key={metric.label} className="method-row">
              <div className="method-copy">
                <strong>{metric.label}</strong>
                <span>{metric.highlight === 'adjusted' ? 'Adjusted wins narrowly' : 'Raw version is slightly stronger on fit'}</span>
              </div>
              <div className="method-visual">
                <div className="method-track">
                  <div className={`method-bar adjusted ${metric.highlight === 'adjusted' ? 'highlight' : ''}`} style={{ width: `${(metric.adjusted / max) * 100}%` }}>
                    <span>{metric.adjusted.toFixed(3)}</span>
                  </div>
                </div>
                <div className="method-track">
                  <div className={`method-bar raw ${metric.highlight === 'userSpec' ? 'highlight' : ''}`} style={{ width: `${(metric.userSpec / max) * 100}%` }}>
                    <span>{metric.userSpec.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="method-legend">
        <span><i className="adjusted" /> adjusted</span>
        <span><i className="raw" /> original user spec</span>
      </div>

      <div className="quality-grid">
        {slepiQualityNotes.map((note) => (
          <div key={note} className="quality-chip">{note}</div>
        ))}
      </div>
    </div>
  );
}

function StressCascadeLoop() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeStage = slepiCascadeStages[activeIndex];
  const progress = (activeIndex / (slepiCascadeStages.length - 1)) * 100;

  useEffect(() => {
    if (prefersReducedMotion || paused) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slepiCascadeStages.length);
    }, 1900);

    return () => window.clearInterval(intervalId);
  }, [paused, prefersReducedMotion]);

  const handlePick = (index) => {
    setActiveIndex(index);
    setPaused(true);
  };

  return (
    <div className="slepi-chart-card cascade-card">
      <div className="slepi-chart-header">
        <div>
          <span className="slepi-kicker">Transmission loop</span>
          <h3>How an external shock typically propagates through the economy</h3>
        </div>
        <div className="slepi-mini-stat">
          <span className="slepi-mini-label">Current frame</span>
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
          <span>{activeStage.act}</span>
        </div>
      </div>

      <p className="cascade-intro">
        This is the stylized chain I have in mind when I say external stress can travel far beyond the balance of payments. Hover or click any node to hold the loop on that stage.
      </p>

      <div
        className="cascade-shell"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="cascade-spine" aria-hidden="true">
          <div className="cascade-progress" style={{ height: `${progress}%` }} />
          <div className="cascade-pulse" style={{ top: `${progress}%` }} />
        </div>

        <div className="cascade-stages">
          {slepiCascadeStages.map((stage, index) => {
            const state = index === activeIndex ? 'active' : index < activeIndex ? 'passed' : 'pending';
            return (
              <button
                key={stage.id}
                type="button"
                className={`cascade-stage ${state}`}
                style={{ '--cascade-accent': stage.accent }}
                onMouseEnter={() => handlePick(index)}
                onFocus={() => handlePick(index)}
                onClick={() => handlePick(index)}
              >
                <span className="cascade-stage-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="cascade-stage-icon">
                  <CascadeIcon id={stage.id} />
                </div>
                <div className="cascade-stage-copy">
                  <span className="cascade-stage-act">{stage.act}</span>
                  <strong>{stage.title}</strong>
                  <span>{stage.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cascade-detail" style={{ '--cascade-accent': activeStage.accent }}>
        <span className="cascade-detail-tag">{activeStage.act}</span>
        <h4>{activeStage.title}</h4>
        <p>{activeStage.detail}</p>
        <div className="cascade-detail-effect">
          <span>Pressure effect</span>
          <strong>{activeStage.effect}</strong>
        </div>
      </div>

      <p className="chart-source">
        Stylized mechanism loop only. Real episodes can overlap, skip steps, or move faster, but this ordering is the core logic behind why external stress can keep compounding.
      </p>
    </div>
  );
}

function SlepiPost() {
  const articleRef = useRef(null);

  return (
    <article className="blog-post slepi-post" ref={articleRef}>
      <ReadingProgress contentRef={articleRef} />
      <div className="blog-post-container slepi-container">
        <Link to="/" className="blog-back">&larr; back</Link>

        <header className="slepi-hero" data-section="intro">
          <img
            src="/assets/slepi-cover.svg"
            alt="Abstract grainy pastel gradient composition with warm coral, peach, cream, and pale aqua tones"
            className="slepi-hero-image"
          />
          <div className="slepi-hero-overlay">
            <span className="slepi-overline">macro-financial systems / dav lab / april 2026</span>
            <h1 className="slepi-title">How and Why I Built SLEPI</h1>
            <p className="slepi-subtitle">
              Turning a messy stack of CBSL workbooks into a living read on Sri Lanka&apos;s external pressure.
            </p>
            <div className="blog-meta slepi-meta">
              <span>April 2026</span>
              <span>12 min read</span>
              <span>Yasiru</span>
            </div>
          </div>
        </header>

        <div className="blog-content">
          <p className="slepi-lede">
            I built SLEPI because Sri Lanka&apos;s external story is usually narrated too late. By the time a crisis or recovery becomes obvious in headlines, the regime has already changed. I wanted a cleaner way to watch pressure build and ease across the external account without waiting for a single annual retrospective.
          </p>

          <p>
            The project lives inside my <em>Charts.lk</em> workflow at the DAV Lab. The basic problem was simple enough to describe and annoyingly hard to implement: the signal I cared about did not live in one series. Reserve adequacy mattered. Exchange-rate pressure mattered. The current account mattered. Remittances and tourism mattered too, because in Sri Lanka they often act less like background noise and more like shock absorbers.
          </p>

          <p>
            So the real job was not just to invent another index. It was to build one that stayed economically legible, stayed honest about missing releases, and could refresh itself from the live <a href="https://www.cbsl.gov.lk/en/statistics/statistical-tables/external-sector" target="_blank" rel="noopener noreferrer">CBSL external-sector tables</a> instead of becoming another dead spreadsheet the moment the filenames changed.
          </p>

          <div className="slepi-stat-grid">
            {slepiStatCards.map((card) => (
              <div key={card.label} className={`slepi-stat-card ${card.tone || ''}`}>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </div>
            ))}
          </div>

          <div className="blog-images slepi-image-grid">
            <figure className="blog-figure">
              <img
                src="/assets/slepi-cover.svg"
                alt="Pastel grain gradient image used as the visual language for the SLEPI article"
                loading="lazy"
              />
              <figcaption>The mood board I wanted for the piece: warm, soft, and slightly analog rather than a cold dashboard aesthetic.</figcaption>
            </figure>
            <figure className="blog-figure">
              <img
                src="/assets/slepi-pipeline.svg"
                alt="Stylized pipeline diagram showing discovery, caching, rebuilding, and publishing steps"
                loading="lazy"
              />
              <figcaption>The engineering spine behind the page: discover, cache, rebuild, publish.</figcaption>
            </figure>
          </div>

          <h2 className="blog-section-title" data-section="design">The design problem was not the math. It was the timing.</h2>
          <p>
            On paper, the four-block structure was straightforward: reserve adequacy via import cover, FX market pressure via monthly USD/LKR depreciation, underlying external-balance pressure, and buffer-inflow support from remittances plus tourism. In practice, those blocks arrive on different clocks. Some official monthly series only begin recently. Others have longer histories, but not in the exact format a live index wants.
          </p>

          <p>
            That forced two decisions early. First, I had to accept that a useful long history would need backfill and a calibrated proxy, especially before official monthly current-account data starts in 2023-01. Second, I had to avoid building a dishonest pseudo-daily product out of mostly monthly releases. I wanted something live, not something fake-precise.
          </p>

          <blockquote className="blog-pullquote">
            I did not want a dashboard that pretended every block updated every day. I wanted a signal that knew the difference between “new information” and “same month, better timing.”
          </blockquote>

          <h2 className="blog-section-title" data-section="cascade">How the pressure actually travels</h2>
          <p>
            SLEPI lives on the external side of the system, but the reason that external pressure matters is that it rarely stays there. Usually there is a chain: an outside shock hits first, the current account worsens, reserves get used up, the currency adjusts, domestic prices jump, debt servicing becomes heavier, risk premia widen, and financing conditions tighten.
          </p>

          <p>
            The loop below is deliberately stylized rather than statistical. The point is to show ordering and mechanism. It is the mental model sitting behind the index: the external account is often where the pressure begins, but not where the damage ends.
          </p>

          <StressCascadeLoop />

          <h2 className="blog-section-title" data-section="pipeline">The build itself ended up being a small production system</h2>
          <p>
            The Python pipeline now does the entire loop in one pass. It discovers the latest official workbook links, downloads them into a raw cache, rebuilds the monthly panel and snapshot artifacts, writes out methodology and freshness notes, and can publish the whole set to object storage for the live frontend to read at request time. That is the difference between a one-off research script and a series I can actually trust next month.
          </p>

          <div className="slepi-pipeline-grid">
            {slepiPipelineSteps.map((step) => (
              <article key={step.step} className="slepi-pipeline-card">
                <span className="slepi-step-num">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <p>
            The frontend side matters just as much. The app tries the remote snapshot first, and falls back to a local snapshot when the remote base URL is missing or unreachable. That sounds minor, but it turns “local snapshot” into a meaningful diagnostic state. It tells me the build may have worked while the live wiring did not.
          </p>

          <FreshnessMatrix />

          <h2 className="blog-section-title" data-section="signal">The payoff is that the index now reads like a regime tool, not a trivia sheet</h2>
          <p>
            The timeline below is the best argument for the project. The adjusted series spikes exactly where you would want it to spike: into the 2021-2022 external crisis window, with the peak arriving in April 2022. After that, the score does not just drift randomly lower. It changes character. Pressure gives way to repair, then to a more mixed but still supportive post-crisis state.
          </p>

          <SlepiTimelineChart />

          <p>
            What I like most is that the same headline score can now be opened up and interrogated. A pressure episode driven by FX stress is not the same as one driven by reserve adequacy or by the underlying balance. That is where the four-block structure becomes useful rather than decorative.
          </p>

          <BloomExplorer />

          <h2 className="blog-section-title" data-section="method">I also had to make one important methodological correction</h2>
          <p>
            The original user-spec version of the index counted remittances and tourism twice: once inside the current-account block and again inside the support block. Economically that bothered me more than the marginal performance difference helped me. So I kept the raw version as a shadow series and promoted the adjusted version as the headline series.
          </p>

          <MethodBars />

          <ul className="blog-questions slepi-question-list">
            {slepiMethodNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2 className="blog-section-title" data-section="takeaway">Why build it this way?</h2>
          <p>
            Because Sri Lanka&apos;s external constraint is not one number. It is a choreography between reserves, the exchange rate, the current account, and the inflows that buy breathing room. SLEPI gives me a disciplined way to watch that choreography without flattening it into a single sensational headline.
          </p>

          <p>
            More than that, building it this way forced the project to stay honest. The data gaps are visible. The release lags are visible. The fallback path is visible. And that, to me, is the right tradeoff: a live index that admits its edges, instead of a prettier one that hides them.
          </p>

          <p className="blog-closing">
            SLEPI is useful because it behaves like a research instrument first and a dashboard second.
          </p>
        </div>
      </div>
    </article>
  );
}

export default SlepiPost;
