import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "./componentCSS.css";

const RegistrationModal = ({
  title,
  visible,
  onOk,
  onCancel,
  initialValues,
  props,
  isEditMode,
}) => {
  const [passwordEnabled, setPasswordEnabled] = useState(false);

  useEffect(() => {
    // Reset password enabled state when modal closes or mode switches
    setPasswordEnabled(isEditMode ? false : true);
  }, [isEditMode, visible]);

  const handleCheckboxChange = (e) => {
    setPasswordEnabled(e.target.checked);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      keyboard={false}
      footer={null}
    >
      <Form onFinish={onOk} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Vārds"
          rules={[{ required: true, message: "Ievadi vārdu!" }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Uzvārds"
          rules={[{ required: true, message: "Ievadi uzvārdu!" }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-pasts"
          rules={[{ required: true, message: "Ievadi e-pastu!" }]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>

        {isEditMode && (
          <>
            <Checkbox
              checked={passwordEnabled}
              onChange={handleCheckboxChange}
              style={{ marginBottom: '10px' }}
            >
             Mainīt paroli
            </Checkbox>
            {passwordEnabled && (
              <Form.Item
                name="password"
                label="Jaunā parole"
                rules={[{ required: true, message: "Ievadi jaunu paroli!" }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
            )}
          </>
        )}

        {!isEditMode && (
          <Form.Item
            name="password"
            label="Parole"
            rules={[{ required: true, message: "Ievadi paroli!" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        )}

        <Form.Item>
          <Button className="modal-submit" htmlType="submit" block>
            {props}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegistrationModal;
