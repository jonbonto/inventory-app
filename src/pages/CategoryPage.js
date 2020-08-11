import React, { useContext, useEffect, useState } from "react";
import ProtectedComponent from "../components/ProtectedComponent";
import FirebaseContext from "../contexts/firebase";

function CategoryPage() {
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.categories().onSnapshot((querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setCategories(categories);
    });
    return () => unsubscribe();
  }, [firebase]);

  return (
    <ProtectedComponent>
      <div>Category page</div>
      {categories.map((category) => (
        <div>{category.name}</div>
      ))}
    </ProtectedComponent>
  );
}

export default CategoryPage;
