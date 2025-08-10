import React, { useEffect, useState, useContext } from "react";
import "../assets/css/style.css";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";
import { AuthContext } from "../context/AuthContext";
import api from "../services/axiosConfig";
import {Link} from "react-router-dom";

export default function AdminDashboardPage({ user, token }) {
    const { logout } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Charger les stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await api.get("/admin/stats", config);
                setStats(res.data);
            } catch (err) {
                setError("Erreur de chargement des stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading)
        return (
            <>
                <BuddyBankHeader user={user} onLogout={logout} />
                <div className="centered-container"><p>Chargement...</p></div>
            </>
        );
    if (error)
        return (
            <>
                <BuddyBankHeader user={user} onLogout={logout} />
                <div className="centered-container"><p className="text-red-500">{error}</p></div>
            </>
        );

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="dashboard-bg">
                <div className="dashboard-card">
                    <h1 className="dashboard-title">👑 Espace Administrateur</h1>
                    <div className="dashboard-section">
                        <h2>📊 Statistiques</h2>
                        <ul>
                            <li>Utilisateurs : <b>{stats.totalUsers}</b></li>
                            <li>Transactions : <b>{stats.totalTransactions}</b></li>
                            <li>Total commissions : <b>{stats.totalCommissions} €</b></li>
                        </ul>
                    </div>
                    <div className="dashboard-section">
                        <h2>👥 Gestion utilisateurs</h2>
                        <p>
                            <Link to="/admin/users" className="bb-link-back">Gérer les utilisateurs</Link>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}
