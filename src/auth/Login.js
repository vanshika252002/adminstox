import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@mui/joy/Input";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import IconButton from "@mui/joy/IconButton";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import {useDispatch} from 'react-redux'
import { login_user } from "../reduxData/auth/authAction";
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import ICONS from "../assets";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e, name) => {
    const { value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    const validationErrors = validateField(name, value);
    setErrors({
      ...errors,
      [name]: validationErrors[name],
    });
  };
  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateField = (name, value) => {
    let fieldErrors = {};
    switch (name) {
      case "email":
        if (!value.trim()) {
          fieldErrors[name] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Email is invalid";
        } else {
          fieldErrors[name] = ""; // No error
        }
        break;
      case "password":
        if (!value.trim()) {
          fieldErrors[name] = "Password is required";
        }
        //  else if (!passwordRegex.test(value)) {
        //   fieldErrors[name] =
        //     "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
        // } 
        else {
          fieldErrors[name] = ""; // No error
        }
        break;
      default:
        break;
    }
    return fieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (
          errors[key] !== null &&
          errors[key] !== undefined &&
          errors[key] !== ""
        ) {
          console.log("You have an error ");
          return;
        }
      }
    }

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      const data = { ...formData, role: "admin" };
      await login_user(data,dispatch,navigate);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  return (
    <div style={{  minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'
   }} className="login-bg">
    <Container>
      <Row className="justify-content-center">

        <Col md={6}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <img src={ICONS.STOX_LOGO} height={70} className="mx-auto mb-2 d-block" />
            <h2 className="fw-600 mb-3">Login</h2>
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleChange(e, 'email')}
                />
                {errors.email && (
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.email}
                  </FormHelperText>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <FormLabel>Password</FormLabel>
                <Input
                 placeholder="Enter password"
                  endDecorator={
                    <IconButton
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"
                          style={{ color:'grey' }}
                          weight="bold"
                        />
                      ) : (
                        <i className="fas fa-eye-slash"
                          style={{ color:'grey'}}
                          weight="bold"
                        />
                      )}
                    </IconButton>
                  }
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => handleChange(e, 'password')}
                />
                {errors.password && (
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.password}
                  </FormHelperText>
                )}
              </Form.Group>
              <Button variant="unset"  className="btn common-button w-100" type="submit">
                Login <i class="fa-solid fa-arrow-right-long"></i>
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
  );
};

export default Login;
