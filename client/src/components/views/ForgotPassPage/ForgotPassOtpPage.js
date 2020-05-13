import React from "react";
import moment from "moment";
import { Formik } from 'formik';
import { Card } from 'react-bootstrap';
import * as Yup from 'yup';
import { checkEmail , verifyEmail ,updatePass } from "../../../_actions/user_actions";
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

  if(!props.user.verifyData)
  {
      return (

        <div className="app" >
          <Card  style={{ width: '25rem' , justifyContent: 'center'}} className="p-3 shadow bg-white rounded" >
            <ErrorPage body="Don't jump directly to this page , go first to forgot password page " header="Error Occured!!"/>
          </Card>
        </div>

      );
  }

  let dataToSubmit = props.user.verifyData.data;
  let otp = props.user.verifyData.otp;

  return (

    <Formik
      initialValues={{
        otp: '',
        password:''
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string()
          .required('otp is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required')
      })}

      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          if(values.otp !=otp)
            alert.show("otp not matched ",{type:'error'});
          else
          {
            dispatch(updatePass({...dataToSubmit , newPassword:values.password})).then(response => {
              if (response.payload.success) {
                alert.show('password reset successfully',{type:'success'});

                props.history.push("/login");
              } else {
                alert.show(response.payload.err.errmsg,{type:'error'})
              }
            })
          }
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

                <Form.Item required >
                  <Input
                    id="otp"
                    placeholder="Enter the otp"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="text"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.otp && touched.otp ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.otp && touched.otp && (
                    <div className="input-feedback">{errors.otp}</div>
                  )}
                </Form.Item>

                <Form.Item required  hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                  <Input
                    id="password"
                    placeholder="Enter your new password"
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
