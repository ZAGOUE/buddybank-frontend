import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";
import { AuthContext } from "../context/AuthContext";

export default function AdminStatsPage() {
    const { user, logout } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isAdminOrManager = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER";
    const authHeaders = useMemo(
        () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        []
    );

    // Rediriger si déconnecté ou sans droits
    useEffect(() => {
        if (user === null) navigate("/login", { replace: true });
        else if (user && !isAdminOrManager) navigate("/", { replace: true });
    }, [user, isAdminOrManager, navigate]);

    useEffect(() => {
        if (!user || !isAdminOrManager) return;

        let cancelled = false;
        setLoading(true);
        api.get("/admin/stats", authHeaders)
            .then(res => { if (!cancelled) setStats(res.data); })
            .catch(() => { if (!cancelled) setStats(null); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [user, isAdminOrManager, authHeaders]);

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-5">
                <h2>Statistiques du système</h2>

                {(loading || !user) && <div>Chargement...</div>}

                {!loading && user && stats && (
                    <div className="card p-4 mt-4 shadow" style={{ maxWidth: 600 }}>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Utilisateurs inscrits :</strong> {stats.totalUsers}
                            </li>
                            <li className="list-group-item">
                                <strong>Transactions effectuées :</strong> {stats.totalTransactions}
                            </li>
                            <li className="list-group-item">
                                <strong>Total commissions :</strong>{" "}
                                {Number(stats.totalCommissions).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                            </li>
                        </ul>
                    </div>
                )}

                {!loading && user && !stats && (
                    <div className="text-danger mt-3">Impossible de charger les statistiques.</div>
                )}
            </div>
        </>
    );
}
