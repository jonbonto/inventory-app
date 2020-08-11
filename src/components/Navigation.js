import React, { useContext } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import SignOutButton from "./SignOutButton";
import AuthUserContext from "../contexts/session";

const Navigation = (props) => {
  const authUser = useContext(AuthUserContext);
  return <div>{authUser ? <NavigationAuth /> : null}</div>;
};

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.CATEGORY}>Category</Link>
    </li>
    <li>
      <Link to={ROUTES.PRODUCT}>Product</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

export default Navigation;
