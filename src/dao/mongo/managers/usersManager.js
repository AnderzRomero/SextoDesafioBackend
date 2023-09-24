import userModel from "../models/user.model.js";

export default class UserManager {
    get = () => {
        return userModel.find().lean();
    }

    getBy = (params) => {
        return userModel.findOne(params).lean();
    }

    create = (user) => {
        return userModel.create(user);
    }
}