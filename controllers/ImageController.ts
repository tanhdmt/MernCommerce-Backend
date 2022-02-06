import * as express from "express";
const imageModel = require("../models/ImageModel");
const uploadFile = require("../util/multerForm");

interface Image {
    title: string;
    image: string;
    categoryId?: string;
    content?: string;
    promotion?: string;
    position: string;
    status?: string;
}

interface ImageRequest extends express.Request {
    file?: any;
}

class ImageController {
    uploadImg = uploadFile("images").single("image");

    //UploadImage
    uploadSingleImg = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.send("File Uploaded Successfully");
        } catch (error: any) {
            res.send(error?.message);
        }
    };

    // [Image] /add
    add(req: ImageRequest, res: express.Response, next: express.NextFunction) {
        if (!req.body) {
            res.send({ message: "Please Fill full data" });
        }
        const info = JSON.parse(req.body.infos);
        const image = new imageModel({
            image: req.file?.path?.slice(23),
            categoryId: info.categoryId,
            title: info.title,
            content: info.content,
            promotion: info.promotion,
            position: info.position,
            status: info.status,
        });
        image
            .save()
            .then(() =>
                res.json({
                    info: {
                        image,
                    },
                    message: {
                        message: "Add Image Successfully",
                    },
                })
            )
            .catch((err: any) => {
                res.json({ error: err });
            });
    }

    // [PUT] /:id
    update(
        req: ImageRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.body) {
            res.send({ message: "Please Fill full data" });
        }
        const info = JSON.parse(req.body.infos);
        let infoImage = info.image;
        if (req.file) {
            infoImage = req.file?.path?.slice(23);
        }
        imageModel
            .updateOne(
                { _id: req.params.id },
                {
                    image: infoImage,
                    categoryId: info.categoryId,
                    title: info.title,
                    content: info.content,
                    promotion: info.promotion,
                    position: info.position,
                    status: info.status,
                }
            )
            .then(() => res.send({ message: "Update Successfully" }))
            .catch((err: any) => res.send({ err }));
    }

    // [PATCH] /:id/active
    active = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const image = await imageModel.findOne({ _id: req.params?.id });
            const show = { status: "1" };
            const hidden = { status: "0" };
            image.status === "1"
                ? imageModel
                      .findOneAndUpdate({ _id: image.id }, hidden, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("hidden"))
                      .catch(next)
                : imageModel
                      .findOneAndUpdate({ _id: req.params.id }, show, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("show"))
                      .catch(next);
        } catch (error) {
            res.send({ error });
        }
    };

    // [PATCH] /restore
    restore(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const ids = req.body.data;
            if (!ids) {
                res.send("Please enter full data");
            }
            ids.forEach((value: any) =>
                imageModel.restore({ _id: value }, (err: any, result: any) => {
                    if (err) throw err;
                    console.log(result);
                })
            );
            res.send("Restore Successfully");
        } catch (err: any) {
            res.json({ error: err });
        }
    }

    // [DELETE] /force
    forceDestroy(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const ids = req.body.id;
        if (!ids) {
            res.send("Please enter full data");
        }
        const idArr = ids.split(",");
        imageModel
            .deleteMany({ _id: idArr })
            .then(() => res.send("Force Delete Successfully"))
            .catch(next);
    }

    // [DELETE] /
    destroy(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const ids = req.body.id;
        if (!ids) {
            res.send("Please enter full data");
        }
        const idArr = ids.split(",");
        imageModel
            .delete({ _id: idArr })
            .then(() => res.send("Delete Successfully"))
            .catch(next);
    }

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([imageModel.find({}), imageModel.countDocumentsDeleted()])
            .then(([Images, deletedCount]) =>
                res.json({
                    deletedCount,
                    Images,
                })
            )
            .catch(next);
    }

    // [GET] /:id/edit
    showById(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        imageModel
            .findOne({ _id: req.params.id })
            .then((image: Image) => {
                res.json(image);
            })
            .catch(next);
    }

    // [GET] /:slug
    showBySlug(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        imageModel
            .findOne({ slug: req.params.slug })
            .then((image: Image) => {
                res.json(image);
            })
            .catch(next);
    }

    // [GET] /trash
    trash(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        imageModel
            .findDeleted({})
            .then((images: Image[]) => res.json(images))
            .catch(next);
    }
}

module.exports = new ImageController();
