'use strict';


const { addPosts, getPostByID, updatePosts, deletePosts, getAllPosts } = require('./board/posts');
const { addBoards, getAllBoards,deleteBoards, updateBoards, getBoardPostByID, getBoardByID} = require('./board/boards');
const {addComments,deleteComments,updateComments, getCommentsByPostID} = require('./board/comments');
const { addUser, getAllUsers, getUsers, updateUser, deleteUsers, getUserWrite } = require('./user/user');
const {signUp, login, verification, tokenRefresh}  = require('./auth');
const { errorHandler } = require('./common/config/boardError');
module.exports.Posts = async event => {
    try {

        // console.log(event);
        const { httpMethod, resource } = event;      
        let result;
        ///Board
        if (resource == '/boards' && httpMethod == 'POST') {
           result = await addBoards(event);
        } else if (resource == '/boards' && httpMethod == 'GET') {
            result = await getAllBoards(event);
        } else if (resource == '/boards' && httpMethod == 'DELETE') {
            result = await deleteBoards(event);
        } else if (resource == '/boards' && httpMethod == 'PUT') {
            result = await updateBoards(event);
        } else if (resource == '/boards/{id}' && httpMethod == 'GET') {
            result = await getBoardByID(event);
        }else if (resource == '/boards/{id}/posts' && httpMethod == 'GET') {
            result = await getBoardPostByID(event);
        }
        ///Post
        else if (resource == '/posts' && httpMethod == 'POST') {
            result = await addPosts(event);
        }else if (resource == '/posts' && httpMethod == 'GET') {
            result = await getAllPosts(event);
        }else if (resource == '/posts' && httpMethod == 'DELETE') {
            result = await deletePosts(event);
        }else if (resource == '/posts' && httpMethod == 'PUT') {
            result = await updatePosts(event);
        }else if (resource === '/posts/{id}' && httpMethod === 'GET') {
            result = await getPostByID(event);
        }else if (resource === '/posts/{id}/comments' && httpMethod === 'GET') {
            result = await getCommentsByPostID(event);
        }
        //Comment
        else if (resource == '/comments' && httpMethod == 'POST') {
            result = await addComments(event);
        }else if (resource == '/comments' && httpMethod == 'DELETE') {
            result = await deleteComments(event);
        }else if (resource == '/comments' && httpMethod == 'PUT') {
            result = await updateComments(event);
        }
        //User
        else if (resource === '/users' && httpMethod === 'POST') {
            result = await addUser(event);
        } else if (resource === '/users' && httpMethod === 'PUT') {
            result = await updateUser(event);
        } else if (resource === '/users' && httpMethod === 'DELETE') {
            result = await deleteUsers(event);
        } else if (resource === '/users/{id}' && httpMethod === 'GET') {
            result = await getUsers(event);
        } else if (resource === '/users' && httpMethod === 'GET') {
            result = await getAllUsers(event);
        } else if (resource === '/user/{id}/{categories}' && httpMethod === 'GET') {
            result = await getUserWrite(event);
        }
        // Auth
        else if (resource === '/auth/signup' && httpMethod === 'POST') {
            result = await signUp(event);
        } else if (resource === '/auth/login' && httpMethod === 'POST') {
            result = await login(event);
        }
         else if (resource === '/auth/verification' && httpMethod === 'POST') {
            result = await verification(event);
        }  else if (resource === '/auth/token' && httpMethod === 'POST') {
            result = await tokenRefresh(event);
        } 
        const res = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET, DELETE, POST, PUT"
            },
            body: JSON.stringify(result)
        }
        return res;
    } catch (error) {
        console.log(event)
		const e = errorHandler(error)
		const err = {
			statusCode: e[0].status,
			headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET, DELETE, POST, PUT"
            },
			body: JSON.stringify({ errors: e })
		}
		return err
    }
}

