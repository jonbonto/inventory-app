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
} from "antd";
import ProtectedComponent from "../components/ProtectedComponent";
import FirebaseContext from "../contexts/firebase";
import Layout from "../components/Layout";

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
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <a>Delete</a>
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

  const handleDelete = (category) => {
    firebase
      .categories()
      .doc(category.key)
      .delete()
      .then(function () {
        openNotificationWithIcon(
          "success",
          category.name,
          `Category ${category.name} successfully deleted!`
        );
      })
      .catch(function (error) {
        openNotificationWithIcon("error", category.name, error.message);
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
    </Form>
  );

  useEffect(() => {
    const unsubscribe = firebase.categories().onSnapshot((querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      setCategories(categories);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [firebase]);

  const handleAdd = () => {
    form.resetFields();
    setModal({
      visible: true,
      title: "Add Category",
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

    if (modal.edit) {
      const { id } = form.getFieldsValue();
      const docRef = firebase.categories().doc(id);
      docRef
        .update({
          name,
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
        .categories()
        .add({
          name,
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
        <div>Category page</div>
        <Button type="primary" onClick={handleAdd}>
          Add Category
        </Button>
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
          <Table columns={columns} dataSource={categories} />
        )}
      </Layout>
    </ProtectedComponent>
  );
}

export default CategoryPage;
