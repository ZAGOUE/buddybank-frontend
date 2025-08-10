import React, { useState, useEffect, useContext } from "react";
import api from "../services/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import BuddyBankHeader from "../components/layout/BuddyBankHeader";

export default function AddFriendPage() {
    const { user, logout } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]); // contient les objets friends complets

    // Récupère la liste complète des amis
    useEffect(() => {
        if (!user) return;
        api.get(`/friends/of/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                console.log("Donnée brute amis:", res.data);
                // Utilise la bonne structure selon ce que tu vois dans le log :
                setFriends(res.data); // OU setFriends(res.data.map(f => f.friend));
            })
            .catch(() => setFriends([]));
    }, [user]);

    // Recherche côté backend
    useEffect(() => {
        if (search.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        api.get(`/users/search?email=${encodeURIComponent(search)}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => setSuggestions(res.data))
            .catch(() => setSuggestions([]))
            .finally(() => setLoading(false));
    }, [search]);

    // Ajout d’un ami
    const handleAddFriend = (friendId) => {
        api.post("/friends", {
            userId: user.id,
            friendId: friendId
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(() => {
                toast.success("Ami ajouté !");
                // Recharge les amis (pour afficher la liste à jour)
                api.get(`/friends/of/${user.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                })
                    .then(res => setFriends(res.data))
                    .catch(() => {});
                setSuggestions(prev => prev.filter(u => u.id !== friendId));
            })
            .catch(() => toast.error("Erreur lors de l’ajout de l’ami."));
    };

    // Récupère juste les IDs pour le filtre
    const friendIds = (Array.isArray(friends) ? friends : [])
        .filter(f => !!f && typeof f.id !== "undefined" && !!f.email)
        .map(f => f.id);



    return (
        <>

            <BuddyBankHeader user={user} onLogout={logout} />
        <div className="container mt-5">
            <h2>Ajouter un ami</h2>
            <input
                className="form-control"
                type="text"
                placeholder="Recherche par email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
            />
            {loading && <div>Chargement…</div>}

            {suggestions.length > 0 && (
                <table className="table table-hover mt-3">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suggestions
                        .filter(u => u.id !== user.id && !friendIds.includes(u.id))
                        .map(u => (
                            <tr key={u.id}>
                                <td>{u.email}</td>
                                <td>{u.firstname}</td>
                                <td>{u.lastname}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAddFriend(u.id)}
                                    >
                                        Ajouter
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Liste d'amis déjà ajoutés avec présentation sympa */}
            {friends.length > 0 && (
                <div className="mt-5">
                    <h4 className="mb-3">Mes amis déjà ajoutés</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(Array.isArray(friends) ? friends : [])
                            .filter(f => !!f && typeof f.id !== "undefined" && !!f.email)
                            .map(friend => (
                                <tr key={friend.id}>
                                    <td>{friend.email}</td>
                                    <td>{friend.firstname}</td>
                                    <td>{friend.lastname}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
        </>
    );
}
