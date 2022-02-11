import * as express from "express";
const productModel = require("../models/ProductModel");
const uploadFile = require("../util/multerForm");

interface Product {
    id: any;
    name: string;
    slug?: string;
    image: string;
    categoryId: string;
    color: string;
    type?: string;
    size: string;
    details: string;
    price: number;
    priceDiscount?: number;
    quantity: number;
    status?: string;
    save: any;
}

interface OrderItem {
    name: string;
    quantity: number;
    inStock: number;
    size: string;
    color: string;
    image: string;
    price: number;
    id: any;
}

interface ProductRequest extends express.Request {
    files?: any;
}

class ProductController {
    uploadImg = uploadFile("products").array("image");

    //UploadImage
    uploadMultiImg = async (
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

    // [POST] /add
    add(
        req: ProductRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.body.infos) {
            res.send("Please send full data");
        }
        const info = JSON.parse(req.body.infos);
        let listImageStr = "";
        req.files.forEach((element: Express.Multer.File, key: any) => {
            listImageStr += element.path?.slice(25) + ",";
        });
        const product: Product = new productModel({
            name: info.name,
            image: listImageStr?.slice(0, -1),
            categoryId: info.categoryId,
            color: info.color,
            size: info.size,
            details: info.details,
            type: info.type,
            price: info.price,
            priceDiscount: info.priceDiscount,
            quantity: info.quantity,
            status: info.status,
        });
        product
            .save()
            .then(() =>
                res.json({
                    info: {
                        product,
                    },
                    message: {
                        message: "Add Product Successfully",
                    },
                })
            )
            .catch((error: any) => {
                res.json({ error });
            });
    }

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([
            productModel.find({}),
            productModel.countDocumentsDeleted(),
        ])
            .then(([Products, deletedCount]) =>
                res.json({
                    deletedCount,
                    Products,
                })
            )
            .catch(next);
    }

    // [GET] /search
    search = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (!req.query.key) {
            res.send("Please enter full data");
        }
        const keySearch = req.query.key as string;
        const pro = await productModel
            .find({ name: { $regex: ".*" + keySearch + ".*" } })
            .exec();
        if (!pro) {
            res.send("Cannot find product");
        }
        res.json(pro);
    };

    // [GET] /:id/edit
    showById(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        productModel
            .findOne({ _id: req.params.id })
            .then((product: Product) => {
                res.json(product);
            })
            .catch(next);
    }

    // [GET] /filter
    filterProduct(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const { cateId, color, size } = req.query;
        const queryCond = {
            ...(cateId && {
                categoryId: {
                    $regex: ".*" + cateId + ".*",
                    $options: "i",
                },
            }),
            ...(color && {
                color: {
                    $regex: ".*" + color + ".*",
                    $options: "i",
                },
            }),
            ...(size && {
                size: { $regex: ".*" + size + ".*", $options: "i" },
            }),
            ...{
                deleted: false,
            },
            ...{
                status: 1,
            },
        };
        productModel
            .find(queryCond)
            .then((products: Product[]) => {
                res.json(products);
            })
            .catch(next);
    }

    // [GET] /trash
    trash(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        productModel
            .findDeleted({})
            .then((products: Product[]) => res.json(products))
            .catch(next);
    }

    // [PATCH] /:id/active
    active = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const product: Product = await productModel.findOne({
                _id: req.params.id,
            });
            if (!product) {
                res.send("Cannot find product");
            }
            const show = { status: "1" };
            const hidden = { status: "0" };
            product.status === "1"
                ? productModel
                      .findOneAndUpdate({ _id: product.id }, hidden, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("hidden"))
                      .catch(next)
                : productModel
                      .findOneAndUpdate({ _id: req.params.id }, show, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("show"))
                      .catch(next);
        } catch (error) {
            res.send({ error: "Error" });
        }
    };

    // [PUT] /:id
    update(
        req: ProductRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.body.infos) {
            res.send("Cannot find product");
        }
        const info = JSON.parse(req.body.infos);
        let imagesArray = info.image;
        let lstImageStr = "";

        if (req.files.length !== 0) {
            req.files.forEach((element: Express.Multer.File, key: any) => {
                lstImageStr += element.path?.slice(25) + ",";
            });
            imagesArray = lstImageStr?.slice(0, -1);
        }
        productModel
            .updateOne(
                { _id: req.params.id },
                {
                    name: info.name,
                    image: JSON.stringify(imagesArray),
                    categoryId: info.categoryId,
                    color: info.color,
                    type: info.type,
                    size: info.size,
                    details: info.details,
                    price: info.price,
                    priceDiscount: info.priceDiscount,
                    quantity: info.quantity,
                    status: info.status,
                }
            )
            .then(() => res.send({ message: "Update Successfully" }))
            .catch(() => res.send({ message: "Cannot find product" }));
    }

    // [PATCH] /decreaseQty
    decreaseQty(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (!req.body.orderItems) {
                res.send("Please enter full data");
            }
            req.body.orderItems.forEach((value: OrderItem) => {
                var pro = productModel.findOne({ _id: value.id });
                console.log(pro);
                var decrQty = { quantity: value.inStock - value.quantity };
                productModel
                    .findOneAndUpdate({ _id: value.id }, decrQty, {
                        returnOriginal: false,
                    })
                    .then(() => res.send("Decrease Quantity Successfully"))
                    .catch(next);
            });
        } catch (error) {
            res.json({ error });
        }
    }

    // [DELETE] /
    destroy(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.body.id) {
            res.send("Please enter full data");
        }
        const ids = req.body.id;
        const idArr = ids.split(",");

        productModel
            .delete({ _id: idArr })
            .then(() => res.send("Delete Successfully"))
            .catch(next);
    }

    // [DELETE] /force
    forceDestroy(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.body.id) {
            res.send("Please enter full data");
        }
        const ids = req.body.id;
        const idArr = ids.split(",");
        productModel
            .deleteMany({ _id: idArr })
            .then(() => res.send("Force Delete Successfully"))
            .catch(next);
    }

    // [PATCH] /restore
    restore(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (!req.body.id) {
                res.send("Please enter full data");
            }
            const ids = req.body.data;
            ids.forEach((value: any) =>
                productModel.restore(
                    { _id: value },
                    (err: any, result: any) => {
                        if (err) throw err;
                        console.log(result);
                    }
                )
            );
            res.send("Restore Successfully ");
        } catch (error) {
            res.json({ error });
        }
    }
}

module.exports = new ProductController();
