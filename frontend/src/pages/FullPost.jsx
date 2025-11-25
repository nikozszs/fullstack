import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkDown from 'react-markdown'
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsInPost } from "../redux/slices/commentsSlice";
import { formatDate } from "../utils";

export const FullPost = () => {
  const dispatch = useDispatch();
  const { id } = useParams()
  const { postComments } = useSelector(state => state.comments);
  const [ data, setData ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true)
  const comments = postComments.items || [];

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
  }, [id])

  useEffect(() => {
    if (id) {
      dispatch(fetchCommentsInPost(id))
    }
  }, [])

  const handleCommentAdded = () => {
    if (id) {
      dispatch(fetchCommentsInPost(id))
    }
  }


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
        createdAt={formatDate(data.createdAt)}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount || 0}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkDown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={postComments.status === 'loading'}
      >
        <Index postId={id} onCommentAdded={handleCommentAdded} />
      </CommentsBlock>
    </>
  );
};
