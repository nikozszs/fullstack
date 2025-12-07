export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Файл не загружен'
            })
        }

        const fileInfo = req.file;
        
        res.json({
            url: fileInfo.path,
            publicId: fileInfo.filename,
            format: fileInfo.format,
            size: fileInfo.size,
            message: 'Файл успешно загружен'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при загрузке файла"
        })
    }
}

export const uploadAvatars = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Файл не загружен'
            });
        }

        res.json({
            avatarUrl: req.file.path,
            message: 'Аватар успешно загружен'
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при загрузке файла"
        })
    }
}