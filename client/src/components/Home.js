import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/use-auth.js";
import api from "../utils/api";

export const Home = () => {
  const auth = useAuth();
  const [users, setUsers] = useState();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        auth.logout();
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <h2>
        {auth.user ? "Logged in as: " + auth.user.email : "Not logged in."}
      </h2>
      <br />
      <button
        onClick={() => {
          // call logout
          auth.logout();
        }}
      >
        Logout
      </button>
      <h2>Users:</h2>
      {users
        ? users.map((user) =>
            user.id === auth.user.id ? (
              <div key={user.id}>
                <b>
                  {user.id}. {user.username} ({user.email})
                </b>
              </div>
            ) : (
              <div key={user.id}>
                {user.id}. {user.username} ({user.email})
              </div>
            )
          )
        : ""}
    </div>
  );
};
