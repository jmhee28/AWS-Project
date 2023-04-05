const AWS = require('aws-sdk')
const s3= new AWS.S3();

const copyPublicS3 = async videoId => {
    var srcBucket = 'poinsample'
    var srcPrefix = '123' + '/'
    var dstBucket = 'poinsample2'
    var dstPrefix = '123'+ '/'
    let params = {Bucket: srcBucket, Prefix: srcPrefix, MaxKeys: 4}
    let infos = {srcBucket,srcPrefix, dstBucket, dstPrefix }
    await copyParallel (params, infos );
    const rslt = await s3.listObjectsV2({Bucket: dstBucket, Prefix: dstPrefix }).promise()
    rslt.Contents.forEach(async obj=>{
        let srcKey = obj.Key;
        let dstKey = dstPrefix + srcKey.replace(srcPrefix, '');
        console.log(dstKey, await s3.getObject({Bucket: dstBucket,Key: dstKey}).promise())
    })
    console.log('after:::',rslt)
   
const copyParallel = async (params, infos ) =>{
   
     const { srcBucket, srcPrefix, dstBucket, dstPrefix } = infos
     const NUM = 20
     const data = await s3.listObjectsV2(params).promise();

     let maxIdx = Math.ceil(data.Contents.length / NUM)
     console.log(`maxIdx:::`, maxIdx)
     console.log('data length::', data.Contents.length)
     let idx = 0
    let proms =[]
         data.Contents.forEach(obj =>{
             let srcKey = obj.Key;
             let dstKey = dstPrefix + srcKey.replace(srcPrefix, '');
             let copyParams ={
                         CopySource: srcBucket + '/' + srcKey,
                         Bucket: dstBucket,
                         Key: dstKey,
                         Tagging: 'status=delete',
                         TaggingDirective: 'REPLACE',
                     }
             proms.push(s3.copyObject(copyParams).promise())
         })
         await Promise.all(proms)
         idx++
}


copyPublicS3();

const bucketName = 'poinsample'
const copyOne= async()=>{
    var srcBucket = 'poinsample'
    var srcPrefix = '123' + '/'
    var dstBucket = 'poinsample2'

    const objectParams_dl = {
        Bucket: dstBucket, // 복사될 파일의 버킷 지정
        Key: srcPrefix, // 복사될 파일
        CopySource:  srcBucket +'/'+ srcPrefix, // 복사할 파일 경로 지정
        //? CopySource에는 root에서의 경로가 아니라, 버킷 이름까지 포함 시켜야 한다.
    };
    await s3
        .copyObject(objectParams_dl)
        .promise()
        .then((data) => {
        console.log('Copy Success! : ', data);
        })
        .catch((error) => {
        console.error(error);
        });
}

}