import "../App.css";
import { Form, Input, Button, Checkbox, message, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const errormsg = () => {
    messageApi.open({
      type: "error",
      content: "Nepareizs lietotajvards vai parole!",
    });
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Jus veiksmigi iegajat sistema!",
    });
  };
  async function make() {
    const reissCollection = collection(db, "reisi");
    const querySnapshot = await getDocs(reissCollection);
    let maxId = 0;
    querySnapshot.forEach((doc) => {
      const id = parseInt(doc.id.substring(1)); // iznem # no rindas lai dabut pedeja identifikatoru      
      if (id > maxId) {
        maxId = id;
      }
    });

    const newId = maxId + 1;
    await setDoc(doc(db, "reisi", `#${newId}`), {
      nosaukums: "Liepaja - Rucava",
      laiks: "14h",
    });
  }

  const handleLogin = (password, email) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        success();
        const user = userCredential.user;
        navigate("/lietotajureg");
      })
      .catch((error) => {
        errormsg();
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <>
      {contextHolder}
      <div className="login-form-container">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Ievadiet e-pastu",
              },
            ]}
          >
            <Input
              onChange={(e) => setEmail(e.target.value)}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="E-pasts"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Ievadiet paroli",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Parole"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Atcerēties mani</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => handleLogin(password, email)}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Pieslēgties
            </Button>
            Nav konta? <a href="">Reģistrē to!</a>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default App;
