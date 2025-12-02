import { useState } from "react"
import styles from './MobileSidebar.module.scss';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TagsBlock } from "../TagsBlock";
import { CommentsBlock } from "../CommentsBlock";
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from "@mui/material";

export const MobileSidebar = ({
    tagsItems,
    tagsLoading,
    commentsItems,
    commentsLoading
}) => {
    const [ open, setOpen ] = useState(false)

    const handleOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    const drawerContent = (
        <div className={styles.content} >
            <div className={styles.drawerHeader}>
                <IconButton 
                    onClick={handleClose}
                    className={styles.closeButton}
                    >
                        <CloseIcon />
                </IconButton>
            </div>

            <div className={styles.tagsSection}>
                <TagsBlock 
                items={tagsItems} 
                isLoading={tagsLoading} 
                />
            </div>

            <div className={styles.commentsSection}>
                <CommentsBlock
                items={commentsItems} 
                isLoading={commentsLoading}
                showAddComment={false}
                />
            </div>
        </div>
    )

    return (
        <>
            <button
                onClick={handleOpen}
                className={styles.mobileMenuButton}
                aria-label="Открыть меню"
            >
                <MenuIcon />
            </button>

            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                classes={{
                    paper: styles.paper,
                }}
                className={styles.drawer}
                ModalProps={{
                    keepMounted: true,
                }}
                >
                {drawerContent}
            </Drawer>
        </>
    )
}