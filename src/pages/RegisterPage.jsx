import React, { useState } from 'react';
import api from '../services/axiosConfig';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/style.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirmPassword, firstName, lastName } = formData;

        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            toast.error("❗ Tous les champs sont requis.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("❗ Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await api.post('/auth/register', { email, password, firstName, lastName });
            toast.success("✅ Inscription réussie ! Connectez-vous.");
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data || "Erreur lors de l'inscription.";
            toast.error(`❌ ${msg}`);
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-card shadow p-4 rounded">
                <Link to="/" style={{ color: "#1976d2", textDecoration: "none", fontSize: "1rem" }}>
                    ← Retour à l'accueil
                </Link>
                <h2 className="text-center mb-4">Créer un compte</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Prénom</label>
                        <input type="text" name="firstName" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                        <label>Nom</label>
                        <input type="text" name="lastName" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                        <label>Mot de passe</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-4">
                        <label>Confirmer mot de passe</label>
                        <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100">S’inscrire</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
