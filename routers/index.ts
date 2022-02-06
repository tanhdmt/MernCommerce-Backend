import * as express from "express";
const cateRouter = require("./category");
const sizeRouter = require("./size");
const colorRouter = require("./color");
const productRouter = require("./product");
const userRouter = require("./user");
const orderRouter = require("./order");
const imageRouter = require("./image");
const pageRouter = require("./page");

function router(app: express.Application) {
    app.use("/api/category", cateRouter);
    app.use("/api/size", sizeRouter);
    app.use("/api/color", colorRouter);
    app.use("/api/product", productRouter);
    app.use("/api/user", userRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/image", imageRouter);
    app.use("/api/page", pageRouter);
}

module.exports = router;
