import React, { useContext, useEffect, useState } from "react";
import { Table, Space, Button, Modal, Input, Form, Skeleton } from "antd";
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

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function CategoryPage() {
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    confirmLoading: false,
  });
  const [form] = Form.useForm();

  const AddForm = (
    <Form {...layout} form={form} name="control-hooks">
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input />
      </Form.Item>
    </Form>
  );

  useEffect(() => {
    const unsubscribe = firebase.categories().onSnapshot((querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          key: doc.data().id,
        });
      });
      setCategories(categories);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [firebase]);

  const showModal = () => {
    setModal({
      visible: true,
      content: AddForm,
    });
  };

  const handleOk = () => {
    setModal((modal) => ({
      ...modal,
      visible: true,
      confirmLoading: true,
    }));

    const { name, description } = form.getFieldsValue();

    firebase
      .categories()
      .add({
        name,
        description,
      })
      .then(function (docRef) {
        setModal({
          visible: false,
          confirmLoading: false,
        });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  const handleCancel = () => {
    setModal({
      visible: false,
    });
  };

  return (
    <ProtectedComponent>
      <Layout>
        <div>Category page</div>
        <Button type="primary" onClick={showModal}>
          Add Category
        </Button>
        <Modal
          title="Title"
          visible={modal.visible}
          onOk={handleOk}
          confirmLoading={modal.confirmLoading}
          onCancel={handleCancel}
        >
          <p>{modal.content}</p>
        </Modal>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table columns={columns} dataSource={categories} />
        )}
      </Layout>
    </ProtectedComponent>
  );
}

export default CategoryPage;
