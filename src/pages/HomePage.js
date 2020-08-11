import React, { useContext, useState, useEffect } from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import ProtectedComponent from "../components/ProtectedComponent";
import MainLayout from "../components/Layout";
import FirebaseContext from "../contexts/firebase";

function HomePage() {
  const firebase = useContext(FirebaseContext);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

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
        <div className="site-statistic-card">
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Categories"
                  value={categoriesCount}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Products"
                  value={productsCount}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </MainLayout>
    </ProtectedComponent>
  );
}

export default HomePage;
