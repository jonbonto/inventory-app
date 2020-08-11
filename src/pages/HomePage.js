import React from "react";
import ProtectedComponent from "../components/ProtectedComponent";

function HomePage() {
  return (
    <ProtectedComponent>
      <div>Home Page</div>
    </ProtectedComponent>
  );
}

export default HomePage;
