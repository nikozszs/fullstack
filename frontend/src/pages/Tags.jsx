import { useParams } from "react-router-dom"
import { Container, Grid, Typography } from '@mui/material';
import { Post, TagsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPostsByTag, fetchTags } from "../redux/slices/postsSlice";

export const Tags = () => {
    const { tagName } = useParams()
    const { tags, posts } = useSelector(state => state.posts);
    const isPostsLoading = posts.status === 'loading'
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPostsByTag(tagName))
        dispatch(fetchTags())
    }, [tagName, dispatch])

    return (
        <Container maxWidth='lg'>
            <Typography variant="h3" component='h1' gutterBottom>
                Посты с тегом: #{tagName}
            </Typography>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading 
                    ? [...Array(3)]
                    : posts.items).map((obj, index) =>
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post 
                                key={obj._id}
                                id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={3}
                                tags={obj.tags}
                                isEditable={false}/>
                        )
                    )}
                    {!isPostsLoading && posts.items.length === 0 && (
                        <Typography variant="h6" color='textSecondary' >
                            Постов с тегом #{tagName} не найдено
                        </Typography>
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={tags.status === 'loading'} />
                </Grid>
            </Grid>
        </Container>
    )
}