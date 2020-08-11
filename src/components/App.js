import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "./Navigation";
import * as ROUTES from "../constants/routes";
import SignInPage from "../pages/SignInPage";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../pages/CategoryPage";
import FirebaseContext from "../contexts/firebase";
import AuthUserContext from "../contexts/session";

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });

    return () => listener();
  }, [firebase]);

  return (
    <AuthUserContext.Provider value={authUser}>
      <Router>
        <div>
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.HOME} exact={true} component={HomePage} />
          <Route path={ROUTES.PRODUCT} component={ProductPage} />
          <Route path={ROUTES.CATEGORY} component={CategoryPage} />
        </div>
      </Router>
    </AuthUserContext.Provider>
  );
};

export default App;
