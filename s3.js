const AWS = require('aws-sdk')
const s3= new AWS.S3();
const fileBucketName = 'sample--bucket'
async function parallelExecute(asyncFunction, argsArray, batchSize = 2) {
    let batchedArgs = [];

    for (let i = 0; i < argsArray.length; i += batchSize) {
        const batch = argsArray.slice(i, i + batchSize);
        const promises = batch.map(args => asyncFunction(args))
        const results = await Promise.all(promises);
        batchedArgs.push(...results)
    }
    console.log('batchedArgs:::', batchedArgs)
    return batchedArgs
}

const getObject = async params => {
    console.log('params:::', params)
    const { Bucket = fileBucketName, Key } = params

    let result
    try {
        if(Bucket && Key) {
            result = await s3.getObject({ Bucket, Key }).promise()
        }
    } catch (error) {
        console.log('error: ', error)
        if(Bucket !== 'devfile.poincampus.com' && Bucket !== 'file.poincampus.com') {
            console.log(Bucket)
        }
    } finally {
        return result
    }
}


const params = {
    Bucket: 'sample--bucket',
    Key: 'file1.pdf'
};
const func = async () =>{
    // const result = await getObject({Key:'file1.pdf' })
    const certS3Keys = [{Key:'file1.pdf'}, {Key:'file2.pdf'}, {Key:'file3.pdf'}, {Key:'file4.pdf'}, {Key:'file.pdf'}]
    const result = await parallelExecute(getObject, certS3Keys)
    // console.log(result)
}
func()
// let temp = {key:'k'}
// if(!Array.isArray(temp))
// {
//     temp = [temp]
// }
// console.log(Array.isArray(temp))