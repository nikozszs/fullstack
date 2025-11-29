export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
};

export const getApiUrl = () => {
    return process.env.REACT_APP_API_URL || process.env.PORT;
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    return `${getApiUrl()}${imagePath}`;
};
