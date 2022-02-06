import * as express from "express";
const userModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

interface User {
    _id: any;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    sex: number;
    role: number;
    address: string;
    password: string;
}

class UserController {
    // [POST] login
    login = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const user: User = await userModel.findOne({
                email: req.body.email,
            });
            if (user) {
                if (bcryptjs.compareSync(req.body.password, user.password)) {
                    res.send({
                        info: {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            phone: user.phone,
                            sex: user.sex,
                            role: user.role,
                            address: user.address,
                        },
                        message: {
                            message: "Đăng nhập thành công !",
                        },
                    });
                    return;
                }
                res.send({ message: "Email hoặc mật khẩu không chính xác !" });
            } else {
                res.send({ message: "User không tồn tại !" });
            }
        } catch (err: any) {
            res.send({ error: err?.message });
            next(err);
        }
    };

    // [POST] /register
    register = async (
        req: express.Request,
        res: express.Response,
        err: express.NextFunction
    ) => {
        const newUser = new userModel({
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 8),
        });
        console.log(newUser);

        await newUser
            .save()
            .then(() =>
                res.send({
                    info: {
                        _id: newUser._id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        phone: newUser.phone,
                        role: newUser.role,
                        sex: newUser.sex,
                        address: newUser.address,
                    },
                    message: {
                        message: "Đăng ký thành công !",
                    },
                })
            )
            .catch((err: any) => res.status(500).json({ error: err?.message }));
    };

    // [GET] /
    show(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        Promise.all([userModel.find({}), userModel.countDocumentsDeleted()])
            .then(([Users, deletedCount]) =>
                res.json({
                    deletedCount,
                    Users,
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
        userModel
            .findDeleted({})
            .then((Users: User[]) => res.json(Users))
            .catch(next);
    }

    // [POST] /:id
    getRole(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        userModel
            .findById(req.body.id)
            .then((User: User) => res.json(User?.role))
            .catch(next);
    }

    // [GET] /:id/edit
    edit(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        userModel
            .findById(req.params.id)
            .then((User: User) => res.send(User))
            .catch(next);
    }

    // [PUT] /:id
    update(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        userModel
            .updateOne({ _id: req.params.id }, req.body)
            .then(() => res.send({ message: "Update Successfully" }))
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
        userModel
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
        const ids: string = req.body.id;
        const idArr = ids.split(",");
        userModel
            .deleteMany({ _id: idArr })
            .then(() => res.send("Delete Forever Successfully"))
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
            ids.forEach((value: string) =>
                userModel.restore({ _id: value }, (err: any, result: any) => {
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
module.exports = new UserController();
