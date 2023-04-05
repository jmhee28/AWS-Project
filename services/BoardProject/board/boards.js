'use strict';

const { v4 } = require('uuid');
const { BoardsModel } = require('../common/schema/Board');
const { UsersModel } = require('../common/schema/User');
const { delPosts } = require('./common');
const { BoardError, ErrorName } = require('../common/config/boardError');

const addBoards = async (event) => {
    const request = JSON.parse(event.body);

    const { title, userid } = request;
    const user = await UsersModel.get(userid);
    if (!user) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'User not found')
    }
    const result = await BoardsModel.create({//it returns a Item initializer that you can use to create instances of the given model.
        categories: "Board",
        id: v4(),
        title,
        userid,
    });
    return result;

};
const getAllBoards = async (event) => {

    const result = await BoardsModel.query("categories").using("categoryIndex")
        .eq("Board").sort("descending").all().exec();
    return result;

};
//////////// board#post#comment
const deleteBoards = async (event) => {

        let result = []
        const request = JSON.parse(event.body);
        const { id } = request;
        // console.log(id);
        const boards = id.map(async (element) => {
            let board = await BoardsModel.get({ categories: "Board", element });
            if (!board) {
                throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Board not found')
            }
            return { categories: "Board", id: element };
        });

        const posts = await Promise.all(
            id.map((element) =>
                BoardsModel.query("upperid").eq(element).attributes(["id"]).exec()
            )
        );

        let postids = [];
        posts.forEach(e => {
            postids = [...postids, e];
        });

        if (postids.length > 0) {
            const postResult = await delPosts(postids);
            result.push(postResult);
        }

        const boardResult = await BoardsModel.batchDelete(boards);
        result.push(boardResult);

        return result;

};

const updateBoards = async (event) => {

    const { id, ...data } = JSON.parse(event.body);
    const board = await BoardsModel.get({ categories: "Board", id });
    if (!board) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Board not found')
    }
    const result = await BoardsModel.update({ categories: "Board", id }, { ...data });

    return result;
};
// get By ID
const getBoardPostByID = async (event) => {
    const { id } = event.pathParameters;
    const board = await BoardsModel.get({ categories: "Board", id });
    if (!board) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Board not found')
    }
    const result = await BoardsModel.query("upperid").eq(id).sort("descending").exec();

    return result;

};
const getBoardByID = async (event) => {
    const { id } = event.pathParameters;
    const result = await BoardsModel.get({ categories: "Board", id });
    if (!result) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Board not found')
    }
    return result;

};
module.exports = {
    addBoards,
    getAllBoards,
    deleteBoards, updateBoards, getBoardPostByID, getBoardByID
}