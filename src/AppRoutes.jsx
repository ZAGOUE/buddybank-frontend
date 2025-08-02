import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateAccountPage from './pages/CreateAccountPage';
import DashboardPage from './pages/DashboardPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivateRoute from './components/PrivateRoute';
import UserListPage from "./pages/UserListePage";
import UserFormPage from "./pages/UserFormPage";
import ProfilePage from "./pages/ProfilePage";
import AddFriendPage from "./pages/AddFriendPage";
import AccountPage from "./pages/AccountPage";
import TransferPage from "./pages/TransfertPage"; // si tu veux protéger certaines pages

export default function AppRoutes() {
    const { user, token } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboardPage user={user} /></PrivateRoute>} />
            <Route path="/manager-dashboard" element={<PrivateRoute><ManagerDashboardPage user={user} token={token} /></PrivateRoute>} />
            <Route path="/manager/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
            <Route path="/manager/users/create" element={<PrivateRoute><UserFormPage /></PrivateRoute>} />
            <Route path="/manager/users/:id/edit" element={<PrivateRoute><UserFormPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/add-friend" element={<PrivateRoute><AddFriendPage /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="/transfer" element={<PrivateRoute><TransferPage /></PrivateRoute>} />





        </Routes>
    );
}
