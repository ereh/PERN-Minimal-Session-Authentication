import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../utils/UserContext";

export const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <h2>DASHBOARD</h2>
      <div> {JSON.stringify(user, null, 2)} </div>
      <br />
      <button>Logout</button>
    </div>
  );
};
