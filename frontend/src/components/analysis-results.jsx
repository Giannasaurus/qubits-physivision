import AnalysisCharts from "./analysis-charts.jsx";
import AnalysisSummary from "./analysis-summary.jsx";

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }

  return Number(value).toFixed(6);
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
        ["omega", "omega (ω)", formatNumber(physics.omega)],
        ["omega0", "omega0 (ω0)", formatNumber(physics.omega0)],
        ["gamma", "gamma (γ)", formatNumber(physics.gamma)],
        ["k", "spring constant (k)", formatNumber(physics.springConstant)],
        ["zeta", "zeta (ζ)", formatNumber(physics.zeta)],
        ["phase", "phase phi (φ)", formatNumber(physics.phase)],
      ],
    ],
    ["REGIME", [["regime", "regime", physics.regime]]],
    [
      "STABILITY",
      [
        ["omegaDrift", "Delta omega %", formatNumber(physics.omegaDriftPercent)],
        ["gammaDrift", "Delta gamma %", formatNumber(physics.gammaDriftPercent)],
      ],
    ],
    [
      "FIT",
      [
        ["rmse", "RMSE", formatNumber(physics.rmse)],
        ["nrmse", "NRMSE", formatNumber(physics.nrmse)],
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
