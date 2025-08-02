import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BuddyBankHeader from '../components/layout/BuddyBankHeader';
import '../assets/css/style.css';

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté ou n'est pas ROLE_USER, on redirige
        if (!user || user.role !== 'ROLE_USER') {
            navigate('/login');
        }
    }, [user, navigate]);

    const goTo = (path) => () => navigate(path);

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="login-container d-flex justify-content-center align-items-center">
                <div className="login-card text-center">
                    <h2>Bienvenue {user?.firstName} 👋</h2>

                    <div className="mb-5 mb-lg-6"></div>



                    <button className="btn btn-outline-primary w-100 mb-2" onClick={goTo('/transfer')}>
                        💸 Faire un transfert
                    </button>
                    <button className="btn btn-outline-primary w-100 mb-2" onClick={goTo('/transactions')}>
                        📄 Historique des transactions
                    </button>
                    <button className="btn btn-outline-primary w-100 mb-2" onClick={goTo('/account')}>
                        🏦 Voir mon compte
                    </button>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
