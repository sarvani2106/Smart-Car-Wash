import ProviderLayout from '../../layouts/ProviderLayout';
import {
  getBookingsByProviderId,
  getEnrichedBooking,
  getProviderByUserId,
  getUserById,
} from '../../data/mockData';

// ---------------------------------------------------------------------------
// Demo identity
// The logged-in provider is Suresh Kumar (PRV-7001 / USR-2001).
// When real authentication stores a userId, replace these constants with a
// lookup from AuthContext, e.g.:  getProviderByUserId(user.userId)
// ---------------------------------------------------------------------------
const DEMO_USER_ID     = 'USR-2001';
const DEMO_PROVIDER_ID = 'PRV-7001';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ---- helpers ---------------------------------------------------------------

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00'); // prevent timezone shift
  return d.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
}

function StatusBadge({ status }) {
  const labels = {
    'pending':     'Pending',
    'confirmed':   'Confirmed',
    'in-progress': 'In Progress',
    'completed':   'Completed',
    'cancelled':   'Cancelled',
  };
  return (
    <span className={`status-badge status-${status}`}>
      {labels[status] || status}
    </span>
  );
}

// ---- Dashboard content -----------------------------------------------------

function DashboardContent() {
  const providerUser = getUserById(DEMO_USER_ID);
  const provider     = getProviderByUserId(DEMO_USER_ID);

  // All bookings for this provider, enriched with customer/vehicle/service data
  const rawBookings  = getBookingsByProviderId(DEMO_PROVIDER_ID);
  const enriched     = rawBookings.map((b) => getEnrichedBooking(b.id));

  // Categorise by status
  const inProgress = enriched.filter((b) => b.status === 'in-progress');
  const upcoming   = enriched.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );
  const completed  = enriched.filter((b) => b.status === 'completed');
  const todayJobs  = [...inProgress, ...upcoming]; // active work right now

  // The job to highlight: prefer in-progress, then first upcoming
  const featuredJob = inProgress[0] || upcoming[0] || null;

  // Earnings: sum of all completed booking prices
  const totalEarnings = completed.reduce((sum, b) => sum + (b.price || 0), 0);

  // Availability from the provider record
  const availability = provider?.availability || { days: [], slots: [] };

  // Provider's first name for the greeting
  const firstName = providerUser?.name?.split(' ')[0] || 'Partner';

  // ---------------------------------------------------------------------------
  return (
    <>

      {/* ---- Welcome banner ---- */}
      <div className="dash-welcome">
        <div>
          <p className="dash-welcome-eyebrow">SmartWash Partner Portal</p>
          <h2>
            Good day, <em>{firstName}.</em>
          </h2>
          <p className="dash-welcome-sub">
            {todayJobs.length > 0
              ? `You have ${todayJobs.length} active assignment${todayJobs.length !== 1 ? 's' : ''}. Keep up the great work!`
              : 'No active jobs right now. Check your upcoming schedule.'}
          </p>
        </div>

        {/* Provider status badges */}
        <div className="dash-welcome-badges">
          <div className="dash-welcome-badge">
            <span className="dash-welcome-badge-label">Status</span>
            <span
              className="dash-welcome-badge-value"
              style={{ fontSize: '16px', fontFamily: 'Manrope', fontWeight: 800 }}
            >
              {provider?.status === 'active'
                ? '● Active'
                : provider?.status === 'on-leave'
                ? '◌ On Leave'
                : '○ Inactive'}
            </span>
            <span className="dash-welcome-badge-sub">{DEMO_PROVIDER_ID}</span>
          </div>
          <div className="dash-welcome-badge">
            <span className="dash-welcome-badge-label">Services</span>
            <span
              className="dash-welcome-badge-value"
              style={{ fontSize: '14px', fontFamily: 'Manrope', fontWeight: 700 }}
            >
              {provider?.serviceTypes?.length || 0} types
            </span>
            <span className="dash-welcome-badge-sub">
              {provider?.serviceTypes?.slice(0, 2).join(', ') || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="dash-stats">

        <div className="dash-stat-card">
          <p className="dash-stat-label">Active Jobs</p>
          <p className="dash-stat-number clr-mint">{todayJobs.length}</p>
          <p className="dash-stat-hint">In-progress &amp; upcoming</p>
        </div>

        <div className="dash-stat-card">
          <p className="dash-stat-label">Upcoming</p>
          <p className="dash-stat-number">{upcoming.length}</p>
          <p className="dash-stat-hint">Pending &amp; confirmed</p>
        </div>

        <div className="dash-stat-card">
          <p className="dash-stat-label">Completed</p>
          <p className="dash-stat-number">{completed.length}</p>
          <p className="dash-stat-hint">Total jobs done</p>
        </div>

        <div className="dash-stat-card">
          <p className="dash-stat-label">Total Earnings</p>
          <p className="dash-stat-number">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
          <p className="dash-stat-hint">From completed jobs</p>
        </div>

      </div>

      {/* ---- Body grid: featured job + availability ---- */}
      <div className="dash-body">

        {/* Featured / next job */}
        <div className="dash-next-job-panel">
          <p className="dash-panel-title">
            {inProgress.length > 0 ? 'Current Job' : 'Next Upcoming Job'}
          </p>

          {featuredJob ? (
            <div className={`dash-job-card${inProgress.length > 0 ? ' is-active' : ''}`}>
              <p className="dash-job-bkg-id">{featuredJob.id}</p>

              <h3 className="dash-job-service-name">
                {featuredJob.service?.name}
              </h3>

              <p className="dash-job-customer-line">
                {featuredJob.customer?.name}
                {featuredJob.vehicle
                  ? ` · ${featuredJob.vehicle.brand} ${featuredJob.vehicle.model} (${featuredJob.vehicle.vehicleType})`
                  : ''}
              </p>

              <div className="dash-job-meta-row">
                <span className="dash-job-meta-chip">
                  📅 {formatDate(featuredJob.date)}
                </span>
                <span className="dash-job-meta-chip">
                  ⏰ {featuredJob.timeSlot}
                </span>
                <span className="dash-job-meta-chip">
                  📍 {featuredJob.location?.split(',')[0]}
                </span>
              </div>

              <div className="dash-job-footer-row">
                <span className="dash-job-price">
                  ₹{featuredJob.price?.toLocaleString('en-IN')}
                </span>
                <StatusBadge status={featuredJob.status} />
              </div>
            </div>
          ) : (
            <p className="dash-no-job">
              No active or upcoming jobs right now.<br />
              Check back soon!
            </p>
          )}
        </div>

        {/* Availability panel */}
        <div className="dash-avail-panel">

          <div className="dash-avail-status-row">
            <p className="dash-panel-title" style={{ margin: 0 }}>
              My Availability
            </p>
            <StatusBadge status={provider?.status === 'active' ? 'confirmed' : 'cancelled'} />
          </div>

          {/* Day tiles */}
          <div className="dash-avail-days">
            {ALL_DAYS.map((day) => (
              <div
                key={day}
                className={`dash-avail-day ${
                  availability.days.includes(day) ? 'avail-on' : 'avail-off'
                }`}
                title={availability.days.includes(day) ? `Available on ${day}` : `Off on ${day}`}
              >
                {day.slice(0, 2)}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <p className="dash-panel-title" style={{ marginTop: '16px' }}>
            Time Slots
          </p>
          <div className="dash-avail-slots-list">
            {availability.slots.length > 0 ? (
              availability.slots.map((slot) => (
                <div key={slot} className="dash-avail-slot-item">
                  ⏱ {slot}
                </div>
              ))
            ) : (
              <p className="dash-avail-empty">No slots configured.</p>
            )}
          </div>

        </div>
      </div>

      {/* ---- All assigned jobs table ---- */}
      <div className="dash-recent-panel">
        <div className="dash-recent-header">
          <p className="dash-panel-title" style={{ margin: 0 }}>
            All Assigned Jobs
          </p>
          <span className="dash-recent-count">
            {enriched.length} total
          </span>
        </div>

        <table className="dash-recent-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Service</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enriched.length === 0 ? (
              <tr>
                <td colSpan={7} className="dash-recent-empty">
                  No jobs have been assigned yet.
                </td>
              </tr>
            ) : (
              enriched.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span className="dash-td-booking-id">{b.id}</span>
                  </td>
                  <td>
                    <span className="dash-td-service-name">
                      {b.service?.name}
                    </span>
                  </td>
                  <td>{b.customer?.name || '—'}</td>
                  <td>
                    {b.vehicle
                      ? `${b.vehicle.brand} ${b.vehicle.model}`
                      : '—'}
                  </td>
                  <td>{formatDate(b.date)}</td>
                  <td>
                    <span className="dash-td-price">
                      ₹{b.price?.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </>
  );
}

// ---- Page export -----------------------------------------------------------

export default function ProviderDashboard() {
  return (
    <ProviderLayout title="Dashboard">
      <DashboardContent />
    </ProviderLayout>
  );
}
