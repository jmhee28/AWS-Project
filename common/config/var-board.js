'use strict'
const { STAGE } = process.env
const board = {
    TABLE_NAME:`${STAGE}-Board-Table`
}
const user ={
    TABLE_NAME:`${STAGE}-Board-User-Table`
}
module.exports ={
    board,
    user
}