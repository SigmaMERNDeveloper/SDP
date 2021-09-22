import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormGroup, Input, Button } from "reactstrap";
import "../styles/ForgotPassword.css";

import Axios from "axios";

function ForgotPassword() {
  let history = useHistory();
  const [email, setEmail] = useState("");

  const checkMail = () => {
    Axios.post(`${process.env.REACT_APP_NODE_API_PATH}/check-mail`, {
      email: email,
    }).then((response) => {
      if (response.data.message) {
        alert("E-mail does not Exists!");
      } else {
        localStorage.setItem("reset_token", response.data.reset_token);
        alert(" A mail has been sent to your registered mail address");
        history.push("/");
      }
    });
  };

  return (
    <div className="mail">
      <div className="container">
        <div className="row">
          <div className="mail-link">
            <Form>
              <h2>Enter Your E-mail</h2>
              <FormGroup className="input-tag">
                <Input
                  type="email"
                  placeholder="E-mail"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormGroup>
              <Button
                className="btn-lg btn-warning btn-block mt-3"
                onClick={checkMail}
              >
                submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
