export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Файл не загружен'
            })
        }

        res.json({
            url: `/uploads/${req.file.filename}`,
            message: 'Файл успешно загружен'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при загрузке файла"
        })
    }
}