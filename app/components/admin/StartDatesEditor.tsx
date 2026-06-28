"use client";

type Props = {
  dates: string[];
  onChange: (dates: string[]) => void;
};

export default function StartDatesEditor({ dates, onChange }: Props) {
  const addDate = () => onChange([...dates, ""]);
  const updateDate = (index: number, value: string) =>
    onChange(dates.map((d, i) => (i === index ? value : d)));
  const removeDate = (index: number) => onChange(dates.filter((_, i) => i !== index));

  return (
    <div className="tf-field">
      <div className="tf-itinerary-header">
        <label className="tf-label">Available start dates</label>
        <button type="button" className="tf-btn tf-btn--ghost" onClick={addDate}>+ Add date</button>
      </div>

      {dates.length === 0 && <p className="tf-empty-hint">No start dates added yet.</p>}

      <div className="tf-date-list">
        {dates.map((dateValue, index) => (
          <div key={index} className="tf-date-row">
            <input
              type="date"
              className="tf-input"
              value={dateValue || ""}
              onChange={(e) => updateDate(index, e.target.value)}
            />
            <button
              type="button"
              className="tf-icon-btn tf-icon-btn--danger"
              onClick={() => removeDate(index)}
              aria-label="Remove date"
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}