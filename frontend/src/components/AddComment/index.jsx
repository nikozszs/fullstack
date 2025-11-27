import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreateComment } from "../../redux/slices/commentsSlice";

export const Index = ({postId, onCommentAdded }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    setIsSubmitting(true);
    try {
      await dispatch(fetchCreateComment({
        text: commentText,
        postId
      })).unwrap();
      setCommentText('');

      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (err) {
      console.error('Ошибка при отправке комментария:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={userData?.avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            value={commentText}
            fullWidth
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
          variant="contained"
          onClick={handleSubmit}
          disabled={!commentText.trim() || isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        </div>
      </div>
    </>
  );
};
