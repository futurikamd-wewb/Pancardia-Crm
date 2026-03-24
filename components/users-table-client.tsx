"use client";

import { useState } from "react";
import type { UserListItem } from "@/lib/repositories/users";

export function UsersTableClient({ users }: Readonly<{ users: UserListItem[] }>) {
  const [rows, setRows] = useState(users);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function saveUser(user: UserListItem) {
    setSavingId(user.id);
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive
      })
    });
    setSavingId(null);

    if (!response.ok) {
      return;
    }
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((user, index) => (
          <tr key={user.id}>
            <td>
              <input
                value={user.fullName}
                onChange={(event) => {
                  const next = [...rows];
                  next[index] = { ...user, fullName: event.target.value };
                  setRows(next);
                }}
              />
            </td>
            <td>{user.email}</td>
            <td>
              <select
                value={user.role}
                onChange={(event) => {
                  const next = [...rows];
                  next[index] = { ...user, role: event.target.value as UserListItem["role"] };
                  setRows(next);
                }}
              >
                <option>ADMIN</option>
                <option>MARKETING</option>
                <option>COUNSELOR</option>
                <option>CONTENT</option>
              </select>
            </td>
            <td>
              <select
                value={user.isActive ? "ACTIVE" : "INACTIVE"}
                onChange={(event) => {
                  const next = [...rows];
                  next[index] = { ...user, isActive: event.target.value === "ACTIVE" };
                  setRows(next);
                }}
              >
                <option>ACTIVE</option>
                <option>INACTIVE</option>
              </select>
            </td>
            <td>
              <button
                className="ghost-button"
                disabled={savingId === user.id}
                onClick={() => saveUser(user)}
                type="button"
              >
                {savingId === user.id ? "Saving..." : "Save"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
