import React from "react";
import ProtectedComponent from "../components/ProtectedComponent";

function CategoryPage() {
  return (
    <ProtectedComponent>
      <div>Category page</div>
    </ProtectedComponent>
  );
}

export default CategoryPage;
