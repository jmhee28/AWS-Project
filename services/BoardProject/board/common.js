'use strict';

const { v4 } = require('uuid');
const { BoardsModel } = require('../common/schema/Board');

const delPosts = async (id) => {
    try {
        
        const posts = id.map(function (element) {
            return { categories: "Post", id: element };
        });

        // 순서 상관 X 비동기 처리 
        const comments = await Promise.all(
            id.map((element) =>
                BoardsModel.query("upperid").eq(element).attributes(["categories", "id"]).exec()
            )
        );
        let commentids = [];
        comments.forEach(e =>{
            commentids = [...commentids, ...e];
        });

        console.log(commentids);
        const commentResult = await BoardsModel.batchDelete(commentids);
        const postResult = await BoardsModel.batchDelete(posts);
        return {commentResult, postResult };
    } catch (error) {
        return error;
    }
};

module.exports = {
     delPosts
};
