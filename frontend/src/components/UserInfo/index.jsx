import React, { useState } from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  const [ imgError, setImgError ] = useState(false)

  const getValidAvatar = (url) => {
    if (!url || imgError) return '/noavatar.png'

    if (url.includes('yandex.ru/images/search') || 
      url.includes('google.com/search') ||
      url.includes('?text=')) {
      return '/noavatar.png';
    }

    return url
  }

  const validAvatar = getValidAvatar(avatarUrl)
  return (
    <div className={styles.root}>
      <img className={styles.avatar} 
        src={validAvatar} 
        alt={fullName} 
        onError={() => setImgError(true)}/>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
