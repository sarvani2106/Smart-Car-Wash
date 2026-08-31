import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import './Provider.css';

// Navigation items for the Provider section.
// Disabled items (no page yet) are shown with a "coming soon" style
// and will be replaced with real NavLinks as each page is built.
const NAV_ITEMS = [
  { to: '/provider/dashboard', label: 'Dashboard',    ready: true  },
  { to: '/provider/bookings',  label: 'My Jobs',      ready: true  },
  { to: '/provider/upcoming',  label: 'Upcoming Jobs', ready: true },
  { to: '/provider/completed', label: 'Completed',    ready: true },
  { to: '/provider/availability', label: 'Availability', ready: true },
  { to: '/provider/profile',   label: 'Profile',      ready: true  },
];

// ProviderLayout wraps ProtectedRoute so individual provider pages
// don't each need to set up the guard and shell themselves.
export default function ProviderLayout({ title, children }) {
  return (
    <ProtectedRoute role="provider">
      <ProviderShell title={title}>{children}</ProviderShell>
    </ProtectedRoute>
  );
}

function ProviderShell({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth/provider/login');
  }

  // First letter of the provider's name for the avatar circle.
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="provider-shell">

      {/* ---- Sidebar ---- */}
      <aside className="provider-sidebar">

        <div className="provider-sidebar-logo">
          <Logo light />
        </div>

        <nav className="provider-nav" aria-label="Provider navigation">
          {NAV_ITEMS.map((item) =>
            item.ready ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `provider-nav-item${isActive ? ' active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              /* Placeholder for pages not yet implemented */
              <span
                key={item.to}
                className="provider-nav-item"
                style={{ opacity: 0.38, cursor: 'default', pointerEvents: 'none' }}
                title="Coming soon"
              >
                {item.label}
              </span>
            )
          )}
        </nav>

        <div className="provider-sidebar-divider" />

        {/* Sidebar user identity + logout */}
        <div className="provider-sidebar-footer">
          <div className="provider-sidebar-user">
            <div className="provider-avatar-circle">{initial}</div>
            <div>
              <div className="provider-sidebar-name">
                {user?.name || 'Service Partner'}
              </div>
              <div className="provider-sidebar-role-label">Service Provider</div>
            </div>
          </div>
          <button className="provider-logout-btn" onClick={handleLogout}>
            Sign out →
          </button>
        </div>

      </aside>

      {/* ---- Main column ---- */}
      <div className="provider-main">

        {/* Top bar */}
        <header className="provider-topbar">
          <div className="provider-topbar-left">
            <p className="provider-topbar-eyebrow">SmartWash · Partner Portal</p>
            <h1 className="provider-topbar-title">{title}</h1>
          </div>
          <div className="provider-topbar-right">
            <div className="provider-online-pill">
              <span className="provider-online-dot" />
              Active
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="provider-content">
          {children}
        </main>

      </div>
    </div>
  );
}
