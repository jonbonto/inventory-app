import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "./Navigation";
import * as ROUTES from "../constants/routes";
import SignInPage from "../pages/SignInPage";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../pages/CategoryPage";

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.HOME} exact={true} component={HomePage} />
      <Route path={ROUTES.PRODUCT} component={ProductPage} />
      <Route path={ROUTES.CATEGORY} component={CategoryPage} />
    </div>
  </Router>
);

export default App;
