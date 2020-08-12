import React, { useContext, useState, useEffect } from "react";
import { Card, Typography, Row, Col, Grid } from "antd";
import ProtectedComponent from "../components/ProtectedComponent";
import MainLayout from "../components/Layout";
import FirebaseContext from "../contexts/firebase";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

function HomePage() {
  const firebase = useContext(FirebaseContext);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [productCountPerCategory, setProductCountPerCategory] = useState({});
  const [categoryMapper, setCategoryMapper] = useState({});

  const screens = Grid.useBreakpoint();
  let chartWidth = 300;
  if ((screens.md && !screens.lg) || screens.xl) {
    chartWidth = 480;
  }

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
        const mapper = {};
        querySnapshot.forEach((doc) => {
          mapper[doc.id] = doc.data().name;
        });
        setCategoryMapper(mapper);
      });

    const unsubscribeProducts = firebase
      .products()
      .onSnapshot((querySnapshot) => {
        const products = {};
        querySnapshot.forEach((doc) => {
          const categoryId = doc.data().category;
          if (categoryId in Object.keys(products)) {
            products[categoryId]++;
          } else {
            products[categoryId] = 1;
          }
          setProductCountPerCategory(products);
        });
        setProductsCount(querySnapshot.size);
      });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, [firebase]);

  let dataProductPerCategory = Object.keys(productCountPerCategory)
    .map((catId) => ({
      category: categoryMapper[catId],
      count: productCountPerCategory[catId],
    }))
    .reduce((acc, product) => {
      if (!product.category) {
        let prod = acc.find((prod) => prod.category === "uncategorized");
        acc = acc.filter((prod) => prod.category !== "uncategorized");
        if (prod) {
          prod.count += product.count;
        } else {
          prod = {
            category: "uncategorized",
            count: product.count,
          };
        }
        acc.push(prod);
      } else {
        acc.push(product);
      }
      return acc;
    }, []);

  return (
    <ProtectedComponent>
      <MainLayout>
        <div className="homepage-container">
          <Row gutter={{ lg: 16 }} jusify="center" style={{ width: "100%" }}>
            <Col xs={24} lg={12} style={{ marginBottom: 24 }}>
              <Card style={{ justifyContent: "center", display: "flex" }}>
                <Typography.Title level={3}>
                  Products and Categories
                </Typography.Title>
                <BarChart width={chartWidth} height={250} data={dataCount}>
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
            </Col>
            <Col xs={24} lg={12}>
              <Card style={{ justifyContent: "center", display: "flex" }}>
                <Typography.Title level={3}>
                  Products per Category
                </Typography.Title>
                <BarChart
                  width={chartWidth}
                  height={250}
                  data={dataProductPerCategory}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis
                    allowDecimals={false}
                    label={{ value: "Counts", angle: -90 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#40a9ff" />
                </BarChart>
              </Card>
            </Col>
          </Row>
        </div>
      </MainLayout>
    </ProtectedComponent>
  );
}

export default HomePage;
