/**
 * 登录
 */
import React from "react";
import { Form, Input, Button } from "antd";

const P2PLogin = ({ loginHandler }) => {
  // 提交表单的处理函数
  const handleSubmit = (values) => {
    console.log(values);
    loginHandler(values.userName, values.roomId);
  };

  return (
    <Form onFinish={handleSubmit} className="login-form">
      {/* 用户名输入框 */}
      <Form.Item name="userName" rules={[{ required: true, message: "请输入用户名!" }]}>
        <Input placeholder="请输入用户名" />
      </Form.Item>

      {/* 房间号输入框 */}
      <Form.Item name="roomId" rules={[{ required: true, message: "请输入房间号!" }]}>
        <Input placeholder="请输入房间号" />
      </Form.Item>

      {/* 登录按钮 */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-join-button">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

// 导出组件
export default P2PLogin;
