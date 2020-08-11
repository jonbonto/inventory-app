import React, { useContext, useEffect, useState } from "react";
import { Table, Space } from "antd";
import ProtectedComponent from "../components/ProtectedComponent";
import FirebaseContext from "../contexts/firebase";
import Layout from "../components/Layout";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },

  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

function CategoryPage() {
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.categories().onSnapshot((querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          key: doc.data().id,
          description: "description",
        });
      });
      setCategories(categories);
    });
    return () => unsubscribe();
  }, [firebase]);

  return (
    <ProtectedComponent>
      <Layout>
        <div>Category page</div>
        <Table columns={columns} dataSource={categories} />
      </Layout>
    </ProtectedComponent>
  );
}

export default CategoryPage;
