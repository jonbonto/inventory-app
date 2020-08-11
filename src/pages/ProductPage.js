import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Input,
  Form,
  Skeleton,
  Popconfirm,
  notification,
  InputNumber,
  Typography,
  Select,
} from "antd";
import ProtectedComponent from "../components/ProtectedComponent";
import FirebaseContext from "../contexts/firebase";
import Layout from "../components/Layout";

const { Title } = Typography;
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

function CategoryPage() {
  const firebase = useContext(FirebaseContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    confirmLoading: false,
  });
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" warning onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
            okType="danger"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (category) => {
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      id: category.key,
    });
    setModal({
      visible: true,
      title: `Edit ${category.name}`,
      content: AddForm,
      edit: true,
    });
  };

  const handleDelete = (product) => {
    firebase
      .products()
      .doc(product.key)
      .delete()
      .then(function () {
        openNotificationWithIcon(
          "success",
          product.name,
          `Category ${product.name} successfully deleted!`
        );
      })
      .catch(function (error) {
        openNotificationWithIcon("error", product.name, error.message);
      });
  };

  const AddForm = (
    <Form {...layout} form={form} name="control-hooks">
      <Form.Item name="id" label="Name" rules={[{ required: true }]} hidden />
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input />
      </Form.Item>

      <Form.Item name="stock" label="Stock">
        <InputNumber min={0} defaultValue={0} />
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select>
          {categories.map((category) => (
            <Option value={category.id}>{category.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );

  useEffect(() => {
    const unsubscribe = firebase.categories().onSnapshot((querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setCategories(categories);
    });
    return () => {
      unsubscribe();
    };
  }, [firebase]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (categories.length) {
      unsubscribe = firebase.products().onSnapshot((querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          const categoryId = doc.data().category;
          const category = categories.find(
            (category) => categoryId === category.id
          );
          products.push({
            ...doc.data(),
            key: doc.id,
            category,
            categoryName: category.name,
          });
        });
        setProducts(products);
        setLoading(false);
      });
    }

    return () => {
      unsubscribe();
    };
  }, [categories, firebase]);

  const handleAdd = () => {
    form.resetFields();
    setModal({
      visible: true,
      title: "Add Product",
      content: AddForm,
    });
  };

  const handleOk = () => {
    setModal((modal) => ({
      ...modal,
      visible: true,
      confirmLoading: true,
    }));

    const { name, description, category, stock } = form.getFieldsValue();

    if (modal.edit) {
      const { id } = form.getFieldsValue();
      const docRef = firebase.products().doc(id);
      docRef
        .update({
          name,
          stock,
          category,
          description: description ?? "",
        })
        .then(function () {
          setModal({
            visible: false,
            confirmLoading: false,
          });
          openNotificationWithIcon("success", name, "Successfully edited");
        })
        .catch(function (error) {
          openNotificationWithIcon("error", name, error.message);
        });
    } else {
      firebase
        .products()
        .add({
          name,
          stock,
          category,
          description: description ?? "",
        })
        .then(function (docRef) {
          setModal({
            visible: false,
            confirmLoading: false,
          });
          openNotificationWithIcon("success", name, "Successfully added");
        })
        .catch(function (error) {
          openNotificationWithIcon("error", name, error.message);
        });
    }
  };

  const handleCancel = () => {
    setModal({
      visible: false,
    });
  };

  return (
    <ProtectedComponent>
      <Layout>
        <div className="title">
          <Title level={3}>Products</Title>

          <Button type="primary" onClick={handleAdd}>
            Add Product
          </Button>
        </div>
        <Modal
          title={modal.title}
          visible={modal.visible}
          onOk={handleOk}
          confirmLoading={modal.confirmLoading}
          onCancel={handleCancel}
        >
          {modal.content}
        </Modal>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table columns={columns} dataSource={products} />
        )}
      </Layout>
    </ProtectedComponent>
  );
}

export default CategoryPage;
