import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return <p className="text-center mt-5">Chargement...</p>;

    // --- Non connecté ---
    if (!user) {
        return (
            <div className="container text-center mt-5">
                <h1>Bienvenue sur BuddyBank</h1>
                <p>La banque sociale moderne et sécurisée</p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Link to="/login" className="btn btn-primary">Se connecter</Link>
                    <Link to="/register" className="btn btn-outline-primary">Créer un compte</Link>
                </div>
            </div>
        );
    }

    // --- Connecté ---
    return (
        <div className="container text-center mt-5">
            <h1>Bienvenue sur BuddyBank</h1>
            <p>La banque sociale moderne et sécurisée</p>
            <div className="mt-4">
                <p>
                    👋 Bonjour <b>{user.firstName}</b>,
                    vous êtes connecté en tant que <b>{user.role.replace("ROLE_", "")}</b>.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (user.role === "ROLE_USER") navigate('/dashboard');
                        else if (user.role === "ROLE_ADMIN") navigate('/admin-dashboard');
                        else if (user.role === "ROLE_MANAGER") navigate('/manager-dashboard');
                    }}
                >
                    Accéder à mon espace
                </button>
            </div>
        </div>
    );
};

export default HomePage;
