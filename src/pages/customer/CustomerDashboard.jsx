import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

function DashboardContent() {
	const { logout } = useAuth();
	return <main><h1>Welcome, Customer</h1><button className="button button-solid" onClick={logout}>Log out</button></main>;
}

export default function CustomerDashboard() { return <ProtectedRoute role="customer"><DashboardContent /></ProtectedRoute>; }
