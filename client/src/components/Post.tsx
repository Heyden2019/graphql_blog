import React, { FC } from 'react'
import { Card, Button } from 'react-bootstrap'
import dateFormatter from './../utils/dateFormatter'

type PropsType = {
    title: string
    textSnippet: string
    creator: string
    createdAt: string
    id: number
}

const Post: FC<PropsType> = ({createdAt, creator, textSnippet, title, id}) => {
    const formattedDate = dateFormatter(createdAt)
    return (
        <Card className="mt-4">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {textSnippet}
                </Card.Text>
                <Card.Link href={'/post/' + id}>More ...</Card.Link>
            </Card.Body>
    <Card.Footer className="text-muted">{formattedDate} by {creator}</Card.Footer>
        </Card>
    )
}

export default Post
