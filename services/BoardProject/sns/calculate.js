const { BoardsModel } = require('../common/schema/Board');

module.exports.handler = async (event) => {
    const upperid = JSON.parse(event.Records[0].Sns.Message)
    console.log(upperid);
    let result =  await BoardsModel.query("upperid").eq(upperid).count().all().exec();
    console.log("count: ", result);
    
    return result
  }