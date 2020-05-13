import React, { useState , useEffect } from "react";
import { withRouter } from "react-router-dom";
import { loginUser , checkEmail , registerUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
import { Card } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAlert } from "react-alert";
import axios from 'axios';
import moment from "moment";


const { Title } = Typography;

function LoginPage(props) {

  const alert= useAlert();
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  async function getFacebookUserData(access_token) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: [ 'email', 'first_name', 'last_name'].join(','),
        access_token: access_token,
      },
    });
    return data;
  };

  const responseFacebook = (response) => {

    getFacebookUserData(response.accessToken).then((values)=>{
      let dataToSubmit = {
        email: values.email,
        password: 'password',
        name: values.first_name,
        lastName: values.last_name,
        image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
      };

      dispatch(checkEmail(dataToSubmit.email)).then(response => {

        if (!response.payload.found) {
          dispatch(registerUser(dataToSubmit , false)).then(response => {
            if (response.payload.success) {

            } else {
              alert.show(response.payload.err.errmsg,{type:'error'});
            }

            dispatch(loginUser(dataToSubmit,false))
              .then(response => {
                  window.localStorage.setItem('userId', response.payload.userId);
                alert.show('login via facebook successfully',{type:'success'});
                  props.history.push("/");
              })
              .catch(err => {
                console.log(err);
                  alert.show('error');
              });

          });
        }
        else {
          dispatch(loginUser(dataToSubmit,false))
            .then(response => {
                window.localStorage.setItem('userId', response.payload.userId);
              alert.show('login via facebook successfully',{type:'success'});
                props.history.push("/");
            })
            .catch(err => {
              console.log(err);
                alert.show('error');
            });
        }

      })

    });

  }

  const responseGoogle = (response) => {
    let values=response.Pt;
    let dataToSubmit = {
      email: values.yu,
      password: 'password',
      name: values.pW,
      lastName: values.qU,
      image: values.QK
    };

    dispatch(checkEmail(dataToSubmit.email)).then(response => {

      if (!response.payload.found) {
        dispatch(registerUser(dataToSubmit , false)).then(response => {
          if (response.payload.success) {

          } else {
            alert.show(response.payload.err.errmsg,{type:'error'});
          }

          dispatch(loginUser(dataToSubmit,false))
            .then(response => {
                window.localStorage.setItem('userId', response.payload.userId);
                alert.show('login via google successfully',{type:'success'});
                props.history.push("/");
            })
            .catch(err => {
              console.log(err);
                alert.show('error');
            });

        });
      }
      else {
        dispatch(loginUser(dataToSubmit,false))
          .then(response => {
              window.localStorage.setItem('userId', response.payload.userId);
              alert.show('login via google successfully',{type:'success'});
              props.history.push("/");
          })
          .catch(err => {
            console.log(err);
              alert.show('error');
          });
      }


    })
  }

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };


          dispatch(loginUser(dataToSubmit))
            .then(response => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.email);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/");
              } else {
                setFormErrorMessage('Check out your Account or Password again')
              }
            })
            .catch(err => {
              setFormErrorMessage('Check out your Account or Password again')
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
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
          <div className="app">
            <Card  style={{ width: '25rem' , justifyContent: 'center'}} className="p-5 shadow bg-white rounded" >
              <div style={{ height: "90px", display: 'flex', justifyContent: 'center'}}>
                <h2 style={{color:"grey"}}>Sign In</h2>
              </div>
              <form onSubmit={handleSubmit} style={{ width: '300px' , height:'400px' }}>

                <Form.Item required>
                  <Input
                    id="email"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Enter your email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error ' : 'text-input'
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item required>
                  <Input
                    id="password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Enter your password"
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

                {formErrorMessage && (
                  <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                )}

                <Form.Item >
                  <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember me</Checkbox>
                  <a className="login-form-forgot" href="/forgot_pass" style={{ float: 'right' }}>
                    forgot password
                    </a>
                  <div>
                    <Button  shape="round" htmlType="submit" className="login-form-button" style={{ minWidth: '100%', height:'40px' , color:'white', background: 'linear-gradient(265deg, rgba(2,0,36,1) 0%, rgba(88,93,205,1) 45%, rgba(0,212,255,1) 100%)'}} disabled={isSubmitting} onSubmit={handleSubmit}>
                      Log in
                  </Button>
                  </div>
                  <div style={{marginTop:15 , display:'flex',justifyContent: 'center' }}>
                  or Sign in with:
                  </div>

                  <FacebookLogin
                    appId="195729758083578"
                    callback={responseFacebook}
                    render={renderProps => (
                      <Button  shape="round"  className="login-form-button" style={{ margin:'10px 10px' , minWidth: '43%', height:'40px' , color:'white'}} onClick={renderProps.onClick} >
                        <Icon type="facebook" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
                      </Button>
                    )}
                  />

                  <GoogleLogin
                    render={renderProps => (
                      <Button  shape="round"  className="login-form-button" style={{ margin:'10px 10px' , minWidth: '43%', height:'40px' , color:'white'}} onClick={renderProps.onClick} >
                        <Icon type="google" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
                      </Button>
                     )}

                    clientId="238488207726-jsaqciv63qv0i37a5tm530e9iqghndm8.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  />

                  <hr/>
                  <div style={{color:'grey' , paddingTop:0 , display:'flex',justifyContent: 'center' }}>
                  <p>Not a member?  </p>  <a href="/register">Sign Up!</a>
                  </div>
                </Form.Item>
              </form>
            </Card>
          </div>
        );
      }}
    </Formik>
  );
};

export default withRouter(LoginPage);
