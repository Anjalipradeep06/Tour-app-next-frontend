"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getNames } from "country-list";

import { createDestination, updateDestination } from "@/redux/thunks/destinationThunk";
import { resetDestinationActionState } from "@/redux/slices/destinationSlice";
import TagListInput from "./TagListInput";

import "./TourFormModal.css";

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"];
const COUNTRIES = getNames().sort();

const emptyForm = {
  name: "", country: "", continent: "", description: "",
  activities: [], latitude: "", longitude: "",
  isFeatured: false, isPopular: false,
};

type Props = { destination?: any; onClose: () => void };

export default function DestinationFormModal({ destination, onClose }: Props) {
  const dispatch = useDispatch();
  const isEditMode = Boolean(destination);

  const { actionLoading, actionError, actionSuccess, actionMessage } = useSelector(
    (state: any) => state.destinations
  );

  const [form, setForm] = useState(emptyForm);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) return;
    setForm({
      name: destination.name || "",
      country: destination.country || "",
      continent: destination.continent || "",
      description: destination.description || "",
      activities: destination.activities || [],
      latitude: destination.latitude || "",
      longitude: destination.longitude || "",
      isFeatured: destination.isFeatured || false,
      isPopular: destination.isPopular || false,
    });
    setBannerPreview(destination.bannerImage);
  }, [destination]);

  useEffect(() => {
    if (actionSuccess) {
      toast.success(actionMessage || (isEditMode ? "Destination updated successfully" : "Destination created successfully"));
      dispatch(resetDestinationActionState());
      onClose();
    }
  }, [actionSuccess, actionMessage, dispatch, onClose, isEditMode]);

  useEffect(() => {
    if (actionError) toast.error(actionError);
  }, [actionError]);

  const setField = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerImage(file);
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setGalleryImages(Array.from(e.target.files || []));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) };
    if (bannerImage) payload.bannerImage = bannerImage;
    if (galleryImages.length > 0) payload.galleryImages = galleryImages;

    if (isEditMode) {
      dispatch(updateDestination({ id: destination._id, destinationData: payload }) as any);
    } else {
      dispatch(createDestination({ ...payload, bannerImage, galleryImages }) as any);
    }
  };

  return (
    <div className="tf-overlay" role="dialog" aria-modal="true">
      <div className="tf-modal">
        <div className="tf-modal-header">
          <h2>{isEditMode ? "Edit Destination" : "Create Destination"}</h2>
          <button className="tf-close-btn" onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="tf-form">
          {actionError && <div className="tf-error">{actionError}</div>}

          <div className="tf-grid">
            <div className="tf-field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            </div>
            <div className="tf-field">
              <label>Country</label>
              <select value={form.country} onChange={(e) => setField("country", e.target.value)} required>
                <option value="" disabled>Select Country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="tf-field">
              <label>Continent</label>
              <select value={form.continent} onChange={(e) => setField("continent", e.target.value)} required>
                <option value="" disabled>Select continent</option>
                {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="tf-field">
              <label>Rating handled by reviews</label>
            </div>
            <div className="tf-field">
              <label>Latitude</label>
              <input type="number" step="any" value={form.latitude} onChange={(e) => setField("latitude", e.target.value)} required />
            </div>
            <div className="tf-field">
              <label>Longitude</label>
              <input type="number" step="any" value={form.longitude} onChange={(e) => setField("longitude", e.target.value)} required />
            </div>
          </div>

          <div className="tf-field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} required />
          </div>

          <TagListInput
            values={form.activities}
            onChange={(activities) => setField("activities", activities)}
            placeholder="Hiking, Heritage Walks, Safari..."
            label="Activities"
          />

          <div className="tf-grid">
            <div className="tf-field">
              <label>Banner Image</label>
              <input type="file" accept="image/*" onChange={handleBannerChange} required={!isEditMode} />
              {bannerPreview && <img src={bannerPreview} alt="Banner Preview" className="tf-image-preview" />}
            </div>
            <div className="tf-field">
              <label>Gallery Images</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
              {galleryImages.length > 0 && <span className="tf-file-count">{galleryImages.length} file(s) selected</span>}
              {isEditMode && destination?.galleryImages?.length > 0 && (
                <span className="tf-file-count">Existing: {destination.galleryImages.length} image(s)</span>
              )}
            </div>
          </div>

          <div className="tf-grid">
            <label className="tf-checkbox-row">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField("isFeatured", e.target.checked)} />
              Featured
            </label>
            <label className="tf-checkbox-row">
              <input type="checkbox" checked={form.isPopular} onChange={(e) => setField("isPopular", e.target.checked)} />
              Popular
            </label>
          </div>

          <div className="tf-modal-footer">
            <button type="button" className="tf-btn tf-btn--secondary" onClick={onClose} disabled={actionLoading}>Cancel</button>
            <button type="submit" className="tf-btn tf-btn--primary" disabled={actionLoading}>
              {actionLoading ? "Saving..." : isEditMode ? "Update Destination" : "Create Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}