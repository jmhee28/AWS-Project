const { user } = require('../config/var-board');
const dynamoose = require("dynamoose");
const userSchema = new dynamoose.Schema(
    {
        id: {
            type: String,
            hashKey: true
        },
        email: {
            type: String,
            validate:/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i
        },
        createdAt: {
            type: Date,
            default: Date.now,
            
        }
    }
);

    const UsersModel = dynamoose.model(user.TABLE_NAME, userSchema, {
    throughput: "ON_DEMAND",
});

module.exports = { UsersModel };