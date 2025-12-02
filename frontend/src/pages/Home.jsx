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
import { formatDate } from '../utils';
import { MobileSidebar } from '../components/MobileSidebar/MobileSidebar';
import styles from './Home.module.scss'
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';

export const Home = () => {
  const dispatch = useDispatch()
  const { posts, tags } = useSelector(state => state.posts)
  const { randomComments } = useSelector(state => state.comments)
  const userData = useSelector(state => state.auth.data)
  const [ activeTab, setActiveTab ] = useState(0)
  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'
  const isCommentsLoading = randomComments.status === 'loading'
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (activeTab === 0) {
      dispatch(fetchPosts())
    } else {
      dispatch(fetchPostsPopular())
    }
    dispatch(fetchTags())
    dispatch(fetchRandomComments(5)) 
  }, [activeTab])

  const handleTabChange = (event, newValue) => setActiveTab(newValue)

  return (
    <>
      <div className={styles.homeHeader}>
        <Tabs value={activeTab} 
          onChange={handleTabChange}
          style={{ marginBottom: 15 }} 
          aria-label="basic tabs example">
            <Tab label="Новые" />
            <Tab label="Популярные" />
        </Tabs>

        {isMobile && (
          <MobileSidebar tagsItems={tags.items} 
            commentsItems={randomComments.items}
            commentsLoading={isCommentsLoading}
            tagsLoading={isTagsLoading}
          />
        )}
      </div>

      <Grid container spacing={4}>
        <Grid xs={12} md={8} item>
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

        {!isMobile && (
          <Grid md={4} item>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
            <CommentsBlock items={randomComments.items} isLoading={isCommentsLoading} showAddComment={false} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
