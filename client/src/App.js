import { Login } from "./components/Login";
import { Home } from "./components/Home";
import React from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { PageNotFound } from "./components/PageNotFound";

import { AuthProvider, useAuth } from "./utils/use-auth.js";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          exact
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" exact element={<Login />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

// https://stackoverflow.com/questions/71550567/how-to-make-useeffect-in-authprovider-runs-first-then-call-usecontext
function RequireAuth({ children }) {
  const auth = useAuth();
  if (auth.user === undefined) {
    return null;
  }
  return auth.user ? children : <Navigate to="/login" />;
  //<Navigate to="/login" state={{ from: location }} replace />;
}
