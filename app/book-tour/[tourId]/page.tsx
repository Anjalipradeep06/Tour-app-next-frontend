"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import {
    FaCalendarAlt,
    FaUsers,
    FaCreditCard,
    FaShieldAlt,
    FaBolt,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import { toast } from "react-toastify";

import { createBooking, checkAvailability } from "@/redux/thunks/bookingThunk";
import { getTourById } from "@/redux/thunks/tourThunk";
import { resetBookingState } from "@/redux/slices/bookingSlice";

const toDateKey = (d: any) => {
    const date = d instanceof Date ? d : new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function BookingRequest() {
    const params = useParams();
    const tourId = params.tourId as string;

    const dispatch = useDispatch();
    const router = useRouter();

    const { loading, error, success, selectedBooking, availability } = useSelector(
        (state: any) => state.booking
    );

    const { selectedTour: tour } = useSelector((state: any) => state.tours);

    const [formData, setFormData] = useState({
        bookingDate: "",
        participants: 1,
        specialRequirements: "",
        paymentMethod: "stripe",
    });

    const [formError, setFormError] = useState("");
    const [dateNotAvailable, setDateNotAvailable] = useState(false);

    const today = useMemo(() => new Date(), []);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const [calendarOpen, setCalendarOpen] = useState(false);
    const calendarWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!calendarOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target as Node)) {
                setCalendarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [calendarOpen]);

    useEffect(() => {
        if (tourId) {
            dispatch(getTourById(tourId) as any);
        }
    }, [dispatch, tourId]);

    useEffect(() => {
        if (!tourId || !formData.bookingDate || !formData.participants) return;

        dispatch(
            checkAvailability({
                tourId,
                date: formData.bookingDate,
                participants: formData.participants,
            }) as any
        );
    }, [dispatch, tourId, formData.bookingDate, formData.participants]);

    useEffect(() => {
        if (success && selectedBooking?._id) {
            toast.success("Booking reserved! Redirecting...");

            const id = selectedBooking._id;

            const timer = setTimeout(() => {
                dispatch(resetBookingState());
                router.push(`/bookings/${id}`);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [success, selectedBooking, router, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "participants" ? Number(value) : value,
        }));

        if (formError) setFormError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.bookingDate) {
            return setFormError("Please select a departure date.");
        }

        if (dateNotAvailable) {
            return setFormError("Please choose a valid departure date.");
        }

        if (availability && !availability.isAvailable) {
            return toast.error("Selected tour is not available for the requested travelers.");
        }

        dispatch(createBooking({ tourId, ...formData }) as any);
    };

    const getEndDate = (startDateStr: string, durationDays: number) => {
        if (!startDateStr || !durationDays) return null;

        const start = new Date(startDateStr);
        const end = new Date(start);
        end.setDate(start.getDate() + (durationDays - 1));

        return end;
    };

    const formatDisplayDate = (date: Date | null) =>
        date
            ? date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            : null;

    const selectedEndDate = getEndDate(formData.bookingDate, tour?.duration);

    const availableStartDates = useMemo(() => tour?.startDates || [], [tour?.startDates]);

    const validStartDateKeys = useMemo(() => {
        const set = new Set<string>();
        availableStartDates.forEach((d: any) => set.add(toDateKey(d)));
        return set;
    }, [availableStartDates]);

    const totalAmount = (tour?.price || 0) * formData.participants;

    const calendarCells = useMemo(() => {
        const firstOfMonth = new Date(viewYear, viewMonth, 1);
        const startWeekday = firstOfMonth.getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

        const cells: (Date | null)[] = [];

        for (let i = 0; i < startWeekday; i++) {
            cells.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            cells.push(new Date(viewYear, viewMonth, day));
        }

        return cells;
    }, [viewYear, viewMonth]);

    const goToPrevMonth = () => {
        setViewMonth((prev) => {
            if (prev === 0) {
                setViewYear((y) => y - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const goToNextMonth = () => {
        setViewMonth((prev) => {
            if (prev === 11) {
                setViewYear((y) => y + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    const isInSelectedRange = (date: Date) => {
        if (!formData.bookingDate || !selectedEndDate || dateNotAvailable) {
            return false;
        }

        const dayKey = toDateKey(date);
        const startKey = toDateKey(formData.bookingDate);
        const endKey = toDateKey(selectedEndDate);

        return dayKey >= startKey && dayKey <= endKey;
    };

    const isPastDate = (date: Date) => {
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return date < startOfToday;
    };

    const handleDayClick = (date: Date) => {
        if (isPastDate(date)) return;

        const dayKey = toDateKey(date);

        if (formError) setFormError("");

        if (!validStartDateKeys.has(dayKey)) {
            setDateNotAvailable(true);
            setFormData((prev) => ({ ...prev, bookingDate: "" }));
            return;
        }

        setDateNotAvailable(false);
        setFormData((prev) => ({ ...prev, bookingDate: dayKey }));
    };

    const isViewingCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    return (
        <div className="min-h-screen bg-[#f5f7fa] pt-[120px] px-5 pb-[60px] max-md:pt-[100px] max-md:px-4 max-md:pb-10">
            <div className="max-w-[1280px] mx-auto">
                <div className="mb-8">
                    <Link href={`/tour/${tourId}`} className="text-[#006ce4] no-underline font-semibold">
                        ← Back to experience
                    </Link>
                    <h1 className="mt-3 text-[2.4rem] text-gray-900 max-md:text-[2rem]">Complete your booking</h1>
                </div>

                <div className="grid grid-cols-[1.8fr_420px] gap-8 max-[992px]:grid-cols-1">
                    {/* LEFT */}
                    <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-9 max-md:p-6">
                        <h2 className="mb-7 text-gray-900">Traveler details</h2>

                        {formError && (
                            <div className="p-3.5 px-4 rounded-xl mb-5 bg-[#fef2f2] text-[#b42318]">{formError}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="flex items-center gap-2.5 font-semibold text-gray-700 mb-2.5">
                                    <FaCalendarAlt className="text-[#006ce4]" />
                                    Departure date
                                </label>

                                <div className="relative mt-2" ref={calendarWrapperRef}>
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between py-3 px-3.5 border border-[#d9d9d9] rounded-[10px] bg-white cursor-pointer text-[0.95rem] text-left transition-colors duration-150 hover:border-[#C9A669]"
                                        onClick={() => setCalendarOpen((prev) => !prev)}
                                    >
                                        <span
                                            className={
                                                formData.bookingDate && !dateNotAvailable
                                                    ? "text-[#1a1a1a] font-semibold"
                                                    : "text-[#9a9a9a]"
                                            }
                                        >
                                            {formData.bookingDate && !dateNotAvailable
                                                ? formatDisplayDate(new Date(formData.bookingDate))
                                                : "Select departure date"}
                                        </span>
                                        <FaCalendarAlt className="text-[#C9A669] flex-shrink-0" />
                                    </button>

                                    {calendarOpen && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 z-30 w-full min-w-[320px] border border-[#e4e4e4] rounded-xl p-3.5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                                            <div className="flex items-center justify-between mb-2.5">
                                                <button
                                                    type="button"
                                                    className="bg-transparent border border-[#e0e0e0] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-[#555] transition-all duration-150 hover:enabled:border-[#C9A669] hover:enabled:text-[#C9A669] disabled:opacity-35 disabled:cursor-not-allowed"
                                                    onClick={goToPrevMonth}
                                                    disabled={isViewingCurrentMonth}
                                                    aria-label="Previous month"
                                                >
                                                    <FaChevronLeft />
                                                </button>

                                                <span className="font-semibold text-[0.95rem] text-[#1a1a1a]">
                                                    {MONTH_NAMES[viewMonth]} {viewYear}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="bg-transparent border border-[#e0e0e0] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-[#555] transition-all duration-150 hover:border-[#C9A669] hover:text-[#C9A669]"
                                                    onClick={goToNextMonth}
                                                    aria-label="Next month"
                                                >
                                                    <FaChevronRight />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-7 text-center text-[0.75rem] text-[#999] mb-1">
                                                {WEEKDAY_LABELS.map((label, idx) => (
                                                    <span key={`${label}-${idx}`}>{label}</span>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7 gap-1">
                                                {calendarCells.map((date, idx) => {
                                                    if (!date) {
                                                        return <div key={`blank-${idx}`} className="h-[38px] cursor-default" />;
                                                    }

                                                    const dayKey = toDateKey(date);
                                                    const isValidStart = validStartDateKeys.has(dayKey);
                                                    const isSelectedStart =
                                                        formData.bookingDate && dayKey === toDateKey(formData.bookingDate);
                                                    const inRange = isInSelectedRange(date);
                                                    const past = isPastDate(date);

                                                    let cellClass =
                                                        "relative border-none rounded-lg h-[38px] flex items-center justify-center cursor-pointer text-[0.85rem] transition-colors duration-150";

                                                    const bgClass = isSelectedStart
                                                        ? "!bg-[#C9A669] !text-white font-bold"
                                                        : inRange
                                                            ? "bg-[#f5e8cc] text-[#4a3a1a] rounded-none"
                                                            : "bg-transparent text-[#333]";

                                                    cellClass += ` ${bgClass}`;

                                                    if (!past) cellClass += " hover:bg-[#f5f0e6]";
                                                    if (past) cellClass += " text-[#ccc] cursor-not-allowed";
                                                    if (inRange && isSelectedStart) cellClass += " !rounded-l-lg !rounded-r-none";

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={dayKey}
                                                            className={cellClass}
                                                            disabled={past}
                                                            onClick={() => handleDayClick(date)}
                                                        >
                                                            <span>{date.getDate()}</span>

                                                            {isValidStart && (
                                                                <span
                                                                    className={`absolute bottom-1 w-[5px] h-[5px] rounded-full ${isSelectedStart ? "bg-white" : "bg-[#C9A669]"
                                                                        }`}
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex gap-4 mt-3 text-[0.75rem] text-[#777]">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <i className="w-1.5 h-1.5 rounded-full bg-[#C9A669] inline-block" /> Departure available
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <i className="w-3 h-3 rounded-[3px] bg-[#f5e8cc] inline-block" /> Package days
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {dateNotAvailable && (
                                    <p className="mt-1.5 text-[0.9rem] text-[#c0392b]">
                                        No booking available for this date. Please pick a date marked with a dot above.
                                    </p>
                                )}

                                {availableStartDates.length === 0 && (
                                    <p className="mt-1.5 text-[0.9rem] text-[#c0392b]">
                                        No upcoming departure dates available for this tour.
                                    </p>
                                )}

                                {formData.bookingDate && tour?.duration && !dateNotAvailable && (
                                    <p className="mt-1.5 text-[0.85rem] text-[#666]">
                                        {tour.duration}-day trip: {formatDisplayDate(new Date(formData.bookingDate))} →{" "}
                                        {formatDisplayDate(selectedEndDate)}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center gap-2.5 font-semibold text-gray-700 mb-2.5">
                                    <FaUsers className="text-[#006ce4]" />
                                    Number of travelers
                                </label>

                                <input
                                    type="number"
                                    name="participants"
                                    min="1"
                                    max={tour?.availableSlots || 20}
                                    value={formData.participants}
                                    onChange={handleChange}
                                    className="w-full py-[15px] px-4 border border-gray-300 rounded-xl text-[15px] text-gray-900 transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
                                />
                            </div>

                            {availability && !dateNotAvailable && (
                                <div
                                    className="mb-5 p-4 rounded-[10px] text-gray-900"
                                    style={{
                                        background: availability.isAvailable ? "#eafaf1" : "#fff1f0",
                                        border: availability.isAvailable ? "1px solid #52c41a" : "1px solid #ff4d4f",
                                    }}
                                >
                                    <strong>{availability.isAvailable ? "✅ Tour Available" : "❌ Not Available"}</strong>

                                    <p className="mt-2 text-gray-900">Remaining Slots: {availability.remainingSlots}</p>

                                    {!availability.isAvailable && <p className="text-gray-900">Requested: {availability.requested}</p>}
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="flex items-center gap-2.5 font-semibold text-gray-700 mb-2.5">
                                    <FaCreditCard className="text-[#006ce4]" />
                                    Payment method
                                </label>

                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full py-[15px] px-4 border border-gray-300 rounded-xl text-[15px] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
                                >
                                    <option value="stripe">Pay online (Stripe)</option>
                                    <option value="cod">Pay later</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center gap-2.5 font-semibold text-gray-700 mb-2.5">
                                    Special requirements
                                </label>

                                <textarea
                                    name="specialRequirements"
                                    rows={5}
                                    value={formData.specialRequirements}
                                    onChange={handleChange}
                                    placeholder="Dietary needs, accessibility requests, pickup details..."
                                    className="w-full py-[15px] px-4 border border-gray-300 rounded-xl text-[15px] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    loading?.action ||
                                    success ||
                                    !formData.bookingDate ||
                                    dateNotAvailable ||
                                    (availability && !availability.isAvailable)
                                }
                                className="w-full py-4 border-none rounded-2xl bg-[#006ce4] text-white text-base font-bold cursor-pointer transition-colors duration-200 hover:bg-[#0057b8] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {success
                                    ? "Reserved ✓"
                                    : loading?.action
                                        ? "Reserving..."
                                        : availability && !availability.isAvailable
                                            ? "Unavailable"
                                            : "Reserve now"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT */}
                    <aside className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(15,23,42,0.08)] sticky top-[100px] h-fit overflow-hidden max-[992px]:static">
                        {tour && (
                            <>
                                <img
                                    src={
                                        tour.destination?.bannerImage ||
                                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                                    }
                                    alt={tour.title}
                                    className="w-full h-60 object-cover"
                                />

                                <div className="p-6">
                                    <h3 className="text-gray-900 mb-3.5">{tour.title}</h3>

                                    <p className="text-[1.7rem] font-bold text-gray-900 mb-6">
                                        ₹{Number(tour.price).toLocaleString("en-IN")}
                                        <span className="text-[0.95rem] text-gray-500 font-normal"> / traveler</span>
                                    </p>

                                    <div className="flex justify-between mb-4 text-gray-600">
                                        <span>Travelers</span>
                                        <strong>{formData.participants}</strong>
                                    </div>

                                    <div className="flex justify-between mb-4 text-gray-600">
                                        <span>Duration</span>
                                        <strong>{tour.duration} days</strong>
                                    </div>

                                    {formData.bookingDate && selectedEndDate && !dateNotAvailable && (
                                        <div className="flex justify-between mb-4 text-gray-600">
                                            <span>Dates</span>
                                            <strong>
                                                {formatDisplayDate(new Date(formData.bookingDate))} – {formatDisplayDate(selectedEndDate)}
                                            </strong>
                                        </div>
                                    )}

                                    <div className="flex justify-between mt-5 pt-5 border-t border-gray-200 text-[1.1rem] text-gray-900">
                                        <span>Total</span>
                                        <strong>₹{Number(totalAmount).toLocaleString("en-IN")}</strong>
                                    </div>

                                    <div className="mt-7 flex flex-col gap-3.5">
                                        <div className="flex items-center gap-2.5 text-gray-600 text-[0.95rem]">
                                            <FaShieldAlt className="text-[#16a34a]" />
                                            Secure booking
                                        </div>
                                        <div className="flex items-center gap-2.5 text-gray-600 text-[0.95rem]">
                                            <FaBolt className="text-[#16a34a]" />
                                            Instant confirmation
                                        </div>
                                        <div className="flex items-center gap-2.5 text-gray-600 text-[0.95rem]">
                                            <FaCheckCircle className="text-[#16a34a]" />
                                            Free cancellation*
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}