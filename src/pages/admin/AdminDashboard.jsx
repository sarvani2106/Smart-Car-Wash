import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

function DashboardContent() {
	const { logout } = useAuth();
	return <main><h1>Welcome, Admin</h1><button className="button button-solid" onClick={logout}>Log out</button></main>;
}

export default function AdminDashboard() { return <ProtectedRoute role="admin"><DashboardContent /></ProtectedRoute>; }
