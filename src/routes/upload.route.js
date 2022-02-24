const express = require("express");
const multer  = require('multer');
const router = express.Router();

const upload = multer();

const { UploadController } = require("../controllers");
const { checkToken } = require("../middleware");

router.post("", upload.single('file'), checkToken, UploadController.uploadFile);

module.exports = router;