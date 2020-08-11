import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import AuthUserContext from "../contexts/session";

function ProtectedComponent({ children }) {
  const authUser = useContext(AuthUserContext);
  const history = useHistory();

  useEffect(() => {
    if (!authUser) {
      history.push(ROUTES.SIGN_IN);
    }
  }, [authUser]);
  return children;
}

export default ProtectedComponent;
