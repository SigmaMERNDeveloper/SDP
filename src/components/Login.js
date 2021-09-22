import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { Form, FormGroup, Input, Button } from "reactstrap";
import Spinner from "react-bootstrap/Spinner";

import Axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {
  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let loginDetails = {
    email: email,
    password: password,
  };

  const Login = () => {
    Axios.post(
      `${process.env.REACT_APP_NODE_API_PATH}/login`,
      loginDetails
    ).then((response) => {
      if (!response.data.auth) {
        setLoading(false);
      } else {
        localStorage.setItem("token", response.data.token);
        history.push("/dashboard");
      }
    });
    setLoading(true);
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  }, [history]);

  return (
    <div className="login">
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="entire-form col-md-10 d-flex">
            <div className="logo col-md-6 text-center">
              <img src="/images/logo.png" alt="logo" />
            </div>
            <div className="login-form col-md-6 text-center">
              <Form>
                <h2 className="text-center">Login</h2>
                <FormGroup className="input-tag">
                  <Input
                    type="email"
                    placeholder="E-mail"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="input-tag">
                  <Input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <div className="login-buttons text-center">
                  {loading ? (
                    <Spinner animation="border" variant="warning" />
                  ) : (
                    <Button
                      className="btn-lg  mt-3"
                      style={{ background: "#2163bf" }}
                      onClick={Login}
                    >
                      Login
                    </Button>
                  )}
                </div>
                <div className="forgot">
                  <a href="/forgot-password">Forgot Password ?</a>
                </div>
                <div className="content">
                  <pre>
                    To Create an Account please use the Mobile Application
                  </pre>
                  <a href="/">Click here to download the Police Eye App</a>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
