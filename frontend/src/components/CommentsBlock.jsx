import React from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { Index } from "./AddComment";
import { Typography } from "@mui/material";

export const CommentsBlock = ({ postId, items, isLoading = true }) => {
  const userData = useSelector(state => state.auth.data)

  return (
    <SideBlock title="Комментарии">
      {userData && postId && <Index postId={postId} />}
      <List>
        {isLoading ? (
          [...Array(5)].map((_, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : items && items.length > 0 ? (
          items.map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <div style={{ 
              textAlign: 'center', 
              width: '100%', 
              padding: '20px 0'
            }}>
              <Typography 
                variant="body1" 
                color="textSecondary"
              >
                Пока нет комментариев, но ты сможешь стать первым
              </Typography>
            </div>
          </ListItem>
        )}
      </List>
    </SideBlock>
  );
};
