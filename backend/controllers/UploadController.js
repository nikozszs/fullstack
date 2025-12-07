export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Файл не загружен'
            })
        }

        const uploadsDir = '/tmp/uploads';
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(req.file.originalname);
        const fileName = uniqueSuffix + fileExtension;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, req.file.buffer);

        const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://recipe-blog-l3jp.onrender.com';
        const fileUrl = `${baseUrl}/uploads/${fileName}`;

        res.json({
            url: fileUrl,
            message: 'Файл успешно загружен'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при загрузке файла"
        })
    }
}