import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useChangePasswordMutation } from '../../generated/graphql'
import { useFormik } from 'formik'
import { Alert } from 'react-bootstrap'
import MyField from '../../components/MyField'

const ChangePassword = () => {
    const router = useRouter()
    const token = router.query.token as string
    const [changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')
    const [isPasswordChanged, setIsPasswordChanged] = useState(false)

    const formik = useFormik({
        initialValues: {
            newPassword: ''
        },
        onSubmit: async (values, { setFieldError }) => {
            const { data } = await changePassword({ variables: { ...values, token } })
            if (data?.changePassword.errors) {
                data?.changePassword.errors.forEach(({ field, message }) => {
                    if (field === "token") {
                        setTokenError(message)
                    } else {
                        setFieldError(field, message)
                    }
                })
            } else {
                setIsPasswordChanged(true)
            }
        }
    })

    if (tokenError) return (
        <div className="container">
        <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>
                {tokenError}
            </p>
        </Alert>
        </div>
    )

    if (isPasswordChanged) return (
        <div className="container">
        <Alert variant="success">
            <Alert.Heading>Success</Alert.Heading>
            <p>
                Password has changed
            </p>
        </Alert>
        </div>
    )

    return (
        <div className="container">
            <form onSubmit={formik.handleSubmit} className="mt-4">

                <MyField
                    formik={formik}
                    name='newPassword'
                    placeholder='New password'
                    type='password'
                />

                <div className="form-row">
                    <div className="col-md-6 mb-3 mx-auto">
                        <button className="btn btn-primary" type="submit">Change password</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
