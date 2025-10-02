import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function HistoriquePage() {
    const { user, logout } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Petit helper pour ne pas répéter le header
    const authHeaders = useMemo(
        () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        []
    );

    // Vaut true seulement si user existe ET a le rôle admin/manager
    const isAdminOrManager = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER";

    // Optionnel : si user === null (déconnecté), on redirige
    useEffect(() => {
        if (user === null) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        // Tant que user n’est pas disponible, on ne fait rien
        if (!user) return;

        setLoading(true);

        const load = async () => {
            try {
                if (isAdminOrManager) {
                    const res = await api.get("/transactions", authHeaders);
                    setTransactions(Array.isArray(res.data) ? res.data : []);
                } else {
                    // 1) récupérer le compte
                    const accRes = await api.get("/accounts/my", authHeaders);
                    const accountId = accRes.data?.id;
                    if (!accountId) throw new Error("Aucun compte trouvé !");
                    // 2) récupérer l’historique
                    const txRes = await api.get(`/transactions/account/${accountId}`, authHeaders);
                    setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
                }
            } catch (e) {
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user, isAdminOrManager, authHeaders]);

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />

            <div className="container mt-5">
                <h2>Historique des transactions</h2>

                {/* État de chargement (y compris quand user est encore en cours de chargement) */}
                {(loading || !user) && <div>Chargement…</div>}

                {!loading && user && transactions.length === 0 && (
                    <div>Aucune transaction trouvée.</div>
                )}

                {!loading && user && transactions.length > 0 && (
                    <table className="table table-striped mt-3">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Expéditeur</th>
                            <th>Destinataire</th>
                            <th>Description</th>
                            {isAdminOrManager && <th>Commission</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>
                                    {tx.createdAt
                                        ? new Date(tx.createdAt).toLocaleString("fr-FR")
                                        : <span className="text-muted">—</span>}
                                </td>
                                <td className={tx.amount > 0 ? "text-success" : "text-danger"}>
                                    {tx.amount} €
                                </td>
                                <td>
                                    {tx.sender
                                        ? `${tx.sender.firstname} ${tx.sender.lastname}`
                                        : "?"}
                                </td>
                                <td>
                                    {tx.receiver
                                        ? `${tx.receiver.firstname} ${tx.receiver.lastname}`
                                        : "?"}
                                </td>
                                <td>{tx.description}</td>
                                {isAdminOrManager && <td>{tx.fee} €</td>}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
