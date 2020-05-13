import React , {useState} from "react";
import { Alert } from 'react-bootstrap';
import { Button } from 'antd';

function ErrorPage(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{props.header}</Alert.Heading>
        <p>
        {props.body}
        </p>
      </Alert>
    );
  }


  return <Button shape="round" style={{ minWidth: '100%', height:'40px' , color:'white', background: 'linear-gradient(265deg, rgba(2,0,36,1) 0%, rgba(88,93,205,1) 45%, rgba(0,212,255,1) 100%)'}} onClick={() => setShow(true)}>Show Alert</Button>;
}

export default ErrorPage;
