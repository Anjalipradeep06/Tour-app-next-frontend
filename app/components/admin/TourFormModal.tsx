"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { createTour, updateTour } from "@/redux/thunks/tourThunk";
import { getAllDestinations } from "@/redux/thunks/destinationThunk";
import { resetTourActionState } from "@/redux/slices/tourSlice";

import TagListInput from "./TagListInput";
import ItineraryEditor from "./ItineraryEditor";
import StartDatesEditor from "./StartDatesEditor";

import "./TourFormModal.css";

const emptyTour = {
  title: "", destination: "", description: "",
  duration: "", price: "", availableSlots: "",
  activities: [], highlights: [], inclusions: [],
  exclusions: [], itinerary: [], startDates: [],
  meetingPoint: { address: "", latitude: "", longitude: "" },
  isFeatured: false,
};

// Formats a Date into "YYYY-MM-DDTHH:MM" using LOCAL time (not UTC), so it
// round-trips correctly with <input type="date"> + <input type="time">
// in StartDatesEditor. Using toISOString() here would shift the time by
// the browser's UTC offset and silently corrupt the departure time.
const toLocalDateTimeValue = (d: any) => {
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toFormState = (tour: any) => {
  if (!tour) return emptyTour;
  return {
    title: tour.title || "",
    destination: typeof tour.destination === "object" ? tour.destination?._id || "" : tour.destination || "",
    description: tour.description || "",
    duration: tour.duration ?? "",
    price: tour.price ?? "",
    availableSlots: tour.availableSlots ?? "",
    activities: tour.activities || [],
    highlights: tour.highlights || [],
    inclusions: tour.inclusions || [],
    exclusions: tour.exclusions || [],
    itinerary: tour.itinerary || [],
    startDates: (tour.startDates || []).map(toLocalDateTimeValue),
    meetingPoint: {
      address: tour.meetingPoint?.address || "",
      latitude: tour.meetingPoint?.latitude ?? "",
      longitude: tour.meetingPoint?.longitude ?? "",
    },
    isFeatured: !!tour.isFeatured,
  };
};

const toPayload = (form: any) => ({
  title: form.title.trim(),
  destination: form.destination,
  description: form.description.trim(),
  duration: Number(form.duration),
  price: Number(form.price),
  availableSlots: Number(form.availableSlots) || 0,
  activities: form.activities,
  highlights: form.highlights,
  inclusions: form.inclusions,
  exclusions: form.exclusions,
  itinerary: form.itinerary.map((d: any) => ({
    day: Number(d.day),
    title: d.title.trim(),
    description: d.description.trim(),
  })),
  // Values here are "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" strings from
  // StartDatesEditor. JS Date parses either form as LOCAL time when there's
  // no explicit timezone suffix, so `new Date(...)` on the backend/Mongoose
  // side will correctly reconstruct the admin's intended local date+time.
  startDates: form.startDates.filter(Boolean),
  meetingPoint: {
    address: form.meetingPoint.address.trim(),
    latitude: form.meetingPoint.latitude ? Number(form.meetingPoint.latitude) : undefined,
    longitude: form.meetingPoint.longitude ? Number(form.meetingPoint.longitude) : undefined,
  },
  isFeatured: form.isFeatured,
});

type Props = { tour?: any; onClose: (saved?: boolean) => void };

export default function TourFormModal({ tour, onClose }: Props) {
  const dispatch = useDispatch();
  const isEditMode = !!tour;

  const { allDestinations = [], loading: destinationsLoading } = useSelector((state: any) => state.destinations);
  const { actionLoading, actionError, actionSuccess, actionMessage } = useSelector((state: any) => state.tours);

  const [form, setForm] = useState(() => toFormState(tour));
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(getAllDestinations({ limit: 100 }) as any);
  }, [dispatch]);

  useEffect(() => {
    if (actionSuccess) {
      toast.success(actionMessage || (isEditMode ? "Tour updated successfully" : "Tour created successfully"));
      dispatch(resetTourActionState());
      onClose(true);
    }
  }, [actionSuccess, actionMessage, isEditMode, dispatch, onClose]);

  useEffect(() => {
    return () => { dispatch(resetTourActionState()); };
  }, []);

  const updateField = (field: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [field]: value }));

  const updateMeetingPoint = (field: string, value: string) =>
    setForm((prev: any) => ({ ...prev, meetingPoint: { ...prev.meetingPoint, [field]: value } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!form.title.trim()) return setValidationError("Title is required.");
    if (!form.destination) return setValidationError("Please select a destination.");
    if (!form.description.trim()) return setValidationError("Description is required.");
    if (!form.duration || Number(form.duration) < 1) return setValidationError("Duration must be at least 1 day.");
    if (form.price === "" || Number(form.price) < 0) return setValidationError("Price must be a positive number.");

    const payload = toPayload(form);
    if (isEditMode) {
      dispatch(updateTour({ id: tour._id, tourData: payload }) as any);
    } else {
      dispatch(createTour(payload) as any);
    }
  };

  return (
    <div className="tf-overlay" role="dialog" aria-modal="true">
      <div className="tf-modal">
        <div className="tf-modal-header">
          <h2>{isEditMode ? "Edit Tour" : "Create Tour"}</h2>
          <button type="button" className="tf-icon-btn" onClick={() => onClose(false)} aria-label="Close">×</button>
        </div>

        <form className="tf-modal-body" onSubmit={handleSubmit}>
          {(validationError || actionError) && (
            <div className="tf-form-error">{validationError || actionError}</div>
          )}

          <div className="tf-grid-2">
            <div className="tf-field">
              <label className="tf-label">Title</label>
              <input type="text" className="tf-input" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Japan Nature & Hiking Adventure" />
            </div>
            <div className="tf-field">
              <label className="tf-label">Destination</label>
              <select className="tf-input" value={form.destination} onChange={(e) => updateField("destination", e.target.value)} disabled={destinationsLoading}>
                <option value="">{destinationsLoading ? "Loading…" : "Select a destination"}</option>
                {allDestinations.map((d: any) => (
                  <option key={d._id} value={d._id}>{d.name}, {d.country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="tf-field">
            <label className="tf-label">Description</label>
            <textarea className="tf-textarea" rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe the tour experience…" />
          </div>

          <div className="tf-grid-3">
            <div className="tf-field">
              <label className="tf-label">Duration (days)</label>
              <input type="number" min="1" className="tf-input" value={form.duration} onChange={(e) => updateField("duration", e.target.value)} />
            </div>
            <div className="tf-field">
              <label className="tf-label">Price (₹)</label>
              <input type="number" min="0" className="tf-input" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
            </div>
            <div className="tf-field">
              <label className="tf-label">Available slots</label>
              <input type="number" min="0" className="tf-input" value={form.availableSlots} onChange={(e) => updateField("availableSlots", e.target.value)} />
            </div>
          </div>

          <TagListInput label="Activities" values={form.activities} onChange={(v) => updateField("activities", v)} placeholder="e.g. Hiking — press Enter" />
          <TagListInput label="Highlights" values={form.highlights} onChange={(v) => updateField("highlights", v)} placeholder="e.g. Sunrise at Mt Fuji" />
          <ItineraryEditor days={form.itinerary} onChange={(v) => updateField("itinerary", v)} />

          <div className="tf-grid-2">
            <TagListInput label="Inclusions" values={form.inclusions} onChange={(v) => updateField("inclusions", v)} placeholder="e.g. Airport transfers" />
            <TagListInput label="Exclusions" values={form.exclusions} onChange={(v) => updateField("exclusions", v)} placeholder="e.g. International flights" />
          </div>

          <StartDatesEditor dates={form.startDates} onChange={(v) => updateField("startDates", v)} />

          <div className="tf-field">
            <label className="tf-label">Meeting point</label>
            <div className="tf-grid-3">
              <input type="text" className="tf-input" placeholder="Address" value={form.meetingPoint.address} onChange={(e) => updateMeetingPoint("address", e.target.value)} />
              <input type="number" step="any" className="tf-input" placeholder="Latitude" value={form.meetingPoint.latitude} onChange={(e) => updateMeetingPoint("latitude", e.target.value)} />
              <input type="number" step="any" className="tf-input" placeholder="Longitude" value={form.meetingPoint.longitude} onChange={(e) => updateMeetingPoint("longitude", e.target.value)} />
            </div>
          </div>

          <label className="tf-checkbox-row">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField("isFeatured", e.target.checked)} />
            Feature this tour on the homepage
          </label>

          <div className="tf-modal-footer">
            <button type="button" className="tf-btn tf-btn--secondary" onClick={() => onClose(false)} disabled={actionLoading}>Cancel</button>
            <button type="submit" className="tf-btn tf-btn--primary" disabled={actionLoading}>
              {actionLoading ? "Saving…" : isEditMode ? "Save changes" : "Create tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}