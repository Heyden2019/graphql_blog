import { useFormik } from 'formik';
import Link from 'next/link';
import React from 'react'
import MyField from '../components/MyField';
import { MeDocument, useLoginMutation } from '../generated/graphql';

const Login = () => {
  
  const [login] = useLoginMutation({ update: (store, {data}) => {
    if(data?.login.user) {
      store.writeQuery({
        query: MeDocument,
        data: {
          me: {...data.login.user}
        }
      })
    }

  }})

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: ''
    },
    onSubmit: async (values, {setFieldError}) => {
      const {data}= await login({variables: values})
      if(data?.login.errors) {
        data?.login.errors.forEach(({field, message}) => {
          setFieldError(field, message)
        })
      } else if (data?.login.user) {
        //  redirect will be here
        return
      }
    }
  })


  return (
    <div className="container">
     <form onSubmit={formik.handleSubmit} className="mt-4">

      <MyField 
        formik={formik}
        name='usernameOrEmail'
        placeholder='Username or email'
        type='text'
      />

      <MyField 
        formik={formik}
        name='password'
        placeholder='Password'
        type='password'
      />

        <div className="form-row">
          <div className="col-md-6 mb-3 mx-auto">
            <button className="btn btn-primary" type="submit">Login</button>
            <Link href="/register"><a className="d-block my-2">Don't have an account?</a></Link>
            <Link href="/forgot-password"><a className="d-block">Forgot password?</a></Link>
          </div>
        </div>
     </form>
    </div>
  );
};

export default Login
