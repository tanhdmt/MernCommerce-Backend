import * as express from "express";
const orderModel = require("../models/OrderModel");

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
interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    emailAddress: string;
    phone: string;
    note?: string;
}
interface PaymentResult {
    id: string;
    status?: string;
    update_time?: string;
    email?: string;
}
interface Order {
    id: any;
    orderItems: OrderItem;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: PaymentResult;
    shippingFee: number;
    totalPrice: number;
    user: any;
    isPaid?: boolean;
    paidAt?: number;
    delivered?: string;
    deliveredAt?: number;
    status?: string;
    save: any;
}

class OrderController {
    // [POST] /add
    add(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!req.body.orderItems || req.body.orderItems.length === 0) {
            res.send({ message: "Cart is empty" });
        }
        req.body.orderItems.forEach((value: OrderItem) => {
            console.log(value.inStock);
        });
        const order: Order = new orderModel({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            shippingFee: req.body.shippingFee,
            totalPrice: req.body.totalPrice,
            user: req.body.user,
        });
        order
            .save()
            .then(() =>
                res.json({
                    order,
                    message: {
                        message: "New Order Created",
                    },
                })
            )
            .catch(next);
    }

    // [GET] /:id
    showById(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        orderModel
            .findOne({ _id: req.params.id })
            .then((order: Order) => {
                res.json(order);
            })
            .catch(() => res.send({ message: "Order Not Found" }));
    }

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([orderModel.find({}), orderModel.countDocumentsDeleted()])
            .then(([Orders, deletedCount]) =>
                res.json({
                    deletedCount,
                    Orders,
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
        orderModel
            .findDeleted({})
            .then((orders: Order[]) => res.json(orders))
            .catch(next);
    }

    // [PATCH] /:id/status
    status = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const order: Order = await orderModel.findOne({
                _id: req.params.id,
            });
            if (!order) {
                res.send({ message: "Order Not Found" });
            }
            order.status = req.body.saveStatus;
            orderModel
                .findOneAndUpdate({ _id: order.id }, order, {
                    returnOriginal: false,
                })
                .then((order: Order) =>
                    res.send({ message: "Order Paid", order: order })
                )
                .catch(() => res.send({ message: "Order Not Found" }));
        } catch (error) {
            res.send({ error: "Error" });
        }
    };

    // [PUT] /:id/delivered
    delivered = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const order: Order = await orderModel.findOne({
                _id: req.params.id,
            });
            if (!order) {
                res.send({ message: "Order Not Found" });
            }
            order.delivered = req.body.saveDelivery;
            if (req.body.saveDelivery === "Delivered") {
                order.deliveredAt = Date.now();
            }
            orderModel
                .findOneAndUpdate({ _id: order.id }, order, {
                    returnOriginal: false,
                })
                .then((order: Order) =>
                    res.send({ message: "Order Paid", order })
                )
                .catch(() => res.send({ message: "Order Not Found" }));
        } catch (error) {
            res.send({ error: "Error" });
        }
    };

    // [PUT] /:id/pay
    update = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const order: Order = await orderModel.findOne({ _id: req.params.id });
        if (!order) {
            res.send({ message: "Order Not Found" });
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email: req.body.email,
        };
        orderModel
            .findOneAndUpdate({ _id: order.id }, order, {
                returnOriginal: false,
            })
            .then((order: Order) => res.send({ message: "Order Paid", order }))
            .catch(() => res.send({ message: "Order Not Found" }));
    };

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
        orderModel
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
        orderModel
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
                orderModel.restore({ _id: value }, (err: any, result: any) => {
                    if (err) throw err;
                    console.log(result);
                })
            );
            res.send("Restore Successfully");
        } catch (err: any) {
            res.json({ error: err });
        }
    }
}

module.exports = new OrderController();
