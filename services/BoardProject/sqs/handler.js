const AWS = require('aws-sdk')
const { v4 } = require('uuid');
const SQS = new AWS.SQS()
const { SEND_SQS_URL } = process.env

const { v1: uuidv1 } = require('uuid')
const uuidTs = (timestamp) => {
	const msecs = timestamp ? new Date(timestamp).getTime() : undefined
	return uuidv1({ msecs })?.replace(/^(.{8})-(.{4})-(.{4})/, '$3-$2-$1') || ''
}


module.exports.Sqs = async event => {
    try {
        const { httpMethod } = event;  
		const { Records } = event
        // console.log(SEND_SQS_URL); 
		if (httpMethod == 'POST') {
            const request = JSON.parse(event.body);
            // console.log(request);
			const proms = []
			// sqs 메시지 전송은 10건까지 가능. 10개로 잘라서 전송한다.
            //배열 형태
        
			let Entries = [...Array(Math.ceil(request.length / 10))]
			Entries.forEach((_, idx) => {
				Entries[idx] = []
				request.slice(idx * 10, idx * 10 + 10).forEach((r) => {
					if (r) {
                        // console.log(r);
						Entries[idx].push({
                            Id: uuidTs(),
							MessageBody: JSON.stringify({
								r
							})
						})
					}
				})
				proms.push(SQS.sendMessageBatch({ QueueUrl: SEND_SQS_URL, Entries: Entries[idx] }).promise())
			})
			await Promise.all(proms)
		}
        else{
            const { Records } = event
		    console.log(Records)
        }
	} catch (error) {
		console.log(error)
	}

}