import React, { FC } from 'react'
import classNames from 'classnames'

type PropsType = {
    placeholder: string,
    name: string,
    formik: any,
    type: string
}

const MyField: FC<PropsType> = ({placeholder, name, formik, type}) => {
    return (
        <div className="form-row">
            <div className="col-md-6 mb-3 mx-auto">
                <label htmlFor={name}>{placeholder}</label>
                <input type={type} 
                    className={classNames("form-control", {'is-invalid': formik.errors[name]})}
                    id={name}
                    {...formik.getFieldProps(name)}
                    />
                {formik.errors[name] && <div className="invalid-feedback">
                    {formik.errors[name]}
                </div> }
            </div>
        </div>
    )
}

export default MyField
