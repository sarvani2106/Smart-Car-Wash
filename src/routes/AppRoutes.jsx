import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import CustomerLogin from '../pages/auth/CustomerLogin';
import CustomerSignup from '../pages/auth/CustomerSignup';
import ProviderLogin from '../pages/auth/ProviderLogin';
import AdminLogin from '../pages/auth/AdminLogin';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import CustomerServices from '../pages/customer/CustomerServices';
import CustomerBooking from '../pages/customer/CustomerBooking';
import CustomerProfile from '../pages/customer/CustomerProfile';
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import ProviderBookings from '../pages/provider/ProviderBookings';
import ProviderProfile from '../pages/provider/ProviderProfile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminProviders from '../pages/admin/AdminProviders';
import AdminServices from '../pages/admin/AdminServices';
import AdminBookings from '../pages/admin/AdminBookings';
export default function AppRoutes() { return <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/customer/login" element={<CustomerLogin />} /><Route path="/customer/signup" element={<CustomerSignup />} />
  <Route path="/provider/login" element={<ProviderLogin />} /><Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/customer/dashboard" element={<CustomerDashboard />} /><Route path="/customer/services" element={<CustomerServices />} /><Route path="/customer/booking" element={<CustomerBooking />} /><Route path="/customer/profile" element={<CustomerProfile />} />
  <Route path="/provider/dashboard" element={<ProviderDashboard />} /><Route path="/provider/bookings" element={<ProviderBookings />} /><Route path="/provider/profile" element={<ProviderProfile />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} /><Route path="/admin/customers" element={<AdminCustomers />} /><Route path="/admin/providers" element={<AdminProviders />} /><Route path="/admin/services" element={<AdminServices />} /><Route path="/admin/bookings" element={<AdminBookings />} />
</Routes>; }
