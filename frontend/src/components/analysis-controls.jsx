export default function AnalysisControls({ mass, onAnalyze, onMassChange, isAnalyzeDisabled }) {
  function handleMassKeyDown(event) {
    if (event.key === "Enter" && !isAnalyzeDisabled) {
      onAnalyze();
    }
  }

  return (
    <div className="analysis-controls">
      <label htmlFor="massInput">Mass (kg)</label>
      <input
        id="massInput"
        min="0"
        step="0.001"
        type="number"
        value={mass}
        onChange={(event) => onMassChange(event.target.value)}
        onKeyDown={handleMassKeyDown}
        placeholder="0.250"
      />
    </div>
  );
}
