import React from "react";
import moment from "moment";
import { Formik } from 'formik';
import { Card } from 'react-bootstrap';
import * as Yup from 'yup';
import { verifyEmail , checkEmail} from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";

import {
  Icon,
  Form,
  Input,
  Button,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage(props) {
  const dispatch = useDispatch();
   const alert = useAlert();

  return (
    <div>

    <Formik
      initialValues={{
        email: '',
        lastName: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        lastName: Yup.string()
          .required('Last Name is required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastName: values.lastName,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };


          dispatch(checkEmail(dataToSubmit.email)).then(response => {

            if (response.payload.found) {
              alert.show("email aleready exist",{type:'error'});
            }
            else {
              dispatch(verifyEmail(dataToSubmit)).then(response => {

                if (response.payload.success) {
                  alert.show("otp code has been sent to your email" , {type:'info'});
                  props.history.push("/verify")
                } else {
                  alert.show("error in email verification",{type:'error'});
                }
              })
            }
          })



          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (

          <div className="app" >
          <Card  style={{ width: '25rem' , justifyContent: 'center'}} className="p-3 shadow bg-white rounded" >

            <div style={{ height: "90px", display: 'flex', justifyContent: 'center'}}>
              <h2 style={{color:"grey"}}>Sign Up</h2>
            </div>

            <div className="ml-5 mr-5">
              <Form style={{ minWidth: '419px' }} {...formItemLayout} onSubmit={handleSubmit} >

                <Form.Item required >
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.name && touched.name ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.name && touched.name && (
                    <div className="input-feedback">{errors.name}</div>
                  )}
                </Form.Item>

                <Form.Item required >
                  <Input
                    id="lastName"
                    placeholder="Enter your Last Name"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="text"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.lastName && touched.lastName ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="input-feedback">{errors.lastName}</div>
                  )}
                </Form.Item>

                <Form.Item required  hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                  <Input
                    id="email"
                    placeholder="Enter your Email"
                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item required  hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </Form.Item>

                <Form.Item required  hasFeedback>
                  <Input
                    id="confirmPassword"
                    placeholder="Enter your confirmPassword"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="input-feedback">{errors.confirmPassword}</div>
                  )}
                </Form.Item>

                <Form.Item className="mt-5">
                  <Button  shape="round" style={{ minWidth: '100%', height:'40px' , color:'white', background: 'linear-gradient(265deg, rgba(2,0,36,1) 0%, rgba(88,93,205,1) 45%, rgba(0,212,255,1) 100%)'}} disabled={isSubmitting} onClick={handleSubmit}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
            </Card>
          </div>
        );
      }}
    </Formik>
    </div>
  );
};


export default RegisterPage
