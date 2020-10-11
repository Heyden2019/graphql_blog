import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import MyField from '../components/MyField';
import { MeDocument, useRegisterMutation } from '../generated/graphql';

const Register = () => {

  const router = useRouter()
  
  const [register] = useRegisterMutation({ update: (store, {data}) => {
    if(data?.register.user) {
      store.writeQuery({
        query: MeDocument,
        data: {
          me: {...data.register.user}
        }
      })
    }
  }})

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: ''
    },
    onSubmit: async (values, {setFieldError}) => {
      const {data}= await register({variables: values})
      if(data?.register.errors) {
        data?.register.errors.forEach(({field, message}) => {
          setFieldError(field, message)
        })
      } else if (data?.register.user) {
          router.push('/')
        return
      }
    }
  })

  return (
    <div className="container">
     <form onSubmit={formik.handleSubmit} className="mt-4">

       <MyField 
         formik={formik}
         name='username'
         placeholder='Username'
         type='text'
       />
       
      <MyField 
        formik={formik}
        name='email'
        placeholder='Email'
        type='email'
      />

      <MyField 
        formik={formik}
        name='password'
        placeholder='Password'
        type='password'
      />

        <div className="form-row">
          <div className="col-md-6 mb-3 mx-auto">
            <button className="btn btn-primary" type="submit">Register</button>
            <Link href="/login"><a className="d-block my-2">Have an account?</a></Link>
            <Link href="/forgot-password"><a className="d-block">Forgot password?</a></Link>
          </div>
        </div>

     </form>
    </div>
  );
};

export default Register
