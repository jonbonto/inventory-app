import React from "react";
import ProtectedComponent from "../components/ProtectedComponent";
import MainLayout from "../components/Layout";

function HomePage() {
  return (
    <ProtectedComponent>
      <MainLayout>
        <div>Home Page</div>
      </MainLayout>
    </ProtectedComponent>
  );
}

export default HomePage;
