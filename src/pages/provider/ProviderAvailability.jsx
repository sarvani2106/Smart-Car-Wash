import { useState, useEffect } from 'react';
import ProviderLayout from '../../layouts/ProviderLayout';
import { getProviderByUserId, getUserById } from '../../data/mockData';

// ---------------------------------------------------------------------------
// Demo identity — matches PRV-7001 / Suresh Kumar in mockData.js
// ---------------------------------------------------------------------------
const DEMO_USER_ID = 'USR-2001';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

// Standard time slots aligned with what mockData uses
const STANDARD_SLOTS = [
  '08:00 AM - 10:00 AM',
  '09:00 AM - 11:00 AM',
  '10:00 AM - 12:00 PM',
  '11:30 AM - 01:30 PM',
  '02:00 PM - 04:00 PM',
  '03:00 PM - 05:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

// ----- Sub-components -------------------------------------------------------

function ToggleSwitch({ on, onToggle }) {
  return (
    <button
      type="button"
      className={`avail-toggle-switch ${on ? 'toggle-on' : 'toggle-off'}`}
      onClick={onToggle}
      aria-label={on ? 'Set offline' : 'Set online'}
    >
      <span className="avail-toggle-knob" />
    </button>
  );
}

function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className="avail-toast">
      <span className="avail-toast-icon">✓</span>
      {message}
    </div>
  );
}

// ----- Main page content ----------------------------------------------------

function AvailabilityContent() {
  const providerRecord = getProviderByUserId(DEMO_USER_ID);
  const userRecord     = getUserById(DEMO_USER_ID);

  const [isActive,      setIsActive]      = useState(providerRecord?.status === 'active');
  const [selectedDays,  setSelectedDays]  = useState(providerRecord?.availability?.days  ?? []);
  const [selectedSlots, setSelectedSlots] = useState(providerRecord?.availability?.slots ?? []);
  const [toast,         setToast]         = useState({ visible: false, message: '' });

  function showToast(msg) {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }

  function handleStatusToggle() {
    const next = !isActive;
    setIsActive(next);
    showToast(next ? 'You are now Online & Available' : 'You are now Offline');
  }

  function toggleDay(day) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  function toggleSlot(slot) {
    setSelectedSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  }

  function handleSave(e) {
    e.preventDefault();
    showToast('Schedule saved successfully!');
  }

  // Build a compact weekday summary string
  const daySummary = selectedDays.length === 0
    ? 'No working days selected'
    : selectedDays.map(d => d).join(', ');

  return (
    <>
      <Toast visible={toast.visible} message={toast.message} />

      <form onSubmit={handleSave} className="avail2-root">

        {/* ── TOP STATUS BANNER ─────────────────────────────────────────── */}
        <div className={`avail2-status-banner ${isActive ? 'banner-online' : 'banner-offline'}`}>
          <div className="avail2-status-left">
            <div className={`avail2-pulse ${isActive ? 'pulse-green' : 'pulse-grey'}`} />
            <div>
              <h2 className="avail2-status-headline">
                {isActive ? 'Online & Available' : 'Offline / On Leave'}
              </h2>
              <p className="avail2-status-sub">
                {isActive
                  ? `Accepting bookings · ${selectedDays.length} day${selectedDays.length !== 1 ? 's' : ''} · ${selectedSlots.length} slot${selectedSlots.length !== 1 ? 's' : ''} active`
                  : 'No new bookings will be assigned while offline.'}
              </p>
            </div>
          </div>
          <div className="avail2-status-right">
            <span className="avail2-toggle-label">{isActive ? 'Online' : 'Offline'}</span>
            <ToggleSwitch on={isActive} onToggle={handleStatusToggle} />
          </div>
        </div>

        {/* ── MAIN BODY GRID ─────────────────────────────────────────────── */}
        <div className="avail2-body">

          {/* Left column: Days + Slots */}
          <div className="avail2-main-col">

            {/* Working Days */}
            <div className="avail2-section-card">
              <div className="avail2-section-header">
                <div>
                  <h3 className="avail2-section-title">Working Days</h3>
                  <p className="avail2-section-sub">Select the days you are available for service</p>
                </div>
                <span className="avail2-badge">{selectedDays.length} / {ALL_DAYS.length} days</span>
              </div>

              <div className="avail2-days-grid">
                {ALL_DAYS.map(day => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`avail2-day-chip ${active ? 'day-chip-on' : 'day-chip-off'}`}
                      onClick={() => toggleDay(day)}
                    >
                      <span className="avail2-day-abbr">{day}</span>
                      <span className="avail2-day-full">{DAY_LABELS[day]}</span>
                      {active && <span className="avail2-day-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="avail2-section-card">
              <div className="avail2-section-header">
                <div>
                  <h3 className="avail2-section-title">Available Time Slots</h3>
                  <p className="avail2-section-sub">Choose which shifts you can take on working days</p>
                </div>
                <span className="avail2-badge">{selectedSlots.length} selected</span>
              </div>

              <div className="avail2-slots-grid">
                {STANDARD_SLOTS.map(slot => {
                  const active = selectedSlots.includes(slot);
                  // Derive a short period label
                  const hour = parseInt(slot.split(':')[0], 10);
                  const period = hour < 12 ? 'Morning' : hour < 15 ? 'Afternoon' : hour < 18 ? 'Evening' : 'Night';
                  return (
                    <label
                      key={slot}
                      className={`avail2-slot-card ${active ? 'slot-card-on' : 'slot-card-off'}`}
                    >
                      <input
                        type="checkbox"
                        className="avail2-hidden-check"
                        checked={active}
                        onChange={() => toggleSlot(slot)}
                      />
                      <div className="avail2-slot-period">{period}</div>
                      <div className="avail2-slot-time">{slot}</div>
                      <div className={`avail2-slot-dot ${active ? 'slot-dot-on' : 'slot-dot-off'}`} />
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right column: Summary + Specialties + Save */}
          <div className="avail2-side-col">

            {/* Weekly Summary */}
            <div className="avail2-section-card avail2-summary-card">
              <h3 className="avail2-section-title" style={{ marginBottom: '16px' }}>Weekly Overview</h3>
              <div className="avail2-week-grid">
                {ALL_DAYS.map(day => {
                  const on = selectedDays.includes(day);
                  return (
                    <div key={day} className={`avail2-week-cell ${on ? 'week-cell-on' : 'week-cell-off'}`}>
                      <span className="avail2-week-day-label">{day}</span>
                      {on ? <span className="avail2-week-open">Open</span> : <span className="avail2-week-closed">Off</span>}
                    </div>
                  );
                })}
              </div>

              <div className="avail2-summary-stats">
                <div className="avail2-stat">
                  <span className="avail2-stat-num">{selectedDays.length}</span>
                  <span className="avail2-stat-label">Working days</span>
                </div>
                <div className="avail2-stat">
                  <span className="avail2-stat-num">{selectedSlots.length}</span>
                  <span className="avail2-stat-label">Active slots</span>
                </div>
              </div>
            </div>

            {/* Service Specialties (read-only, managed by Admin) */}
            <div className="avail2-section-card">
              <h3 className="avail2-section-title">Service Specialties</h3>
              <p className="avail2-section-sub" style={{ marginBottom: '12px' }}>
                Assigned by Admin · View only
              </p>
              <div className="avail2-tags">
                {providerRecord?.serviceTypes?.map(t => (
                  <span key={t} className="avail2-tag">{t}</span>
                )) ?? <span className="avail2-section-sub">None assigned</span>}
              </div>
            </div>

            {/* Save CTA */}
            <div className="avail2-save-card">
              <p className="avail2-save-hint">
                Changes to your schedule apply immediately for future bookings.
              </p>
              <button
                type="submit"
                className="button button-solid avail2-save-btn"
              >
                Save Schedule
              </button>
            </div>

          </div>
        </div>
      </form>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function ProviderAvailability() {
  return (
    <ProviderLayout title="Availability">
      <AvailabilityContent />
    </ProviderLayout>
  );
}
