import * as express from "express";
const sizeModel = require("../models/SizeModel");

interface Size {
    id: any;
    name: string;
    slug?: string;
    save: any;
}

class SizeController {
    // [POST] /add
    add(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const size: Size = new sizeModel(req.body);
        size.save()
            .then(() => res.json(size))
            .catch(next);
    }

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([sizeModel.find({}), sizeModel.countDocumentsDeleted()])
            .then(([Sizes, deletedCount]) =>
                res.json({
                    deletedCount,
                    Sizes,
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
        sizeModel
            .findDeleted({})
            .then((sizes: Size[]) => res.json(sizes))
            .catch(next);
    }

    // [GET] /:id/edit
    showById(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        sizeModel
            .findById(req.params.id)
            .then((size: Size) => {
                res.json(size);
            })
            .catch(next);
    }

    // [PUT] /:id
    update(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        sizeModel
            .updateOne({ _id: req.params.id }, req.body)
            .then(() => res.send(req.body))
            .catch(next);
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
        sizeModel
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
        sizeModel
            .deleteOne({ _id: idArr })
            .then(() => res.send("Force Delete Successfully"))
            .catch(next);
    }

    // [PATCH] /:id/restore
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
                sizeModel.restore({ _id: value }, (err: any, result: any) => {
                    if (err) throw err;
                    console.log(result);
                })
            );
            res.send("Restore Successfully ");
        } catch (error) {
            res.json({ error });
        }
    }
}

module.exports = new SizeController();
