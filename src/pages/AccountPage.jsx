import React, { useState, useEffect, useContext } from "react";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function AccountPage() {
    const { user, logout } = useContext(AuthContext);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amount, setAmount] = useState("");

    // Récupère les infos du compte à l'ouverture
    useEffect(() => {
        api.get("/accounts/my", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => setAccount(res.data))
            .catch(() => setAccount(null))
            .finally(() => setLoading(false));
    }, []);

    // Action dépôt
    const handleDeposit = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error("Montant invalide !");
            return;
        }
        api.post(`/accounts/${user.id}/deposit`, { amount: val }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                toast.success("Dépôt effectué !");
                setAccount(acc => ({ ...acc, balance: res.data.balance }));
                setShowDeposit(false);
                setAmount("");
            })
            .catch(() => toast.error("Erreur lors du dépôt"));
    };

    // Action retrait
    const handleWithdraw = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error("Montant invalide !");
            return;
        }
        if (val > account.balance) {
            toast.error("Solde insuffisant !");
            return;
        }
        api.post(`/accounts/${user.id}/withdraw`, { amount: val }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                toast.success("Retrait effectué !");
                setAccount(acc => ({ ...acc, balance: res.data.balance }));
                setShowWithdraw(false);
                setAmount("");
            })
            .catch(() => toast.error("Erreur lors du retrait"));
    };

    if (loading) return <div>Chargement...</div>;

    if (!account) {
        return (
            <div className="container mt-5">
                <h2>Mon compte bancaire</h2>
                <div className="alert alert-warning mt-3">
                    Vous n’avez pas encore de compte bancaire ouvert.
                </div>
                {/* Ici tu peux mettre un bouton pour créer un compte */}
            </div>
        );
    }

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-5">
                <h2>Mon compte bancaire</h2>
                <div className="card shadow p-4 mt-4" style={{ maxWidth: 500 }}>
                    <div className="mb-3">
                        <strong>Titulaire :</strong> {user.firstname} {user.lastname}
                    </div>
                    <div className="mb-3">
                        <strong>Numéro de compte :</strong> {account.id}
                    </div>
                    <div className="mb-3">
                        <strong>Date de création :</strong>{" "}
                        {account.createdAt
                            ? new Date(account.createdAt).toLocaleDateString()
                            : <span className="text-danger">Non disponible</span>
                        }
                    </div>
                    <div className="mb-3 fs-4">
                        <strong>Solde :</strong> <span style={{ color: "#20b820" }}>{account.balance.toFixed(2)} €</span>
                    </div>
                    {/* Actions */}
                    <div className="mt-4 d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => { setShowDeposit(!showDeposit); setShowWithdraw(false); setAmount(""); }}>
                            Déposer
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => { setShowWithdraw(!showWithdraw); setShowDeposit(false); setAmount(""); }}>
                            Retirer
                        </button>
                    </div>

                    {showDeposit && (
                        <div className="mt-3">
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Montant à déposer"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                min="0.01"
                                step="0.01"
                                autoFocus
                            />
                            <button className="btn btn-success me-2" onClick={handleDeposit}>Valider le dépôt</button>
                            <button className="btn btn-link text-danger" onClick={() => setShowDeposit(false)}>Annuler</button>
                        </div>
                    )}
                    {showWithdraw && (
                        <div className="mt-3">
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Montant à retirer"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                min="0.01"
                                step="0.01"
                                autoFocus
                            />
                            <button className="btn btn-warning me-2" onClick={handleWithdraw}>Valider le retrait</button>
                            <button className="btn btn-link text-danger" onClick={() => setShowWithdraw(false)}>Annuler</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
