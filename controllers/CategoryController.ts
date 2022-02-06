import * as express from "express";
const categoryModel = require("../models/CategoryModel");
const uploadFile = require("../util/multerForm");

interface Category {
    id: any;
    name: string;
    image: string;
    parentCate: string;
    type: string;
    status?: string;
}
interface CategoryRequest extends express.Request {
    file?: any;
}

class CategoryController {
    uploadImg = uploadFile("banners").single("image");

    uploadSingleImg = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.send("File Uploaded Successfully");
        } catch (error: any) {
            res.send(error.message);
        }
    };

    add(
        req: CategoryRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        const info = JSON.parse(req.body.infos);
        var listImageStr = "";
        let arr = "";

        if (req.file) {
            req.file.forEach((element: Express.Multer.File, key: any) => {
                arr += element.path.slice(20) + ",";
            });
            listImageStr = arr.slice(0, -1);
        }

        const category = new categoryModel({
            name: info.name,
            image: listImageStr,
            parentCate: info.parentCate,
            type: info.type,
            status: info.status,
        });

        category
            .save()
            .then(() =>
                res.json({
                    info: {
                        category,
                    },
                    message: {
                        message: "Add Category Successfully",
                    },
                })
            )
            .catch((err: any) => {
                res.json({ error: err });
            });
    }

    // [PUT] /:id
    update(
        req: CategoryRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        const info = JSON.parse(req.body.infos);
        let imagesArray = info.image;

        if (req.file) {
            imagesArray = req.file.path.slice(25);
        }

        categoryModel
            .updateOne(
                { _id: req.params.id },
                {
                    name: info.name,
                    image: imagesArray,
                    parentCate: info.parentCate,
                    type: info.type,
                    status: info.status,
                }
            )
            .then(() => res.send({ message: "Update Successfully " }))
            .catch((err: any) => {
                res.json({ error: err });
            });
    }

    // [PATCH] /restore
    restore(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const ids = req.body.data;
            ids.forEach((value: any) =>
                categoryModel.restore(
                    { _id: value },
                    (err: any, result: any) => {
                        if (err) throw err;
                        console.log(result);
                    }
                )
            );
            res.send("Restore Successfully ");
        } catch (err: any) {
            res.json({ error: err });
        }
    }

    // [PATCH] /:id
    active = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const category: Category = await categoryModel.findOne({
                _id: req.params.id,
            });
            const show = { status: "1" };
            const hidden = { status: "0" };
            category.status === "1"
                ? categoryModel
                      .findOneAndUpdate({ _id: category.id }, hidden, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("hidden"))
                      .catch(next)
                : categoryModel
                      .findOneAndUpdate({ _id: req.params.id }, show, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("show"))
                      .catch(next);
        } catch (error) {
            res.send({ error: "Error" });
        }
    };

    // [DELETE] /:id/force
    forceDestroy(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const ids = req.body.id;
        const idArr = ids.split(",");
        categoryModel
            .deleteMany({ _id: idArr })
            .then(() => res.send("Delete Forever Successfully "))
            .catch(next);
    }

    // [DELETE] /:id
    destroy(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const ids = req.body.id;
        const idArr = ids.split(",");
        categoryModel
            .delete({ _id: idArr })
            .then(() => res.send("Delete Successfully "))
            .catch(next);
    }

    // [GET] /:id/edit
    edit(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        categoryModel
            .findById(req.params.id)
            .then((category: Category) => res.send(category))
            .catch(next);
    }

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([
            categoryModel.find({}),
            categoryModel.countDocumentsDeleted(),
        ])
            .then(([Categories, deletedCount]) =>
                res.json({
                    deletedCount,
                    Categories,
                })
            )
            .catch(next);
    }

    // [GET] /trash
    trash(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        categoryModel
            .findDeleted({})
            .then((categories: Category[]) => res.json(categories))
            .catch(next);
    }
}

module.exports = new CategoryController();
