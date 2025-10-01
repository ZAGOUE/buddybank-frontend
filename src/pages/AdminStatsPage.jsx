import React, { useEffect, useState } from "react";
import api from "../services/axiosConfig";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function AdminStatsPage({ user, logout }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        api.get("/admin/stats", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => setStats(res.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-5">
                <h2>Statistiques du système</h2>
                {loading && <div>Chargement...</div>}
                {stats && (
                    <div className="card p-4 mt-4 shadow" style={{ maxWidth: 600 }}>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Utilisateurs inscrits :</strong> {stats.totalUsers}
                            </li>
                            <li className="list-group-item">
                                <strong>Transactions effectuées :</strong> {stats.totalTransactions}
                            </li>
                            <li className="list-group-item">
                                <strong>Total commissions :</strong> {Number(stats.totalCommissions).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                            </li>
                        </ul>
                    </div>
                )}
                {!loading && !stats && <div className="text-danger mt-3">Impossible de charger les statistiques.</div>}
            </div>
        </>
    );
}
