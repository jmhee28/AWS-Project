'use strict';
const { UsersModel } = require('../common/schema/User');
const { BoardsModel } = require('../common/schema/Board');
const { BoardError, ErrorName } = require('../common/config/boardError');
const { v4 } = require('uuid');
const emailRegex = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
const addUser = async (event) => {

    // console.log(event);
    const request = JSON.parse(event.body);

    const { email } = request;
    if (!emailRegex.test(email)) {
        throw new BoardError(ErrorName.INVALID_PARAMETER, 400, 'Wrong Email Format');
    }
    const result = await UsersModel.create({//it returns a Item initializer that you can use to create instances of the given model.
        id: v4(),
        email
    });
    return result;

};

const getAllUsers = async (event) => {

    const result = await UsersModel.scan().all().exec();
    return result;
};

const getUsers = async (event) => {

    const { id } = event.pathParamters;
    console.log(id);
    const result = await UsersModel.get(id);
    if (!result) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'User not found')
    }
    return result;

};

const updateUser = async (event) => {

    const request = JSON.parse(event.body);
    const { id, ...data } = request;
    const user = await UsersModel.get(id);
    if (!user) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'User not found')
    }
    console.log(id);
    const result = await UsersModel.update({ id }, { ...data });
    return result;
};
const deleteUsers = async (event) => {

    const request = JSON.parse(event.body);
    const { id } = request;
    console.log(id);
    const result = await UsersModel.batchDelete(id);//returns a promise that will resolve when the operation is complete, this promise will reject upon failure
    return result;

};
const getUserWrite = async (event) => {

    const { categories, id } = event.queryStringParameters;
    const user = await UsersModel.get(id);
    if (!user) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'User not found')
    }
    const result = await BoardsModel.query("userid").eq(id).where("categories").eq(categories).exec();//returns a promise that will resolve when the operation is complete, this promise will reject upon failure
    return result;

}
module.exports = {
    addUser,
    getAllUsers,
    getUsers,
    updateUser,
    deleteUsers,
    getUserWrite,

}