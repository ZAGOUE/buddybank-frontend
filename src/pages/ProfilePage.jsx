import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/axiosConfig";
import { toast } from "react-toastify";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function ProfilePage() {
    const { user, logout } = useContext(AuthContext); // Ajoute logout ici !
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }
        setLoading(true);
        try {
            await api.put(
                "/users/me/password",
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            toast.success("Mot de passe modifié avec succès !");
            setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        } catch (err) {
            toast.error(err.response?.data || "Erreur lors du changement de mot de passe.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Chargement...</div>;

    return (
        <>
            {/* HEADER toujours visible en haut de la page */}
            <BuddyBankHeader user={user} onLogout={logout} />

            <div className="container profile-page">
                <h1 className="mb-4">Mon profil</h1>
                <div className="user-info mb-5">
                    <p><strong>Prénom :</strong> {user.firstname}</p>
                    <p><strong>Nom :</strong> {user.lastname}</p>
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Rôle :</strong> {user.role.replace("ROLE_", "")}</p>
                </div>
                <hr />
                <h2 className="mb-3">Changer le mot de passe</h2>
                <form onSubmit={handlePasswordChange}>
                    <div className="mb-3">
                        <label>Ancien mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Confirmer le mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Modification..." : "Changer le mot de passe"}
                    </button>
                </form>
            </div>
        </>
    );
}
