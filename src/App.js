import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './AppRoutes';

function App() {
    console.log("API_BASE_URL =", process.env.REACT_APP_API_BASE_URL);

    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
                <ToastContainer position="top-center" />
            </Router>
        </AuthProvider>
    );
}

export default App;
