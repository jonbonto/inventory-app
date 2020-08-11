import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import FirebaseContext from "../contexts/firebase";
import * as ROUTES from "../constants/routes";

const SignOutButton = (props) => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const logout = () => {
    firebase
      .doSignOut()
      .then(() => {
        history.push(ROUTES.SIGN_IN);
      })
      .catch((error) => {
        console.log("Error happened when try to logout");
      });
  };

  return (
    <button type="button" onClick={logout}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
