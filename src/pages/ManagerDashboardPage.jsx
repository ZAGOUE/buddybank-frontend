import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/axiosConfig";
import "../assets/css/style.css";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";
import { AuthContext } from "../context/AuthContext";

export default function ManagerDashboardPage({ user, token }) {
    const [userCount, setUserCount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { logout } = useContext(AuthContext); // Ajout du logout context

    useEffect(() => {
        const fetchManagerData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const [countRes, txRes] = await Promise.all([
                    api.get("/manager/users-count", config),
                    api.get("/manager/transactions", config),
                ]);
                setUserCount(countRes.data);
                setTransactions(txRes.data);
            } catch (err) {
                setError("Erreur : " + (err.response?.status || "") + " - " + (err.response?.data?.message || ""));
            } finally {
                setLoading(false);
            }
        };

        fetchManagerData();
    }, [token]);

    if (loading)
        return (
            <>
                <BuddyBankHeader user={user} onLogout={logout} />
                <div className="centered-container">
                    <p className="text-gray-500">Chargement en cours...</p>
                </div>
            </>
        );
    if (error)
        return (
            <>
                <BuddyBankHeader user={user} onLogout={logout} />
                <div className="centered-container">
                    <p className="text-red-500">{error}</p>
                </div>
            </>
        );

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="dashboard-bg">
                <div className="dashboard-card">
                    {/* Bouton retour */}
                    <div className="mb-4 text-left">
                        <Link to="/" className="bb-link-back">
                            ⬅ Retour à l'accueil
                        </Link>
                    </div>
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Espace Manager</h1>

                        <p>Vous consultez l'espace Manager</p>
                        <div className="user-count">
                            Utilisateurs enregistrés : <b>{userCount}</b>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="dashboard-section">
                        <h2>📋 Transactions</h2>
                        {transactions.length === 0 ? (
                            <p className="text-gray-500">Aucune transaction enregistrée.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="styled-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Expéditeur</th>
                                        <th>Destinataire</th>
                                        <th>Montant</th>
                                        <th>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{tx.id}</td>
                                            {/* Corrige le nom du champ si besoin */}
                                            <td>{tx.senderAccountId || tx.sender_accont_id}</td>
                                            <td>{tx.receiverAccountId || tx.receiver_account_id}</td>
                                            <td>{tx.amount} €</td>
                                            <td>{new Date(tx.date).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
