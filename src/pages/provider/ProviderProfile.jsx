import { useState } from 'react';
import ProviderLayout from '../../layouts/ProviderLayout';
import {
  getProviderByUserId,
  getUserById,
  getBookingsByProviderId,
} from '../../data/mockData';

// ---------------------------------------------------------------------------
// Demo identity — PRV-7001 / USR-2001 / Suresh Kumar
// ---------------------------------------------------------------------------
const DEMO_USER_ID     = 'USR-2001';
const DEMO_PROVIDER_ID = 'PRV-7001';

// ---- helpers ---------------------------------------------------------------
function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

function InfoRow({ label, value }) {
  return (
    <div className="profile-info-row">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value || '—'}</span>
    </div>
  );
}

// ---- Sub-component: read-only display --------------------------------------
function ProfileView({ user, provider, stats, onEdit }) {
  return (
    <>
      {/* Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-circle">
            {getInitials(user.name)}
          </div>
          <div className={`profile-status-dot ${provider.status === 'active' ? 'dot-active' : 'dot-inactive'}`} />
        </div>
        <div className="profile-header-text">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-role-badge">Service Provider</p>
          <p className="profile-id-tag">{provider.id}</p>
        </div>
        <button className="button button-solid profile-edit-btn" onClick={onEdit}>
          Edit Profile
        </button>
      </div>

      {/* 3-stat row */}
      <div className="profile-stat-row">
        <div className="profile-stat-cell">
          <span className="profile-stat-num">{stats.total}</span>
          <span className="profile-stat-label">Total Jobs</span>
        </div>
        <div className="profile-stat-cell">
          <span className="profile-stat-num clr-mint">{stats.completed}</span>
          <span className="profile-stat-label">Completed</span>
        </div>
        <div className="profile-stat-cell">
          <span className="profile-stat-num">{stats.upcoming}</span>
          <span className="profile-stat-label">Upcoming</span>
        </div>
      </div>

      <div className="profile-body-grid">
        {/* Contact & Account info */}
        <div className="profile-info-card">
          <p className="dash-panel-title">Personal &amp; Contact</p>
          <div className="profile-info-list">
            <InfoRow label="Full Name"    value={user.name} />
            <InfoRow label="Email"        value={user.email} />
            <InfoRow label="Phone"        value={user.phone} />
            <InfoRow label="Base Location" value={user.address} />
            <InfoRow label="Member Since" value={user.joinedOn} />
          </div>
        </div>

        {/* Account status + specialties */}
        <div className="profile-right-col">
          <div className="profile-info-card">
            <p className="dash-panel-title">Account Status</p>
            <div className="profile-status-display">
              <span className={`status-badge ${
                provider.status === 'active'   ? 'status-confirmed' :
                provider.status === 'on-leave' ? 'status-pending' :
                'status-cancelled'
              }`}>
                {provider.status === 'active'   ? '🟢 Active' :
                 provider.status === 'on-leave' ? '🟡 On Leave' : '⚪ Inactive'}
              </span>
              <p className="profile-info-label" style={{ marginTop: 10 }}>
                Account is managed by SmartWash Admin. For changes contact support.
              </p>
            </div>
          </div>

          <div className="profile-info-card">
            <p className="dash-panel-title">Service Specialties</p>
            <p className="profile-info-label" style={{ marginBottom: 12 }}>
              Assigned and managed by Admin · View only
            </p>
            <div className="avail2-tags">
              {provider.serviceTypes?.map(t => (
                <span key={t} className="avail2-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Sub-component: edit mode ----------------------------------------------
function ProfileEdit({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    name:  user.name,
    email: user.email,
    phone: user.phone,
  });

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <div className="profile-edit-shell">
      <div className="profile-edit-header">
        <h3 className="avail2-section-title" style={{ fontSize: 16 }}>Edit Profile</h3>
        <p className="avail2-section-sub">Update your contact details below. Other information is managed by Admin.</p>
      </div>

      <div className="profile-edit-form">
        <div className="profile-field">
          <label className="profile-field-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handle}
            className="profile-field-input"
          />
        </div>
        <div className="profile-field">
          <label className="profile-field-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handle}
            className="profile-field-input"
          />
        </div>
        <div className="profile-field">
          <label className="profile-field-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handle}
            className="profile-field-input"
          />
        </div>
      </div>

      <div className="profile-edit-actions">
        <button
          type="button"
          className="button button-outline"
          style={{ border: '1px solid #e2ded6' }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="button button-solid"
          onClick={() => onSave(form)}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ---- Main page content -----------------------------------------------------
function ProfileContent() {
  const providerRecord = getProviderByUserId(DEMO_USER_ID);
  const [userData, setUserData]   = useState(getUserById(DEMO_USER_ID));
  const [editing, setEditing]     = useState(false);
  const [saved, setSaved]         = useState(false);

  // Calculate stats from bookings data
  const allJobs       = getBookingsByProviderId(DEMO_PROVIDER_ID);
  const stats = {
    total:     allJobs.length,
    completed: allJobs.filter(b => b.status === 'completed').length,
    upcoming:  allJobs.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
  };

  function handleSave(form) {
    setUserData(prev => ({ ...prev, ...form }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      {saved && (
        <div className="avail-toast">
          <span className="avail-toast-icon">✓</span>
          Profile updated successfully!
        </div>
      )}

      {editing ? (
        <ProfileEdit
          user={userData}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ProfileView
          user={userData}
          provider={providerRecord}
          stats={stats}
          onEdit={() => setEditing(true)}
        />
      )}
    </>
  );
}

// ---- Page export -----------------------------------------------------------
export default function ProviderProfile() {
  return (
    <ProviderLayout title="My Profile">
      <ProfileContent />
    </ProviderLayout>
  );
}
