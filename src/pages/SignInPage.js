import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Typography, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import * as ROUTES from "../constants/routes";
import FirebaseContext from "../contexts/firebase";
import { useHistory } from "react-router-dom";
import AuthUserContext from "../contexts/session";

const { Title } = Typography;

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

const SignInForm = ({ firebase, goHome }) => {
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    const { email, password } = values;
    setLoading(true);
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        goHome();
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Login Error", error.message);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={loading}
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

const SignInPage = () => {
  const firebase = useContext(FirebaseContext);
  let history = useHistory();
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    if (authUser) {
      history.push(ROUTES.HOME);
    }
  }, [authUser, history]);

  function goHome() {
    history.push(ROUTES.HOME);
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <Title level={3} style={{ textAlign: "center" }}>
          Sign In
        </Title>
        <SignInForm firebase={firebase} goHome={goHome} />
      </div>
    </div>
  );
};

export default SignInPage;
