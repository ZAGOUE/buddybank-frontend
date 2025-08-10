import React, { useState, useContext, useEffect } from 'react';
import api from '../services/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/style.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Clean les tokens à chaque affichage de la page
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Connexion
            const response = await api.post('/auth/login', { email, password });

            const user = response.data.user;
            const token = response.data.token;

            login(user, token); // met en localStorage et context

            // ➤ REDIRECTION par rôle
            if (user.role === "ROLE_MANAGER") {
                navigate("/manager-dashboard");
                return;
            }

            if (user.role === "ROLE_ADMIN") {
                navigate("/admin-dashboard");
                return;
            }

            // ➤ ROLE_USER : Vérifie s’il a un compte bancaire
            const accountRes = await api.get('/accounts/my', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                validateStatus: () => true
            });

            if (accountRes.status === 200) {
                navigate('/dashboard');
            } else if (accountRes.status === 204) {
                toast.info("🔔 Aucun compte bancaire trouvé. Veuillez en créer un.");
                navigate('/create-account');
            } else {
                toast.error("Erreur lors de la vérification du compte.");
            }

        } catch (err) {
            toast.error("❌ Identifiants incorrects ou utilisateur inexistant.");
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-card shadow p-4 rounded">
                <Link to="/" style={{ color: "#1976d2", textDecoration: "none", fontSize: "1rem" }}>
                    ← Retour à l'accueil
                </Link>
                <h2 className="text-center mb-4">Connexion</h2>
                <div className="mt-3 text-center">

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
