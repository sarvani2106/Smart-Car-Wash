import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProviderLayout from '../../layouts/ProviderLayout';
import { getEnrichedBooking } from '../../data/mockData';

// ---- Helpers ---------------------------------------------------------------

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00'); 
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
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

// ---- Workflow Progress -----------------------------------------------------

const WORKFLOW_STEPS = [
  'Assigned',
  'On the Way',
  'Arrived',
  'Service Started',
  'Completed'
];

// ---- Main Component --------------------------------------------------------

function JobDetailsContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Using local state for workflow progress and status updates
  const [job, setJob] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const booking = getEnrichedBooking(id);
    if (booking) {
      setJob(booking);
      
      // Initialize workflow step based on initial status
      if (booking.status === 'completed') {
        setCurrentStep(4);
      } else if (booking.status === 'in-progress') {
        setCurrentStep(3); // Start Service step
      } else if (booking.status === 'confirmed') {
        setCurrentStep(0); // Assigned
      } else if (booking.status === 'cancelled') {
        setCurrentStep(-1);
      } else {
        setCurrentStep(0); // Pending/Assigned
      }
    }
  }, [id]);

  if (!job) {
    return (
      <div className="jobs-empty-state">
        <h3>Job not found</h3>
        <p>The booking ID {id} could not be found.</p>
        <button className="button button-solid" style={{marginTop: '16px'}} onClick={() => navigate('/provider/bookings')}>
          Back to My Jobs
        </button>
      </div>
    );
  }

  // Handle Workflow Actions
  const handleNextStep = () => {
    if (currentStep < WORKFLOW_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Optimistically update the status representation based on the step
      if (nextStep === 3) {
        setJob(prev => ({ ...prev, status: 'in-progress' }));
      } else if (nextStep === 4) {
        setJob(prev => ({ ...prev, status: 'completed' }));
      }
    }
  };

  const getActionButtonText = () => {
    switch (currentStep) {
      case 0: return 'Start Journey';
      case 1: return 'Mark as Arrived';
      case 2: return 'Start Service';
      case 3: return 'Complete Service';
      default: return null;
    }
  };

  return (
    <div className="job-details-page">
      {/* Header */}
      <div className="job-details-header">
        <Link to="/provider/bookings" className="job-details-back">
          ← Back to My Jobs
        </Link>
        <div className="job-details-title-row">
          <div>
            <span className="job-card-id">{job.id}</span>
            <h2 className="provider-topbar-title" style={{marginTop: '4px'}}>
              {job.service?.name}
            </h2>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="job-details-grid">
        {/* Left Column: Details */}
        <div className="job-details-main">
          
          {/* Customer & Location */}
          <div className="dash-avail-panel">
            <p className="dash-panel-title">Customer & Location</p>
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Customer</span>
                <span className="detail-value">{job.customer?.name}</span>
                <span className="detail-sub">{job.customer?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{job.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Schedule</span>
                <span className="detail-value">{formatDate(job.date)}</span>
                <span className="detail-value">Time: {job.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="dash-avail-panel">
            <p className="dash-panel-title">Vehicle Information</p>
            {job.vehicle ? (
              <div className="detail-group">
                <div className="detail-item">
                  <span className="detail-label">Make & Model</span>
                  <span className="detail-value">{job.vehicle.brand} {job.vehicle.model}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registration</span>
                  <span className="detail-value" style={{fontFamily: 'monospace'}}>{job.vehicle.registrationNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type & Color</span>
                  <span className="detail-value">{job.vehicle.vehicleType} · {job.vehicle.color}</span>
                </div>
              </div>
            ) : (
              <p className="dash-avail-empty">No vehicle details provided.</p>
            )}
          </div>

          {/* Service Details */}
          <div className="dash-avail-panel">
            <p className="dash-panel-title">Service Details</p>
            <div className="detail-group">
              <div className="detail-item full-width">
                <span className="detail-label">Description</span>
                <span className="detail-value" style={{lineHeight: 1.5}}>{job.service?.description}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration (Est.)</span>
                <span className="detail-value">{job.service?.duration} mins</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Amount</span>
                <span className="job-card-price">₹{job.price?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow */}
        <div className="job-details-sidebar">
          <div className="dash-avail-panel workflow-panel">
            <p className="dash-panel-title">Service Progress</p>
            
            {job.status === 'cancelled' ? (
              <div className="workflow-cancelled">
                This booking has been cancelled.
              </div>
            ) : (
              <div className="workflow-timeline">
                {WORKFLOW_STEPS.map((step, index) => (
                  <div 
                    key={step} 
                    className={`workflow-step ${
                      index < currentStep ? 'completed' : 
                      index === currentStep ? 'active' : 'pending'
                    }`}
                  >
                    <div className="step-indicator"></div>
                    <div className="step-label">{step}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Workflow Action Button */}
            {job.status !== 'cancelled' && currentStep < WORKFLOW_STEPS.length - 1 && (
              <div className="workflow-action">
                <button 
                  className="button button-solid" 
                  style={{width: '100%', padding: '14px'}}
                  onClick={handleNextStep}
                >
                  {getActionButtonText()}
                </button>
              </div>
            )}
            
            {currentStep === WORKFLOW_STEPS.length - 1 && (
              <div className="workflow-success">
                Service completed successfully.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Page export -----------------------------------------------------------

export default function ProviderJobDetails() {
  return (
    <ProviderLayout title="Job Details">
      <JobDetailsContent />
    </ProviderLayout>
  );
}
