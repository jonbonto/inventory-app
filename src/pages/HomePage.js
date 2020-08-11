import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import FirebaseContext from "../contexts/firebase";
import * as ROUTES from "../constants/routes";

function HomePage() {
  const history = useHistory();
  const firebase = useContext(FirebaseContext);
  const [error, setError] = useState("");

  const logout = () => {
    firebase
      .doSignOut()
      .then(() => {
        history.push(ROUTES.SIGN_IN);
      })
      .catch((error) => {
        setError("Error happened when try to logout");
      });
  };
  return (
    <div>
      Home Page
      <button onClick={logout}>Logout</button>
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default HomePage;
