import FileStorageService from '../FileStorage.js';

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Файл не загружен'
            })
        }

        const subfolder = req.body.type === 'avatar' ? 'avatars' : 'posts';
        const uploadResult = await FileStorageService.uploadFile(req.file, subfolder);
        
        res.json({
            success: true,
            url: uploadResult.url,
            avatarUrl: uploadResult.url,
            imageUrl: uploadResult.url,
            message: 'Файл успешно загружен'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Ошибка при загрузке файла',
            error: err.message,
        })
    }
}