import React, { useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import SignOutButton from "./SignOutButton";
import * as ROUTES from "../constants/routes";
import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  let menuKey = "home";
  const { pathname } = useLocation();

  if (pathname !== "/") {
    menuKey = pathname.substring(1);
  }

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={[menuKey]} mode="inline">
          <Menu.Item key="home" icon={<PieChartOutlined />}>
            <Link to={ROUTES.HOME}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="product" icon={<DesktopOutlined />}>
            <Link to={ROUTES.PRODUCT}>Products</Link>
          </Menu.Item>
          <Menu.Item key="category" icon={<TagOutlined />}>
            <Link to={ROUTES.CATEGORY}>Categories</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background header"
          style={{ padding: 0 }}
        >
          <SignOutButton />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Link to={ROUTES.HOME}>Home</Link>
            </Breadcrumb.Item>
            {menuKey === "product" && (
              <Breadcrumb.Item>Product</Breadcrumb.Item>
            )}
            {menuKey === "category" && (
              <Breadcrumb.Item>Category</Breadcrumb.Item>
            )}
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
