import { useNavigate } from 'react-router-dom';
import ProviderLayout from '../../layouts/ProviderLayout';
import { getBookingsByProviderId, getEnrichedBooking } from '../../data/mockData';

// ---------------------------------------------------------------------------
// Demo identity
// ---------------------------------------------------------------------------
const DEMO_PROVIDER_ID = 'PRV-7001';

// ---- helpers ---------------------------------------------------------------

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00'); // prevent timezone shift
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }) {
  const labels = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  };
  return (
    <span className={`status-badge status-${status}`}>
      {labels[status] || status}
    </span>
  );
}

// ---- Page content ----------------------------------------------------------

function UpcomingContent() {
  const navigate = useNavigate();

  // Fetch and enrich bookings for this provider
  const rawBookings = getBookingsByProviderId(DEMO_PROVIDER_ID);
  
  // Filter for upcoming jobs and sort by date (soonest first)
  const upcomingBookings = rawBookings
    .map((b) => getEnrichedBooking(b.id))
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by date
  const groupedBookings = upcomingBookings.reduce((acc, job) => {
    if (!acc[job.date]) {
      acc[job.date] = [];
    }
    acc[job.date].push(job);
    return acc;
  }, {});

  return (
    <>
      <div className="jobs-page-header">
        <h2 className="provider-topbar-title" style={{ fontSize: '20px' }}>Your Schedule</h2>
        <div className="dash-recent-count" style={{ alignSelf: 'center' }}>
          {upcomingBookings.length} upcoming job{upcomingBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {upcomingBookings.length === 0 ? (
        <div className="jobs-empty-state">
          <h3>All caught up!</h3>
          <p>You don't have any upcoming jobs scheduled at the moment.</p>
        </div>
      ) : (
        <div className="upcoming-timeline">
          {Object.keys(groupedBookings).map((date) => (
            <div key={date} className="upcoming-day-group">
              
              <div className="upcoming-day-header">
                <h3 className="upcoming-day-date">{formatDate(date)}</h3>
                <div className="upcoming-day-line"></div>
              </div>

              {groupedBookings[date].map((job) => (
                <div className="upcoming-job-row" key={job.id}>
                  
                  {/* Time Column */}
                  <div className="upcoming-time-col">
                    <span className="upcoming-time-slot">{job.timeSlot}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  
                  {/* Main Info Column */}
                  <div className="upcoming-main-col">
                    <span className="job-card-id">{job.id}</span>
                    <h4 className="job-card-title" style={{ fontSize: '18px', marginBottom: '8px' }}>
                      {job.service?.name}
                    </h4>
                    <div className="job-detail-row">
                      <span className="job-detail-icon">📍</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  
                  {/* Customer Column */}
                  <div className="upcoming-customer-col">
                    <span className="detail-label" style={{ marginBottom: '4px' }}>Customer & Vehicle</span>
                    <span className="detail-value">{job.customer?.name}</span>
                    <span className="detail-sub">
                      {job.vehicle
                        ? `${job.vehicle.brand} ${job.vehicle.model}`
                        : 'Vehicle not specified'}
                    </span>
                  </div>
                  
                  {/* Action Column */}
                  <div className="upcoming-action-col">
                    <span className="upcoming-price">
                      ₹{job.price?.toLocaleString('en-IN')}
                    </span>
                    <button 
                      className="job-card-action"
                      onClick={() => navigate(`/provider/bookings/${job.id}`)}
                    >
                      View Details
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ---- Page export -----------------------------------------------------------

export default function ProviderUpcoming() {
  return (
    <ProviderLayout title="Upcoming Jobs">
      <UpcomingContent />
    </ProviderLayout>
  );
}
