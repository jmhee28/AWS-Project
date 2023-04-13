'use strict';

const { v4 } = require('uuid');
const { BoardsModel } = require('../common/schema/Board');
const { UsersModel } = require('../common/schema/User');
const { delPosts } = require('./common');
const { BoardError, ErrorName } = require('../common/config/boardError');

const aws = require('aws-sdk');
const sns = new aws.SNS({ region: 'ap-northeast-2' })

const publishSnsTopic = async (data) => {
    const params = {
        Message: JSON.stringify(data),
        TopicArn: process.env.snsCalTopicArn
    }
    return sns.publish(params).promise()
}

const addPosts = async (event) => {

    // console.log(event);
    const request = JSON.parse(event.body);
    console.log(request);
    const { title, content, userid, upperid } = request;

    const user = await UsersModel.get(userid);
    if (!user) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'User not found')
    }

    const board = await BoardsModel.get({ categories: "Board", id: upperid });
    if (!board) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Board not found')
    }

    const result = await BoardsModel.create({//it returns a Item initializer that you can use to create instances of the given model.
        categories: "Post",
        id: v4(),
        title,
        content,
        userid,
        upperid
    });

    const metadata = await publishSnsTopic(upperid);
    console.log('meta:::', metadata);
    return result;
};

const getPostByID = async (event) => {
    const { id } = event.pathParameters;
    const result = await BoardsModel.get({ categories: "Post", id });
    if (!result) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Post not found')
    }
    return result;

};

const updatePosts = async (event) => {
    const { id, ...data } = JSON.parse(event.body);
    const post = await BoardsModel.get({ categories: "Post", id });
    if (!post) {
        throw new BoardError(ErrorName.REQUEST_NOT_FOUND, 400, 'Post not found')
    }
    const result = await BoardsModel.update({ categories: "Post", id }, { ...data });
    return result;
};

const deletePosts = async (event) => {
    const request = JSON.parse(event.body);
    const { id } = request;
    const result = await delPosts(id);   
    return result;
};

const getAllPosts = async (event) => {

    const result = await BoardsModel.query("categories").using("categoryIndex")
        .eq("Post").sort("descending").all().exec();

    return result;
};


module.exports = {
    addPosts,
    getPostByID,
    updatePosts,
    deletePosts,
    getAllPosts
};