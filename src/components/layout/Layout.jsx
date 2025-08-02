import React from "react";
import BuddyBankHeader from "./BuddyBankHeader";
import AdminHeader from "./AdminHeader";
import ManagerHeader from "../ManagerHeader";

export default function Layout({ user, children }) {
    if (!user) return null;

    return (
        <div>
            {user.role === "ROLE_ADMIN" && <AdminHeader user={user} />}
            {user.role === "ROLE_MANAGER" && <ManagerHeader user={user} />}
            {user.role === "ROLE_USER" && <BuddyBankHeader user={user} />}

            <main>{children}</main>
        </div>
    );
}
