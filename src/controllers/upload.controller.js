const minioClient = require('../configs/minio.config');
const moment = require("moment");

class SearchController {
    uploadFile(req, res) {
        try {
            const { email } = req.body;
            const file = req.file;
            if (file) {
                const nameRealTime = moment().unix();
                const typeFile = file.originalname.split('.')[file.originalname.split('.').length - 1];
                const isExist = minioClient.bucketExists("files");
                if (!isExist) {
                    minioClient.makeBucket("files");
                }
                minioClient.putObject("files", `${email}/${nameRealTime}.${typeFile}`, file.buffer, function (error, etag) {
                    if (error) {
                        res.status(500).json({
                            status: false,
                            message: error.toString(),
                            data: null,
                        });
                    } else {
                        res.status(200).json({
                            status: true,
                            message: 'OKE',
                            data: `http://127.0.0.1:9000/files/${email}/${nameRealTime}.${typeFile}`,
                        })
                    }
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Can't not find file",
                    data: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }
}

module.exports = new SearchController();
