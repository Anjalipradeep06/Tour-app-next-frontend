"use client";

type Props = {
  dates: string[];
  onChange: (dates: string[]) => void;
};

// Splits a stored value like "2026-08-15T09:30" (or "2026-08-15", or a full
// ISO string with seconds/timezone) into separate date and time parts for
// the two inputs.
const splitDateTime = (value: string) => {
  if (!value) return { datePart: "", timePart: "" };

  // Normalize to a Date object first, since stored values may come in as
  // full ISO strings (e.g. from the DB) or as plain "YYYY-MM-DD".
  const hasTime = value.includes("T");

  if (!hasTime) {
    return { datePart: value, timePart: "" };
  }

  const [datePart, rest] = value.split("T");
  // rest could be "09:30" or "09:30:00.000Z" etc — keep just HH:MM
  const timePart = rest ? rest.slice(0, 5) : "";

  return { datePart, timePart };
};

const combineDateTime = (datePart: string, timePart: string) => {
  if (!datePart) return "";
  if (!timePart) return datePart;
  return `${datePart}T${timePart}`;
};

export default function StartDatesEditor({ dates, onChange }: Props) {
  const addDate = () => onChange([...dates, ""]);

  const updateDatePart = (index: number, newDatePart: string) => {
    onChange(
      dates.map((d, i) => {
        if (i !== index) return d;
        const { timePart } = splitDateTime(d);
        return combineDateTime(newDatePart, timePart);
      })
    );
  };

  const updateTimePart = (index: number, newTimePart: string) => {
    onChange(
      dates.map((d, i) => {
        if (i !== index) return d;
        const { datePart } = splitDateTime(d);
        return combineDateTime(datePart, newTimePart);
      })
    );
  };

  const removeDate = (index: number) => onChange(dates.filter((_, i) => i !== index));

  return (
    <div className="tf-field">
      <div className="tf-itinerary-header">
        <label className="tf-label">Available start dates</label>
        <button type="button" className="tf-btn tf-btn--ghost" onClick={addDate}>+ Add date</button>
      </div>

      {dates.length === 0 && <p className="tf-empty-hint">No start dates added yet.</p>}

      <div className="tf-date-list">
        {dates.map((dateValue, index) => {
          const { datePart, timePart } = splitDateTime(dateValue);

          return (
            <div key={index} className="tf-date-row">
              <input
                type="date"
                className="tf-input"
                value={datePart}
                onChange={(e) => updateDatePart(index, e.target.value)}
              />
              <input
                type="time"
                className="tf-input"
                value={timePart}
                onChange={(e) => updateTimePart(index, e.target.value)}
                aria-label="Departure time"
                disabled={!datePart}
              />
              <button
                type="button"
                className="tf-icon-btn tf-icon-btn--danger"
                onClick={() => removeDate(index)}
                aria-label="Remove date"
              >×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}