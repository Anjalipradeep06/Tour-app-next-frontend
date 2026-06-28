"use client";

import { useState } from "react";

type Props = {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function TagListInput({ label, values, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) { setDraft(""); return; }
    onChange([...values, trimmed]);
    setDraft("");
  };

  const removeTag = (index: number) => onChange(values.filter((_, i) => i !== index));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  };

  return (
    <div className="tf-field">
      {label && <label className="tf-label">{label}</label>}
      <div className="tf-tag-input-row">
        <input
          type="text"
          className="tf-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type and press Enter"}
        />
        <button type="button" className="tf-btn tf-btn--ghost" onClick={addTag}>Add</button>
      </div>
      {values.length > 0 && (
        <ul className="tf-tag-list">
          {values.map((value, index) => (
            <li key={`${value}-${index}`} className="tf-tag">
              {value}
              <button type="button" className="tf-tag-remove" onClick={() => removeTag(index)} aria-label={`Remove ${value}`}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}