const { board } = require('../config/var-board');
const dynamoose = require("dynamoose");

const boardSchema = new dynamoose.Schema(
    {
        categories: { 
            type: String,
            hashKey: true,
            index: {
                name: "categoryIndex",
                global: true,
                rangeKey: "createdAt"
              },
            enum: ["Board", "Post", "Comment"] // "Board", "Post", "Comment" 중 하나
        },
        id: {
            type: String,
            rangeKey: true   
        },
        createdAt: {
            type: Date,
            default: Date.now            
        },
        updatedAt: {
            type: Date
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
        },
        userid: {
            type: String,
            index: {
              name: "userIndex",
              global: true,
              rangeKey: "createdAt"
            }
          },
        upperid : {
            type: String,
            index: {
              name: "upperIdIndex",
              global: true,
              rangeKey: "createdAt"
            },
          },
    }
)
const BoardsModel = dynamoose.model( board.TABLE_NAME , boardSchema, {
    throughput: "ON_DEMAND",
});



module.exports = { BoardsModel };