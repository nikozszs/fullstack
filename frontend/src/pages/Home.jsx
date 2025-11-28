import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchPostsPopular, fetchTags } from '../redux/slices/postsSlice';
import { fetchRandomComments } from '../redux/slices/commentsSlice'
import { checkEnvironment, formatDate} from '../utils';

export const Home = () => {
  const dispatch = useDispatch()
  const { posts, tags } = useSelector(state => state.posts)
  const { randomComments } = useSelector(state => state.comments)
  const userData = useSelector(state => state.auth.data)
  const [ activeTab, setActiveTab ] = useState(0)
  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'
  const isCommentsLoading = randomComments.status === 'loading'

  useEffect(() => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    if (activeTab === 0) {
      dispatch(fetchPosts())
    } else {
      dispatch(fetchPostsPopular())
    }
    dispatch(fetchTags())
    dispatch(fetchRandomComments(5)) 
  }, [activeTab, dispatch])

  const handleTabChange = (event, newValue) => setActiveTab(newValue)

  return (
    <>
      <Tabs value={activeTab} 
        onChange={handleTabChange}
        style={{ marginBottom: 15 }} 
        aria-label="basic tabs example">
          <Tab label="Новые" />
          <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {isPostsLoading
            ? [...Array(5)].map((_, index) => <Post key={index} isLoading />)
            : posts.items.map(post => (
                <Post
                id={post._id}
                title={post.title}
                imageUrl={post.imageUrl}
                user={post.user}
                createdAt={formatDate(post.createdAt)}
                viewsCount={post.viewsCount}
                commentsCount={(post.commentsCount)}
                tags={post.tags}
                isEditable={ userData?._id === post.user._id}
                />
              ))
          }
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={randomComments.items} isLoading={isCommentsLoading} showAddComment={false} />
        </Grid>
      </Grid>
    </>
  );
};
