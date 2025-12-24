import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Services from '../pages/Services';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Contact from '../pages/Contact';
import Barbers from '../pages/Barbers/Barbers';
import BarbersDetails from '../pages/Barbers/BarbersDetails';
import Aboutus from '../pages/Aboutus';
import Dashboard from '../Dashboard/barber-account/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import MyAccount from '../Dashboard/user-account/MyAccount';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import ResetPassword from '../pages/ResetPassword';
import Thankyou from '../pages/Barbers/BarberServices/ThankYou';
import Confirmation from '../pages/Barbers/BarberServices/Confirmation';
import NotificationPage from '../pages/Notifications';
import AuthCallback from '../pages/AuthCallback.jsx';
import PaymentCallback from '../pages/PaymentCallback.jsx';
import PendingApproval from '../pages/PendingApproval.jsx';
import ProviderStatusDemo from '../pages/ProviderStatusDemo.jsx';
import OwnerDashboard from '../pages/Admin/OwnerDashboard.jsx';
import AdminLayout from '../layout/AdminLayout.jsx';


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/barbers" element={<Barbers />} />
      <Route path="/barbers/:id" element={<BarbersDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/thank-you" element={<Thankyou />} />
      <Route path="/confirm-booking" element={<Confirmation />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/payment/callback" element={<PaymentCallback />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/provider-status-demo" element={<ProviderStatusDemo />} />
      <Route
        path="/users/profile/me"
        element={
          <MyAccount />
        }
      />
      <Route
        path="/barbers/profile/me"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes - No Header/Footer */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="providers"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="*"
        element={
          <>
            <Header />
            <Footer />
          </>
        }
      />
    </Routes>
  );
};

export default Routers;
