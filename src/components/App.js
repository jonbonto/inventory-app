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
import { Spin } from "antd";

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
      setLoading(false);
    });

    return () => listener();
  }, [firebase]);

  if (loading)
    return (
      <div className="loading-full">
        <Spin tip="Loading..." size="large" />
      </div>
    );

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
