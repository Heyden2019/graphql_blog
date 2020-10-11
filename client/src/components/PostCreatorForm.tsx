import classNames from 'classnames'
import { useFormik } from 'formik'
import React, { FC } from 'react'
import { Modal, Button } from 'react-bootstrap'
import MyField from './MyField'
import TextareaAutosize from 'react-textarea-autosize';
import { PostsDocument, useCreatePostMutation } from '../generated/graphql'
import * as Yup from 'yup';
import useIsAuth from './../utils/useIsAuth'

type PropsType = {
    show: boolean,
    handleClose: () => void
}

const PostCreatorForm: FC<PropsType> = ({ show, handleClose }) => {

    useIsAuth()
    const [createPost] = useCreatePostMutation({refetchQueries: [{query: PostsDocument}]})

    const ValidationSchema = Yup.object().shape({
        title: Yup.string()
          .trim()
          .required('Required'),
          text: Yup.string()
          .trim()
          .required('Required'),
      });

    const formik = useFormik({
        initialValues: {
            title: '',
            text: ''
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values) => {
            console.log('values', values)
            await createPost({variables: values})
            handleClose()
        }
    })

    return (
        <Modal show={show} onHide={handleClose}>
            <form onSubmit={formik.handleSubmit} className="mt-4">
                <Modal.Header closeButton>
                    <Modal.Title>Create new post</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <MyField
                        formik={formik}
                        name='title'
                        placeholder='Title'
                        type='text'
                    />

                    <div className="form-row">
                        <div className="col-md-6 mb-3 mx-auto">
                            <label htmlFor="text">Text</label>
                            <TextareaAutosize  className={classNames("form-control", { 'is-invalid': !!formik.submitCount && formik.errors.text && formik.getFieldMeta('text').touched })}
                                id="text"
                                minRows={3}
                                maxRows={5}
                                {...formik.getFieldProps("text")}
                            />
                            {!!formik.submitCount && formik.errors.text && formik.getFieldMeta('text').touched && <div className="invalid-feedback">
                                {formik.errors.text}
                            </div>}
                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Create
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default PostCreatorForm
