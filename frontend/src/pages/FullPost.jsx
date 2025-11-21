import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkDown from 'react-markdown'

export const FullPost = () => {
  const { id } = useParams()
  const [ data, setData ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ comments, setComments] = useState([])

  useEffect(() => {
    axios
      .get(`/post/${id}`)
      .then(res => {
        setData(res.data)
    })
      .catch (err => {
        console.log(err)
        setData(null)
    })
      .finally(() => {
        setIsLoading(false);
    });

    if (id) {
      axios
        .get(`/comments/post/${id}`)
        .then(res => setComments(res.data))
        .catch(err => {
          console.log(err)
          setComments([])
        })
    }
  }, [id])


  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount || 0}
        tags={data.tags}
        isFullPost
      >
        <p>
          <ReactMarkDown children={data.text} />
        </p>
      </Post>
      <CommentsBlock
        postId={id}
        items={comments}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
