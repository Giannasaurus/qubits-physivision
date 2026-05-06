const MASS_UNIT_OPTIONS = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "lb", value: "lb" },
  { label: "oz", value: "oz" },
];

export default function AnalysisControls({
  mass,
  massUnit,
  onAnalyze,
  onMassChange,
  onMassUnitChange,
  isAnalyzeDisabled,
}) {
  function handleMassKeyDown(event) {
    if (event.key === "Enter" && !isAnalyzeDisabled) {
      onAnalyze();
    }
  }

  return (
    <div className="analysis-controls">
      <label htmlFor="massInput">Mass</label>
      <div className="mass-input-group">
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
        <label className="invisible" htmlFor="massUnit">
          Mass unit
        </label>
        <select
          id="massUnit"
          value={massUnit}
          onChange={(event) => onMassUnitChange(event.target.value)}
        >
          {MASS_UNIT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
