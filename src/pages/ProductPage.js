import React from "react";
import ProtectedComponent from "../components/ProtectedComponent";

function ProductPage() {
  return (
    <ProtectedComponent>
      <div>ProductPage</div>
    </ProtectedComponent>
  );
}

export default ProductPage;
