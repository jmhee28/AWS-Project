const AWS = require('aws-sdk')
const s3= new AWS.S3();
const fileBucketName = 'sample--bucket'


const htmlToPdf = async (params) => {
    const puppeteer = require("puppeteer");
    try {
        const { htmlString, options = { format: 'A4', pageRanges: '1' } } = params
        const browser = await puppeteer.launch({
        });
        let page = await browser.newPage();
        await page.goto(htmlString ? `data:text/html;charset=UTF-8,${htmlString}` : htmlUri, {
            waitUntil: "networkidle0",
        });
        const pdf = await page.pdf(options);
        await browser.close();
        return pdf
    } catch (e) {
        console.log('htmlToPdf error')
        console.log(e)
        throw e
    }
}

const nf = async ()=>{
    const params = {
        htmlString: '<html><body><h1>Hello, world!</h1></body></html>'

    };
    const pdfBuffer = await htmlToPdf(params)

     await s3.putObject({
        Bucket: 'sample--bucket',
        Key: 'f1.pdf',
        Body: pdfBuffer, ContentType: 'application/pdf',
        ContentDisposition: `attachment;filename="certificate.pdf"`,
        ACL: 'private',
    }).promise()
}
nf()