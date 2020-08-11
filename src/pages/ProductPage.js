import React from "react";
import ProtectedComponent from "../components/ProtectedComponent";
import MainLayout from "../components/Layout";

function ProductPage() {
  return (
    <ProtectedComponent>
      <MainLayout>
        <div>ProductPage</div>
      </MainLayout>
    </ProtectedComponent>
  );
}

export default ProductPage;
