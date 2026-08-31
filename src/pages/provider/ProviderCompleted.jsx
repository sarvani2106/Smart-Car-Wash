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

function CompletedContent() {
  const navigate = useNavigate();

  // Fetch and enrich bookings for this provider
  const rawBookings = getBookingsByProviderId(DEMO_PROVIDER_ID);
  
  // Filter for completed jobs and sort by date descending (most recent first)
  const completedBookings = rawBookings
    .map((b) => getEnrichedBooking(b.id))
    .filter((b) => b.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculations
  const totalCompleted = completedBookings.length;
  const totalEarnings = completedBookings.reduce((sum, job) => sum + (job.price || 0), 0);

  return (
    <>
      {/* Performance Summary Stats */}
      <div className="dash-stats" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '32px' }}>
        <div className="dash-stat-card">
          <p className="dash-stat-label">Total Completed Jobs</p>
          <p className="dash-stat-number clr-mint">{totalCompleted}</p>
          <p className="dash-stat-hint">Jobs successfully serviced and completed</p>
        </div>

        <div className="dash-stat-card">
          <p className="dash-stat-label">Total Earnings</p>
          <p className="dash-stat-number">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <p className="dash-stat-hint">Gross earnings from all completed bookings</p>
        </div>
      </div>

      {/* History Panel */}
      <div className="dash-recent-panel">
        <div className="dash-recent-header">
          <p className="dash-panel-title" style={{ margin: 0 }}>
            Job History &amp; Performance
          </p>
          <span className="dash-recent-count">
            {totalCompleted} record{totalCompleted !== 1 ? 's' : ''}
          </span>
        </div>

        {totalCompleted === 0 ? (
          <div className="jobs-empty-state" style={{ border: 'none', borderRadius: '0' }}>
            <h3>No completed jobs yet</h3>
            <p>Once you finish servicing vehicles, your completed history and earnings will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="dash-recent-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Completion Date</th>
                  <th>Earnings</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {completedBookings.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <span className="dash-td-booking-id">{job.id}</span>
                    </td>
                    <td>
                      <span className="dash-td-service-name">
                        {job.service?.name}
                      </span>
                    </td>
                    <td>{job.customer?.name || '—'}</td>
                    <td>
                      {job.vehicle
                        ? `${job.vehicle.brand} ${job.vehicle.model}`
                        : '—'}
                    </td>
                    <td>{formatDate(job.date)}</td>
                    <td>
                      <span className="dash-td-price">
                        ₹{job.price?.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="job-card-action"
                        style={{ padding: '6px 12px', fontSize: '10px' }}
                        onClick={() => navigate(`/provider/bookings/${job.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ---- Page export -----------------------------------------------------------

export default function ProviderCompleted() {
  return (
    <ProviderLayout title="Completed Jobs">
      <CompletedContent />
    </ProviderLayout>
  );
}
