import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Alert } from 'react-bootstrap';
import MyField from '../components/MyField';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword = () => {
  
  const [forgotPassword, {loading}] = useForgotPasswordMutation()
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values, {}) => {
      await forgotPassword({variables: values})
      setShow(true)
    }
  })


  return (
    <div className="container">

      { show ? 
      
      <Alert variant="success">
        <Alert.Heading>Success</Alert.Heading>
        <p>
          Visit your email
        </p>
      </Alert>
      :
      <form onSubmit={formik.handleSubmit} className="mt-4">

        <MyField 
          formik={formik}
          name='email'
          placeholder='Email'
          type='email'
        />

        <div className="form-row">
          <div className="col-md-6 mb-3 mx-auto">
            <button className="btn btn-primary" type="submit" disabled={loading}>Next</button>
          </div>
        </div>

     </form>}
    </div>
  );
};

export default ForgotPassword
