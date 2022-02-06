import * as express from "express";
const colorModel = require("../models/ColorModel");

interface Color {
    name: string;
    code: string;
}

class ColorController {
    // [POST] /add
    add(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const color = new colorModel(req.body);
        color
            .save()
            .then(() => res.send(color))
            .catch(next);
    }

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([colorModel.find({}), colorModel.countDocumentsDeleted()])
            .then(([Colors, deletedCount]) =>
                res.json({
                    deletedCount,
                    Colors,
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
        colorModel
            .findOne({ _id: req.params.id })
            .then((color: Color) => {
                res.json(color);
            })
            .catch(next);
    }

    // [GET] /trash
    trash(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        colorModel
            .findDeleted({})
            .then((colors: Color[]) => res.json(colors))
            .catch(next);
    }

    // [PUT] /:id
    update(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        colorModel
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
        const ids = req.body.id;
        const idArr = ids.split(",");
        colorModel
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
        const ids = req.body.id;
        const idArr = ids.split(",");
        colorModel
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
            const ids = req.body.data;
            ids.forEach((value: any) =>
                colorModel.restore({ _id: value }, (err: any, result: any) => {
                    if (err) throw err;
                    console.log(result);
                })
            );
            res.send("Restore Successfully ");
        } catch (error: any) {
            res.json({ error });
        }
    }
}

module.exports = new ColorController();
