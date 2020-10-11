import React, { FC } from 'react'
import { Button } from 'react-bootstrap'

type PropsType = {
    handleShowForm: () => void
}

const NewPostButton: FC<PropsType> = ({handleShowForm}) => {
    return (
        <div className="new-post-btn">
            <Button variant="secondary" className="rounded-circle" onClick={handleShowForm}>
                <span>+</span>
            </Button>
        </div>
    )
}

export default NewPostButton
