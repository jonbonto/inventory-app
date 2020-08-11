import React, { useContext, useState, useEffect } from "react";
import { Card, Typography } from "antd";
import ProtectedComponent from "../components/ProtectedComponent";
import MainLayout from "../components/Layout";
import FirebaseContext from "../contexts/firebase";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

function HomePage() {
  const firebase = useContext(FirebaseContext);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const dataCount = [
    {
      name: "Category",
      count: categoriesCount,
    },
    {
      name: "Product",
      count: productsCount,
    },
  ];

  useEffect(() => {
    const unsubscribeCategories = firebase
      .categories()
      .onSnapshot((querySnapshot) => {
        setCategoriesCount(querySnapshot.size);
      });

    const unsubscribeProducts = firebase
      .products()
      .onSnapshot((querySnapshot) => {
        setProductsCount(querySnapshot.size);
      });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, [firebase]);

  return (
    <ProtectedComponent>
      <MainLayout>
        <div className="homepage-container">
          <Card style={{ maxWidth: 600 }}>
            <Typography.Title level={3}>
              Products and Categories
            </Typography.Title>
            <BarChart width={480} height={250} data={dataCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                allowDecimals={false}
                label={{ value: "Counts", angle: -90 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#40a9ff" />
            </BarChart>
          </Card>
        </div>
      </MainLayout>
    </ProtectedComponent>
  );
}

export default HomePage;
