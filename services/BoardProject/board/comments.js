const { v4 } = require('uuid');
const { BoardsModel } = require('../common/schema/Board');
const { UsersModel } = require('../common/schema/User');
const { delPosts } = require('./common');
const { BoardError, ErrorName } = require('../common/config/boardError');

const addComments = async (event) => {

    const request = JSON.parse(event.body);

    const { title, content, userid, upperid } = request;

    const user = await UsersModel.get(userid);
    if (!user) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'User not found')
    }
    const post = await BoardsModel.get({ categories: "Post", upperid });
    if (!post) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Post not found')
    }
    const result = await BoardsModel.create({//it returns a Item initializer that you can use to create instances of the given model.
        categories: "Comment",
        id: v4(),
        title,
        content,
        userid,
        upperid
    });
    return result;
};
const updateComments = async (event) => {

    const { id, ...data } = JSON.parse(event.body);
    const comment = await BoardsModel.get({ categories: "Comment", upperid });
    if (!comment) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Comment not found')
    }
    const result = await BoardsModel.update({ categories: "Comment", id }, { ...data });
    return result;
};
const getCommentsByPostID = async (event) => {
    const { id } = event.pathParameters;
    console.log(categories, id);
    const post = await BoardsModel.get({ categories: "Post", id });
    if (!post) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Post not found')
    }
    const result = await BoardsModel.query("upperid").eq(id).sort("descending").exec();
    return result;
};

const deleteComments = async (event) => {

    const request = JSON.parse(event.body);
    const { id } = request;

    let deleteitems = id.map(async (element) => {
        const comment = await BoardsModel.get({ categories: "Comment", element });
        if (!comment) {
            throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Comment not found')
        }
        return { categories: "Comment", id: element };
    })

    const result = await BoardsModel.batchDelete(deleteitems);//returns a promise that will resolve when the operation is complete, this promise will reject upon failure
    return result;
};

module.exports = {
    addComments, deleteComments, updateComments, getCommentsByPostID

}