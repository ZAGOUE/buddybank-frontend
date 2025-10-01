import React, {useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BuddyBankHeader({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Menu par rôle
    const menuItems = [];
    if (!user) {
        menuItems.push({ label: "Accueil", path: "/" });
        menuItems.push({ label: "Connexion", path: "/login" });
        menuItems.push({ label: "Inscription", path: "/register" });


    } else if (user.role === "ROLE_MANAGER") {
        menuItems.push({ label: "Vue globale", path: "/manager-dashboard" });
        menuItems.push({ label: "Transactions", path: "/historique" });
        menuItems.push({ label: "Utilisateurs", path: "/manager/users" });

    } else if (user.role === "ROLE_ADMIN") {
        menuItems.push({ label: "Dashboard", path: "/admin-dashboard" });
        menuItems.push({ label: "Statistiques", path: "/admin/stats" });
        menuItems.push({ label: "Transactions", path: "/historique" });
        menuItems.push({ label: "Profil", path: "/profile" });

    } else {
        // ROLE_USER
        menuItems.push({ label: "Dashboard", path: "/dashboard" });
        menuItems.push({ label: "Transférer", path: "/transfer" });
        menuItems.push({ label: "Historique", path: "/historique" });
        menuItems.push({ label: "Ajouter un ami", path: "/add-friend" });
        menuItems.push({ label: "Compte", path: "/account" });
        menuItems.push({ label: "Profil", path: "/profile" });

    }

    return (
        <header className="bb-header">
            <div className="bb-logo" onClick={() => navigate("/")}>
                <span>BuddyBank</span>
            </div>
            <nav className="bb-nav">
                {menuItems.map(item => (
                    <button
                        key={item.label}
                        className={
                            "bb-nav-btn" +
                            ((location.pathname + location.hash) === item.path ? " active" : "")
                        }
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="bb-right">
                {user && (
                    <>
                        <span className="bb-user">👋 Connecté en tant que {user.firstname}</span>
                        <button
                            className="bb-logout-btn"
                            onClick={onLogout}
                        >
                            Se déconnecter
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
