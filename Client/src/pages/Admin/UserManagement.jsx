import React from "react";
import UserTable from "../../components/Admin/UserTable";

export default function UserManagement() {
  return (
    <section>
      <h2 className="font-cyber text-neon-pink text-2xl mb-4">
        User Management
      </h2>
      <UserTable />
    </section>
  );
}
