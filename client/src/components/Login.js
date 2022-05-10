import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/use-auth";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  const auth = useAuth();

  const login = async (e) => {
    e.preventDefault();
    await auth.login(username, password); // todo add error message if failed
    navigate(`/`);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={login}>
        <input
          name="username"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
