import katex from "katex";
import "katex/dist/katex.min.css";
import AnalysisCharts from "./analysis-charts.jsx";
import AnalysisSummary from "./analysis-summary.jsx";

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }

  return Number(value).toFixed(6);
}

function MathLabel({ fallback, math }) {
  return (
    <span
      className="result-label"
      aria-label={fallback}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, {
          output: "html",
          throwOnError: false,
        }),
      }}
    />
  );
}

function ResultRow({ label, value }) {
  return (
    <p>
      <span className="result-row-label">{label}:</span> {value}
    </p>
  );
}

function ResultSection({ title, rows }) {
  return (
    <section>
      <h3>{title}</h3>
      {rows.map(([key, label, value]) => (
        <ResultRow key={key} label={label} value={value} />
      ))}
    </section>
  );
}

export default function AnalysisResults({ analysis }) {
  const { physics } = analysis;
  const sections = [
    [
      "RESULTS",
      [
        ["omega", <MathLabel fallback="omega" math="\\omega" />, formatNumber(physics.omega)],
        ["omega0", <MathLabel fallback="omega zero" math="\\omega_0" />, formatNumber(physics.omega0)],
        ["gamma", <MathLabel fallback="gamma" math="\\gamma" />, formatNumber(physics.gamma)],
        ["k", <MathLabel fallback="spring constant k" math="k" />, formatNumber(physics.springConstant)],
        ["zeta", <MathLabel fallback="zeta" math="\\zeta" />, formatNumber(physics.zeta)],
        ["phase", <MathLabel fallback="phase phi" math="\\phi" />, formatNumber(physics.phase)],
      ],
    ],
    ["REGIME", [["regime", "regime", physics.regime]]],
    [
      "STABILITY",
      [
        ["omegaDrift", <MathLabel fallback="omega drift percent" math="\\Delta\\omega\\ (\\%)" />, formatNumber(physics.omegaDriftPercent)],
        ["gammaDrift", <MathLabel fallback="gamma drift percent" math="\\Delta\\gamma\\ (\\%)" />, formatNumber(physics.gammaDriftPercent)],
      ],
    ],
    [
      "FIT",
      [
        ["rmse", <MathLabel fallback="RMSE" math="\\mathrm{RMSE}" />, formatNumber(physics.rmse)],
        ["nrmse", <MathLabel fallback="NRMSE" math="\\mathrm{NRMSE}" />, formatNumber(physics.nrmse)],
      ],
    ],
  ];

  return (
    <section className="analysis-results" aria-live="polite">
      <AnalysisSummary physics={physics} />
      {sections.map(([title, rows]) => (
        <ResultSection key={title} title={title} rows={rows} />
      ))}
      <AnalysisCharts series={physics.series} />
    </section>
  );
}
