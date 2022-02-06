import * as express from "express";
const multer = require("multer");

interface UploadFile extends File {
    mimetype: string;
    originalName: string;
}

function uploadFile(typeUpload: string) {
    const storage = multer.diskStorage({
        destination: function (
            req: express.Request,
            file: UploadFile,
            cb: Function
        ) {
            cb(null, "./backend/uploads/" + typeUpload);
        },
        filename: function (
            req: express.Request,
            file: UploadFile,
            cb: Function
        ) {
            cb(
                null,
                new Date().toISOString().replace(/:/g, "-") +
                    "-" +
                    file.originalName
            );
        },
    });

    const fileFilter = (
        req: express.Request,
        file: UploadFile,
        cb: Function
    ) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const multerInit = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
        fileFilter: fileFilter,
    });
    return multerInit;
}

module.exports = uploadFile;
