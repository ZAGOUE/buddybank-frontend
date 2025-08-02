import React, { useState, useEffect, useContext } from "react";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import BuddyBankHeader from '../components/layout/BuddyBankHeader';

export default function TransferPage() {
    const { user, logout } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [myAccount, setMyAccount] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    // Récupère la liste des amis et ton compte à l'ouverture
    useEffect(() => {
        if (!user) return;
        setLoading(true);
        Promise.all([
            api.get(`/friends/of/${user.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }),
            api.get(`/accounts/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
        ])
            .then(([friendsRes, accountRes]) => {

                setFriends(friendsRes.data);
                setMyAccount(accountRes.data);
            })
            .catch(() => toast.error("Erreur lors du chargement des données"))
            .finally(() => setLoading(false));
    }, [user]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!selectedFriend) {
            toast.error("Veuillez sélectionner un destinataire.");
            return;
        }
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            toast.error("Montant invalide.");
            return;
        }
        if (transferAmount > myAccount.balance) {
            toast.error("Solde insuffisant.");
            return;
        }

        // On trouve le compte destinataire de l'ami sélectionné
        const friend = friends.find(f => f.id === parseInt(selectedFriend));
        if (!friend?.account) {
            toast.error("Le compte destinataire est introuvable.");
            return;
        }

        api.post("/transfers", {
            senderAccountId: myAccount.id,
            receiverAccountId: friend.account.id,
            amount: transferAmount,
            description
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                toast.success("Transfert effectué !");
                setMyAccount(acc => ({
                    ...acc,
                    balance: acc.balance - transferAmount
                }));
                setSelectedFriend("");
                setAmount("");
                setDescription("");
            })
            .catch(err => {
                const msg = err.response?.data || "Erreur lors du transfert.";
                toast.error(msg);
            });
    };
    console.log("FRIENDS RÉPONSE :", friends);
    if (loading) return <div>Chargement…</div>;

    return (
        <>

            <BuddyBankHeader user={user} onLogout={logout} />
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <h2>Transférer de l’argent à un ami</h2>
            <div className="mb-3 fs-5">
                <strong>Mon solde :</strong> <span style={{ color: "#20b820" }}>{myAccount.balance.toFixed(2)} €</span>
            </div>
            <form onSubmit={handleTransfer} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label htmlFor="friend" className="form-label">Choisir un ami</label>
                    <select
                        id="friend"
                        className="form-select"
                        value={selectedFriend}
                        onChange={e => setSelectedFriend(e.target.value)}
                        required
                    >
                        <option value="">-- Sélectionner --</option>
                        {Array.isArray(friends) && friends
                            .filter(f => f && f.id !== undefined)
                            .map(f => (
                            <option key={f.id} value={f.id}>
                                {f.firstname} {f.lastname} ({f.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Montant à transférer (€)</label>
                    <input
                        id="amount"
                        type="number"
                        className="form-control"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Motif (optionnel)</label>
                    <input
                        id="description"
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Motif du transfert"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Envoyer</button>
            </form>
        </div>
            </>
    );
}
