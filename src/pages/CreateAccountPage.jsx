import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/style.css';

const CreateAccountPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccount = async () => {
            try {
                const res = await api.get('/accounts/my');
                if (res.status === 200) {
                    navigate('/dashboard'); // ✅ Compte existant → redirection
                } else if (res.status === 204) {
                    setLoading(false); // ✅ Aucun compte → affiche le bouton
                } else {
                    throw new Error("Réponse inattendue");
                }
            } catch (err) {
                if (err.response?.status === 204) {
                    setLoading(false); // 🔁 cas typique : aucun compte
                } else {
                    toast.error("❌ Erreur lors de la vérification du compte.");
                    navigate('/');
                }
            }
        };
        checkAccount();
    }, [navigate]);


    const handleCreate = async () => {
        try {
            await api.post('/accounts');
            toast.success("💰 Compte bancaire créé avec succès !");
            navigate('/dashboard'); // ✅ ou vers l'accueil selon ton design
        } catch (err) {
            if (err.response?.status === 409) {
                toast.warning("⚠️ Un compte existe déjà.");
                navigate('/dashboard');
            } else {
                toast.error("❌ Impossible de créer le compte bancaire.");
            }
        }
    };


    if (loading) {
        return (
            <div className="login-container d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-card shadow p-4 rounded text-center">
                <h2>Bienvenue {user?.firstname || ''} 👋</h2>
                <p className="mb-4">Vous n’avez pas encore de compte bancaire actif.</p>
                <button className="btn btn-primary w-100" onClick={handleCreate}>
                    Créer mon compte bancaire
                </button>
            </div>
        </div>
    );
};

export default CreateAccountPage;
