import React, { useState } from 'react'
import NewPostButton from '../components/NewPostButton'
import PostCreatorForm from '../components/PostCreatorForm';
import Posts from '../components/Posts'
import { useMeQuery } from '../generated/graphql';

export default function Home() {

  const [show, setShow] = useState(false);
  const {data} = useMeQuery()


  const handleClose = () => setShow(false);
  const handleShowForm = () => setShow(true);

  return (
    <div className="container">
    <Posts />
    {data?.me && <><NewPostButton handleShowForm={handleShowForm} />
    <PostCreatorForm handleClose={handleClose}
                     show={show} 
    /></>}
    </div>
  )
}
