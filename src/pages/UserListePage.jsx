import React, { useEffect, useState, useContext } from "react";
import api from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function UserListPage() {
    const { user, token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        if (!user || user.role !== "ROLE_MANAGER") {
            navigate("/login");
            return;
        }
        api.get("/users", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setUsers(res.data))
            .catch(() => setError("Erreur lors de la récupération des utilisateurs."))
            .finally(() => setLoading(false));
    }, [user, token, navigate]);

    if (loading) return <div className="text-center mt-5">Chargement...</div>;
    if (error) return <div className="text-center text-danger mt-5">{error}</div>;

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Liste des utilisateurs</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/manager/users/create")}
                    >
                        + Créer un utilisateur
                    </button>
                </div>
                <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.firstname}</td>
                            <td>{u.lastname}</td>
                            <td>{u.email}</td>
                            <td>{u.role.replace("ROLE_", "")}</td>
                            <td>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => navigate(`/manager/users/${u.id}/edit`)}
                                >
                                    Modifier
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
