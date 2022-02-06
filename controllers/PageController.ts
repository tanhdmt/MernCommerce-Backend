import * as express from "express";
const pageModel = require("../models/PageModel");

interface Page {
    id: any;
    title: string;
    slug?: string;
    content: string;
    createdBy?: string;
    updatedBy?: string;
    status?: string;
    save: any;
}
class PageController {
    // [POST] /add
    add(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const page: Page = new pageModel(req.body);
        page.save()
            .then(() => res.send(page))
            .catch(next);
    }
    // [PUT] /:id
    update(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        pageModel
            .updateOne({ _id: req.params.id }, req.body)
            .then(() => res.send(req.body))
            .catch(next);
    }

    // [PATCH] /:id/active
    active = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const page: Page = await pageModel.findOne({ _id: req.params.id });
            if (!page) {
                res.send({ error: "Not found" });
            }
            const show = { status: "1" };
            const hidden = { status: "0" };
            page.status === "1"
                ? pageModel
                      .findOneAndUpdate({ _id: page.id }, hidden, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("hidden"))
                      .catch(next)
                : pageModel
                      .findOneAndUpdate({ _id: req.params.id }, show, {
                          returnOriginal: false,
                      })
                      .then(() => res.send("show"))
                      .catch(next);
        } catch (error) {
            res.send({ error: "Error" });
        }
    };

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
                pageModel.restore({ _id: value }, (err: any, result: any) => {
                    if (err) throw err;
                    console.log(result);
                })
            );
            res.send("Restore Successfully");
        } catch (error) {
            res.json({ error });
        }
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
        pageModel
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
        if (!req.body.id) {
            res.send("Please enter full data");
        }
        const ids = req.body.id;
        const idArr = ids.split(",");
        pageModel
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
        Promise.all([pageModel.find({}), pageModel.countDocumentsDeleted()])
            .then(([Pages, deletedCount]) =>
                res.json({
                    deletedCount,
                    Pages,
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
        pageModel
            .findOne({ _id: req.params.id })
            .then((page: Page) => {
                res.json(page);
            })
            .catch(next);
    }

    // [GET] /:slug
    showBySlug(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        pageModel
            .findOne({ slug: req.params.slug })
            .then((page: Page) => {
                res.json(page);
            })
            .catch(next);
    }

    // [GET] /trash
    trash(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        pageModel
            .findDeleted({})
            .then((pages: Page[]) => res.json(pages))
            .catch(next);
    }
}

module.exports = new PageController();
