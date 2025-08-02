import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function UserFormPage() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); // undefined si création
    const isEdit = Boolean(id);
    const { logout } = useContext(AuthContext);

    const [form, setForm] = useState({
        email: "",
        firstname: "",
        lastname: "",
        role: "ROLE_USER",
        password: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || user.role !== "ROLE_MANAGER") {
            navigate("/login");
            return;
        }
        if (isEdit) {
            api.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setForm({ ...res.data, password: "" }))
                .catch(() => setError("Utilisateur introuvable"));
        }
    }, [user, token, id, isEdit, navigate]);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        try {
            if (isEdit) {
                await api.put(`/users/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.post("/users", form, { headers: { Authorization: `Bearer ${token}` } });
            }
            navigate("/manager/users");
        } catch (err) {
            setError(err.response?.data || "Erreur lors de la soumission");
        }
    };

    return (
        <>
            <BuddyBankHeader user={user} onLogout={logout} />
            <div className="container mt-4" style={{ maxWidth: 500 }}>
                <h2>{isEdit ? "Modifier l'utilisateur" : "Créer un utilisateur"}</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input className="form-control" name="email" value={form.email} onChange={handleChange} required disabled={isEdit} />
                    </div>
                    <div className="mb-3">
                        <label>Prénom</label>
                        <input className="form-control" name="firstname" value={form.firstname} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Nom</label>
                        <input className="form-control" name="lastname" value={form.lastname} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Rôle</label>
                        <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                            <option value="ROLE_USER">Utilisateur</option>
                            <option value="ROLE_ADMIN">Administrateur</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Mot de passe {isEdit && <span className="text-muted">(laisser vide pour ne pas changer)</span>}</label>
                        <input className="form-control" name="password" value={form.password} type="password" onChange={handleChange} minLength={isEdit ? 0 : 8} />
                    </div>
                    <button className="btn btn-primary">{isEdit ? "Enregistrer" : "Créer"}</button>
                    <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate("/manager/users")}>Annuler</button>
                </form>
            </div>
        </>
    );
}
