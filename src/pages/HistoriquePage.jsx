import React, { useContext, useEffect, useState } from "react";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function HistoriquePage() {
    const { user, logout } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        if (user.role === "ROLE_ADMIN" || user.role === "ROLE_MANAGER") {
            api.get("/transactions", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
                .then(res => setTransactions(res.data))
                .catch(() => setTransactions([]))
                .finally(() => setLoading(false));
        } else {
            // Étape 1 : récupérer le compte lié à l'utilisateur connecté
            api.get("/accounts/my", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
                .then(res => {
                    if (!res.data?.id) throw new Error("Aucun compte trouvé !");
                    // Étape 2 : historique du compte récupéré
                    return api.get(`/transactions/account/${res.data.id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                })
                .then(res => setTransactions(res.data))
                .catch(() => setTransactions([]))
                .finally(() => setLoading(false));
        }
    }, [user]);


    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-5">
                <h2>Historique des transactions</h2>
                {loading && <div>Chargement…</div>}
                {!loading && transactions.length === 0 && <div>Aucune transaction trouvée.</div>}

                {transactions.length > 0 && (
                    <table className="table table-striped mt-3">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Expéditeur</th>
                            <th>Destinataire</th>
                            <th>Description</th>
                            {(user.role === "ROLE_ADMIN" || user.role === "ROLE_MANAGER") && (
                                <th>Commission</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map(tx => (
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
                                {(user.role === "ROLE_ADMIN" || user.role === "ROLE_MANAGER") && (
                                    <td>{tx.fee} €</td>
                                )}
                            </tr>
                        ))}
                        </tbody>

                    </table>
                )}
            </div>
        </>
    );
}
