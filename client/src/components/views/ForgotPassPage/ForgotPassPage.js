import React from "react";
import moment from "moment";
import { Formik } from 'formik';
import { Card } from 'react-bootstrap';
import * as Yup from 'yup';
import { checkEmail , verifyEmail } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import ErrorPage from "../ErrorPage/ErrorPage.js";
import { useAlert } from 'react-alert';

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

function VerifyPage(props) {
  const dispatch = useDispatch();
  const alert = useAlert();



  return (

    <Formik
      initialValues={{
        email: ''
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('email is required')
      })}

      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email
          };


          dispatch(checkEmail(dataToSubmit.email)).then(response => {

            if (response.payload.found) {
              dispatch(verifyEmail(dataToSubmit)).then(response => {

                if (response.payload.success) {
                  alert.show("otp code has been sent to your email" , {type:'info'});
                  props.history.push("/forgot_pass_otp")
                } else {
                  alert.show("error in email verification",{type:'error'});
                }
              })

            }
            else {
            alert.show("email do not exist",{type:'error'});
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
              <h2 style={{color:"grey"}}>Email Verification</h2>
            </div>

            <div className="ml-5 mr-5">
              <Form style={{ minWidth: '419px' }} {...formItemLayout} onSubmit={handleSubmit} >

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
  );
};


export default VerifyPage
