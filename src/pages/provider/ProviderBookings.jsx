import { useState } from 'react';
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

function BookingsContent() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  // Fetch and enrich bookings for this provider
  const rawBookings = getBookingsByProviderId(DEMO_PROVIDER_ID);
  
  // Sort bookings by date descending (newest first)
  const enriched = rawBookings
    .map((b) => getEnrichedBooking(b.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter options
  const filterOptions = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  // Apply filter
  const filteredBookings = enriched.filter((b) => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return b.status === 'in-progress';
    return b.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <>
      <div className="jobs-page-header">
        <div className="jobs-filter-bar">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              className={`jobs-filter-btn ${filter === opt ? 'active' : ''}`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="dash-recent-count" style={{ alignSelf: 'center' }}>
          Showing {filteredBookings.length} job{filteredBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="jobs-empty-state">
          <h3>No jobs found</h3>
          <p>You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} jobs at the moment.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredBookings.map((job) => (
            <div className="job-card" key={job.id}>
              
              <div className="job-card-header">
                <span className="job-card-id">{job.id}</span>
                <StatusBadge status={job.status} />
              </div>
              
              <h3 className="job-card-title">{job.service?.name}</h3>
              <p className="job-card-customer">
                {job.customer?.name}
              </p>
              
              <div className="job-card-details">
                <div className="job-detail-row">
                  <span className="job-detail-icon">📅</span>
                  <span>{formatDate(job.date)} at {job.timeSlot}</span>
                </div>
                
                <div className="job-detail-row">
                  <span className="job-detail-icon">📍</span>
                  <span>{job.location}</span>
                </div>
                
                <div className="job-detail-row">
                  <span className="job-detail-icon">🚘</span>
                  <span>
                    {job.vehicle
                      ? `${job.vehicle.brand} ${job.vehicle.model} (${job.vehicle.vehicleType})`
                      : 'Vehicle details not available'}
                  </span>
                </div>
              </div>
              
              <div className="job-card-footer">
                <span className="job-card-price">
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
      )}
    </>
  );
}

// ---- Page export -----------------------------------------------------------

export default function ProviderBookings() {
  return (
    <ProviderLayout title="My Jobs">
      <BookingsContent />
    </ProviderLayout>
  );
}
