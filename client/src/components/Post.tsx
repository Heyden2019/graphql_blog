import classNames from 'classnames'
import React, { FC } from 'react'
import { Card } from 'react-bootstrap'
import { useVoteMutation, PostDocument, useMeQuery } from '../generated/graphql'
import dateFormatter from './../utils/dateFormatter'

type PropsType = {
    title: string
    textSnippet: string
    creator: string
    createdAt: string
    id: number,
    points: number
    voteStatus?: number | null
}

const Post: FC<PropsType> = ({ createdAt, creator, textSnippet, title, id, points, voteStatus = null }) => {

    const {data} = useMeQuery()

    const formattedDate = dateFormatter(createdAt)
    const [vote] = useVoteMutation({update: (store, {data}) => {
        store.writeQuery({
            query: PostDocument,
            variables: {id: id},
            data: data?.vote
        })
    }})

    const onVote = (value: number) => {
        if(data?.me) {
            vote({variables: {postId: id, value}})
        }
    }

    return (
        <Card className="mt-4">
            <Card.Body className="postcard-body">
                <Card.Title>{title} {id}</Card.Title>
                <Card.Text>
                    {textSnippet}
                </Card.Text>
                <Card.Link href={'/post/' + id}>More ...</Card.Link>
                <div className="points">
                    <div className="block">
                        <span className={classNames("arrow", {"green": voteStatus === 1, "disable": !data?.me})}
                        onClick={() => onVote(1)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </span>
                        <span>{points}</span>
                        <span className={classNames("arrow", {"red": voteStatus === -1, "disable": !data?.me?.id})}
                         onClick={() => onVote(-1)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className="text-muted">{formattedDate} by {creator}</Card.Footer>
        </Card>
    )
}

export default Post
