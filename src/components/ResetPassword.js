import React, { useState } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { useHistory } from "react-router-dom";

import "../styles/ForgotPassword.css";
import Axios from "axios";

function ResetPassword() {
  let history = useHistory();

  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const updatePassword = () => {
    if (newPassword === reEnterPassword) {
      Axios.put(`${process.env.REACT_APP_NODE_API_PATH}/reset-password`, {
        newPassword: newPassword,
        reset_token: localStorage.getItem("reset_token"),
      }).then((response) => {
        if (response.data) {
          localStorage.removeItem("reset_token");
          history.push("/");
        } else {
          alert("Something Went Wrong!");
        }
      });
    } else {
      alert("password's does not match!");
    }
  };

  return (
    <div className="mail">
      <div className="container">
        <div className="row">
          <div className="tot-form">
            <div className="pwd">
              <Form>
                <h2 className="text-center">Forgot Password</h2>
                <FormGroup className="input-tag">
                  <Input
                    type="password"
                    placeholder="Enter New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="input-tag">
                  <Input
                    type="password"
                    placeholder="Re-Enter Password"
                    onChange={(e) => setReEnterPassword(e.target.value)}
                  />
                </FormGroup>
                <Button
                  className="btn-lg btn-success btn-block mt-3"
                  onClick={updatePassword}
                >
                  submit
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
