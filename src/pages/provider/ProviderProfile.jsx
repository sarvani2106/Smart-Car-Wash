import { useState } from 'react';
import ProviderLayout from '../../layouts/ProviderLayout';
import {
  getProviderByUserId,
  getUserById,
  getBookingsByProviderId,
  getProposalsByProviderId,
} from '../../data/mockData';

// ---------------------------------------------------------------------------
// Demo identity — PRV-7001 / USR-2001 / Suresh Kumar
// ---------------------------------------------------------------------------
const DEMO_USER_ID     = 'USR-2001';
const DEMO_PROVIDER_ID = 'PRV-7001';

const SERVICE_CATEGORIES = [
  'Exterior', 'Interior', 'Combo', 'Detailing', 'Coating', 'Add-on',
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function formatDate(dateStr = '') {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:       { label: 'Pending Review', cls: 'svc-status-pending'  },
  approved:      { label: 'Approved',       cls: 'svc-status-approved' },
  'price-revised': { label: 'Price Revised', cls: 'svc-status-revised' },
  rejected:      { label: 'Rejected',       cls: 'svc-status-rejected' },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return <span className={`svc-status-badge ${cfg.cls}`}>{cfg.label}</span>;
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="prf-contact-row">
      <span className="prf-contact-icon">{icon}</span>
      <div className="prf-contact-detail">
        <span className="prf-contact-label">{label}</span>
        <span className="prf-contact-value">{value || '—'}</span>
      </div>
    </div>
  );
}

// ── Profile Header Banner ────────────────────────────────────────────────────
function ProfileHeader({ user, provider, onEdit }) {
  const statusLabel =
    provider.status === 'active'   ? 'Active' :
    provider.status === 'on-leave' ? 'On Leave' : 'Inactive';
  const statusCls =
    provider.status === 'active'   ? 'prf-account-status--active' :
    provider.status === 'on-leave' ? 'prf-account-status--leave' :
                                     'prf-account-status--inactive';

  // Extract base location city from address string
  const locationCity = user.address?.replace('Base Hub: ', '') || user.address;

  return (
    <div className="prf-banner">
      {/* Decorative bg circles */}
      <div className="prf-banner-deco prf-banner-deco--1" />
      <div className="prf-banner-deco prf-banner-deco--2" />

      <div className="prf-banner-inner">
        {/* Avatar */}
        <div className="prf-banner-avatar-wrap">
          <div className="prf-banner-avatar">
            {getInitials(user.name)}
          </div>
          <div className={`prf-banner-status-ring ${provider.status === 'active' ? 'ring-active' : 'ring-inactive'}`} />
        </div>

        {/* Identity */}
        <div className="prf-banner-identity">
          <div className="prf-banner-eyebrow">Verified Service Provider</div>
          <h2 className="prf-banner-name">{user.name}</h2>

          <div className="prf-banner-meta-row">
            <span className="prf-banner-chip">
              <span className="prf-chip-icon">🪪</span>
              {provider.id}
            </span>
            <span className="prf-banner-chip">
              <span className="prf-chip-icon">📍</span>
              {locationCity}
            </span>
            <span className={`prf-banner-chip prf-account-status ${statusCls}`}>
              {provider.status === 'active' ? '●' : '○'} {statusLabel}
            </span>
          </div>
        </div>

        {/* Edit button */}
        <button className="prf-banner-edit-btn" onClick={onEdit}>
          ✎ Edit Profile
        </button>
      </div>
    </div>
  );
}

// ── Performance Stats ────────────────────────────────────────────────────────
function PerformanceStats({ stats }) {
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const cards = [
    { icon: '📋', label: 'Total Jobs',       value: stats.total,     hint: 'All-time assignments',    color: '' },
    { icon: '✅', label: 'Completed',         value: stats.completed, hint: 'Successfully finished',   color: 'clr-mint' },
    { icon: '🕐', label: 'Upcoming Jobs',     value: stats.upcoming,  hint: 'Scheduled / confirmed',   color: '' },
    { icon: '📈', label: 'Completion Rate',   value: `${completionRate}%`, hint: 'Jobs completed on time', color: completionRate >= 80 ? 'clr-mint' : '' },
  ];

  return (
    <div className="prf-stats-grid">
      {cards.map(c => (
        <div key={c.label} className="prf-stat-card">
          <span className="prf-stat-icon">{c.icon}</span>
          <span className={`prf-stat-number ${c.color}`}>{c.value}</span>
          <span className="prf-stat-label">{c.label}</span>
          <span className="prf-stat-hint">{c.hint}</span>
        </div>
      ))}
    </div>
  );
}

// ── Personal & Account Info ──────────────────────────────────────────────────
function InfoSection({ user, provider }) {
  const statusLabel =
    provider.status === 'active'   ? '🟢 Active' :
    provider.status === 'on-leave' ? '🟡 On Leave' : '⚪ Inactive';

  return (
    <div className="prf-info-row">
      {/* Personal & Contact */}
      <div className="prf-info-card">
        <div className="prf-card-header">
          <p className="dash-panel-title">Personal &amp; Contact</p>
        </div>
        <div className="prf-contact-list">
          <ContactRow icon="👤" label="Full Name"     value={user.name} />
          <ContactRow icon="✉️"  label="Email"         value={user.email} />
          <ContactRow icon="📞" label="Phone"         value={user.phone} />
          <ContactRow icon="📍" label="Base Location" value={user.address?.replace('Base Hub: ', '')} />
          <ContactRow icon="📅" label="Member Since"  value={formatDate(user.joinedOn)} />
        </div>
      </div>

      {/* Account Info */}
      <div className="prf-info-card">
        <div className="prf-card-header">
          <p className="dash-panel-title">Account Information</p>
        </div>
        <div className="prf-contact-list">
          <div className="prf-acct-status-row">
            <span className="prf-contact-label">Status</span>
            <span className={`status-badge ${
              provider.status === 'active'   ? 'status-completed' :
              provider.status === 'on-leave' ? 'status-pending' :
                                               'status-cancelled'
            }`} style={{ fontSize: 10 }}>{statusLabel}</span>
          </div>
          <ContactRow icon="🪪" label="Provider ID"     value={provider.id} />
          <ContactRow icon="✔️"  label="Verification"   value="Verified by SmartWash" />
          <ContactRow icon="📅" label="Member Since"   value={formatDate(user.joinedOn)} />
          <ContactRow icon="🔒" label="Account Access" value="Managed by Admin" />
        </div>
        <p className="prf-acct-note">
          For account changes, contact SmartWash support.
        </p>
      </div>
    </div>
  );
}

// ── Proposal Card ────────────────────────────────────────────────────────────
function ProposalCard({ proposal }) {
  return (
    <div className={`prf-proposal-card prf-proposal-card--${proposal.status}`}>
      <div className="prf-proposal-card-header">
        <div>
          <span className="prf-proposal-category">{proposal.category}</span>
          <h3 className="prf-proposal-name">{proposal.name}</h3>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      <p className="prf-proposal-desc">{proposal.description}</p>

      <div className="prf-proposal-chips">
        <span className="prf-proposal-chip">⏱ {proposal.duration} min</span>
        <span className="prf-proposal-chip">📅 {formatDate(proposal.submittedOn)}</span>
      </div>

      <div className="prf-proposal-pricing">
        <div className="prf-price-item">
          <span className="prf-price-label">Your Proposed Price</span>
          <span className="prf-price-value">₹{proposal.providerPrice}</span>
        </div>
        <div className="prf-price-divider" />
        <div className="prf-price-item">
          <span className="prf-price-label">Admin Approved Price</span>
          <span className={`prf-price-value ${
            proposal.adminApprovedPrice ? 'prf-price-approved' : 'prf-price-pending'
          }`}>
            {proposal.adminApprovedPrice ? `₹${proposal.adminApprovedPrice}` : 'Awaiting review'}
          </span>
        </div>
      </div>

      {proposal.adminNotes && (
        <div className="prf-proposal-admin-note">
          <span className="prf-admin-note-icon">💬</span>
          <span>{proposal.adminNotes}</span>
        </div>
      )}
    </div>
  );
}

// ── Propose New Service Modal ─────────────────────────────────────────────────
function ProposeServiceModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', category: SERVICE_CATEGORIES[0], description: '',
    duration: '', providerPrice: '', adminNotes: '',
  });
  const [errors, setErrors] = useState({});

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())          errs.name = 'Service name is required';
    if (!form.description.trim())   errs.description = 'Description is required';
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0)
      errs.duration = 'Enter a valid duration in minutes';
    if (!form.providerPrice || isNaN(Number(form.providerPrice)) || Number(form.providerPrice) <= 0)
      errs.providerPrice = 'Enter a valid price';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      duration: Number(form.duration),
      providerPrice: Number(form.providerPrice),
      adminNotes: form.adminNotes.trim() || null,
    });
  }

  return (
    <div className="prf-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="prf-modal">
        <div className="prf-modal-header">
          <div>
            <h3 className="prf-modal-title">Propose New Service</h3>
            <p className="prf-modal-sub">Submit a service for SmartWash admin review and pricing approval.</p>
          </div>
          <button className="prf-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="prf-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="prf-modal-grid">
            {/* Service Name */}
            <div className="prf-modal-field prf-modal-field--full">
              <label className="prf-modal-label">Service Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="e.g. Premium Car Wash"
                className={`prf-modal-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <span className="prf-modal-error">{errors.name}</span>}
            </div>

            {/* Category */}
            <div className="prf-modal-field">
              <label className="prf-modal-label">Service Category *</label>
              <select name="category" value={form.category} onChange={handle} className="prf-modal-input prf-modal-select">
                {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Duration */}
            <div className="prf-modal-field">
              <label className="prf-modal-label">Estimated Duration (mins) *</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handle}
                placeholder="e.g. 60"
                min="1"
                className={`prf-modal-input ${errors.duration ? 'input-error' : ''}`}
              />
              {errors.duration && <span className="prf-modal-error">{errors.duration}</span>}
            </div>

            {/* Description */}
            <div className="prf-modal-field prf-modal-field--full">
              <label className="prf-modal-label">Service Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handle}
                placeholder="Describe what this service includes..."
                rows={3}
                className={`prf-modal-input prf-modal-textarea ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && <span className="prf-modal-error">{errors.description}</span>}
            </div>

            {/* Proposed Price */}
            <div className="prf-modal-field">
              <label className="prf-modal-label">Proposed Price (₹) *</label>
              <input
                type="number"
                name="providerPrice"
                value={form.providerPrice}
                onChange={handle}
                placeholder="e.g. 599"
                min="1"
                className={`prf-modal-input ${errors.providerPrice ? 'input-error' : ''}`}
              />
              {errors.providerPrice && <span className="prf-modal-error">{errors.providerPrice}</span>}
            </div>

            {/* Notes */}
            <div className="prf-modal-field">
              <label className="prf-modal-label">Notes for Admin <span style={{ opacity: 0.5, fontWeight: 600 }}>(optional)</span></label>
              <input
                type="text"
                name="adminNotes"
                value={form.adminNotes}
                onChange={handle}
                placeholder="Any context for the admin..."
                className="prf-modal-input"
              />
            </div>
          </div>

          <div className="prf-modal-pricing-note">
            <span className="prf-modal-note-icon">ℹ️</span>
            <span>Final customer pricing is subject to SmartWash admin approval. The price you enter is a suggestion only.</span>
          </div>

          <div className="prf-modal-actions">
            <button type="button" className="button button-quiet" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-solid prf-modal-submit-btn">
              Submit for Approval →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Service Specialties ───────────────────────────────────────────────────────
function ServiceSpecialties({ proposals }) {
  const approved = proposals.filter(p => p.status === 'approved');
  if (approved.length === 0) return null;

  return (
    <div className="prf-specialties-section">
      <div className="prf-section-header">
        <div>
          <p className="dash-panel-title">Active Service Specialties</p>
          <p className="prf-section-sub">Services currently approved and active on the SmartWash platform.</p>
        </div>
      </div>
      <div className="prf-specialties-grid">
        {approved.map(p => (
          <div key={p.id} className="prf-specialty-chip">
            <span className="prf-specialty-check">✓</span>
            <div>
              <span className="prf-specialty-name">{p.name}</span>
              <span className="prf-specialty-cat">{p.category}</span>
            </div>
            <span className="prf-specialty-price">₹{p.adminApprovedPrice}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── My Service Proposals ──────────────────────────────────────────────────────
function ServiceProposals({ proposals, onAddNew }) {
  const [filter, setFilter] = useState('all');

  const FILTERS = [
    { key: 'all',          label: 'All' },
    { key: 'approved',     label: 'Approved' },
    { key: 'pending',      label: 'Pending' },
    { key: 'price-revised',label: 'Price Revised' },
    { key: 'rejected',     label: 'Rejected' },
  ];

  const filtered = filter === 'all'
    ? proposals
    : proposals.filter(p => p.status === filter);

  return (
    <div className="prf-proposals-section">
      {/* Section header */}
      <div className="prf-proposals-header">
        <div className="prf-proposals-header-text">
          <h3 className="prf-proposals-title">My Service Proposals</h3>
          <p className="prf-proposals-sub">
            Manage the services and pricing you have submitted for SmartWash admin review.
          </p>
        </div>
        <button className="prf-propose-btn" onClick={onAddNew}>
          + Propose New Service
        </button>
      </div>

      {/* Pricing disclaimer */}
      <div className="prf-pricing-disclaimer">
        <span>🛡️</span>
        <span>
          <strong>Final customer pricing is subject to SmartWash admin approval.</strong>{' '}
          Your proposed price is reviewed and may be adjusted to ensure fair and consistent pricing across the platform.
        </span>
      </div>

      {/* Filter chips */}
      <div className="prf-proposal-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`prf-filter-chip ${filter === f.key ? 'prf-filter-chip--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="prf-filter-count">
              {f.key === 'all' ? proposals.length : proposals.filter(p => p.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="prf-proposals-empty">
          <div className="prf-empty-icon">📋</div>
          <p className="prf-empty-title">No proposals yet</p>
          <p className="prf-empty-sub">
            {filter === 'all'
              ? 'Start by proposing a service you would like to offer to SmartWash customers.'
              : `No proposals with "${FILTERS.find(f => f.key === filter)?.label}" status.`}
          </p>
          {filter === 'all' && (
            <button className="button button-solid" style={{ marginTop: 16 }} onClick={onAddNew}>
              + Propose Your First Service
            </button>
          )}
        </div>
      ) : (
        <div className="prf-proposals-grid">
          {filtered.map(p => <ProposalCard key={p.id} proposal={p} />)}
        </div>
      )}
    </div>
  );
}

// ── Edit Profile (unchanged logic, refreshed styling) ────────────────────────
function ProfileEdit({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: user.name, email: user.email, phone: user.phone,
  });

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <div className="prf-edit-shell">
      <div className="prf-edit-header">
        <h3 className="avail2-section-title">Edit Profile</h3>
        <p className="avail2-section-sub">Update your contact details. Other information is managed by SmartWash Admin.</p>
      </div>

      <div className="prf-edit-form">
        {[
          { name: 'name',  label: 'Full Name',      type: 'text'  },
          { name: 'email', label: 'Email Address',  type: 'email' },
          { name: 'phone', label: 'Phone Number',   type: 'tel'   },
        ].map(field => (
          <div key={field.name} className="profile-field">
            <label className="profile-field-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handle}
              className="profile-field-input"
            />
          </div>
        ))}
      </div>

      <div className="profile-edit-actions">
        <button type="button" className="button button-quiet" style={{ border: '1px solid #e2ded6' }} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="button button-solid" onClick={() => onSave(form)}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ── Main page content ─────────────────────────────────────────────────────────
function ProfileContent() {
  const providerRecord    = getProviderByUserId(DEMO_USER_ID);
  const [userData, setUserData]       = useState(getUserById(DEMO_USER_ID));
  const [editing, setEditing]         = useState(false);
  const [saved, setSaved]             = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [proposals, setProposals]     = useState(
    () => getProposalsByProviderId(DEMO_PROVIDER_ID)
  );

  // Stats from bookings
  const allJobs = getBookingsByProviderId(DEMO_PROVIDER_ID);
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

  function handleNewProposal(formData) {
    const newProposal = {
      id: `SPR-${Date.now()}`,
      providerId: DEMO_PROVIDER_ID,
      status: 'pending',
      adminApprovedPrice: null,
      submittedOn: new Date().toISOString().slice(0, 10),
      adminNotes: null,
      ...formData,
    };
    setProposals(prev => [newProposal, ...prev]);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  }

  if (editing) {
    return (
      <ProfileEdit
        user={userData}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      {/* Toast notification */}
      {saved && (
        <div className="avail-toast">
          <span className="avail-toast-icon">✓</span>
          {proposals[0]?.status === 'pending' && proposals[0]?.id?.startsWith('SPR-1')
            ? 'Service proposal submitted for review!'
            : 'Profile updated successfully!'}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProposeServiceModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewProposal}
        />
      )}

      {/* 1. Profile Header */}
      <ProfileHeader
        user={userData}
        provider={providerRecord}
        onEdit={() => setEditing(true)}
      />

      {/* 2. Performance Stats */}
      <PerformanceStats stats={stats} />

      {/* 3. Personal + Account Info */}
      <InfoSection user={userData} provider={providerRecord} />

      {/* 4. Service Proposals */}
      <ServiceProposals
        proposals={proposals}
        onAddNew={() => setShowModal(true)}
      />

      {/* 5. Active Specialties */}
      <ServiceSpecialties proposals={proposals} />
    </>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function ProviderProfile() {
  return (
    <ProviderLayout title="My Profile">
      <ProfileContent />
    </ProviderLayout>
  );
}
