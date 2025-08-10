import React, { useEffect, useState, useContext } from "react";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";
import { AuthContext } from "../context/AuthContext";
import api from "../services/axiosConfig";

export default function AdminUsersPage({ user, token }) {
    const { logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await api.get("/users", config);
                // 👉 Pour n’afficher QUE les utilisateurs classiques :
                 setUsers(res.data.filter(u => u.role === "ROLE_USER"));
               // setUsers(res.data); // Affiche tous les users, admin/manager compris
            } catch (err) {
                setError("Impossible de charger les utilisateurs.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-5">
                <h2>Liste des utilisateurs <span className="text-muted" style={{ fontSize: "1rem" }}>(total : {users.length})</span></h2>
                {loading && <div>Chargement...</div>}
                {error && <div className="text-danger">{error}</div>}
                {!loading && users.length > 0 && (
                    <table className="table table-striped table-bordered mt-4">
                        <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.firstname}</td>
                                <td>{u.lastname}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {!loading && users.length === 0 && (
                    <div>Aucun utilisateur trouvé.</div>
                )}
            </div>
        </>
    );
}
