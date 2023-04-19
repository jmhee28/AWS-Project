const AWS = require('aws-sdk')
const s3= new AWS.S3();
const fileBucketName = 'sample--bucket'
const archiver = require('archiver');
const { Readable } = require('stream');
const { promisify } = require('util');
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
const zipBuffer = async (pdfBuffers, names) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const buffers = [];

    // 'data' 이벤트 핸들러
    archive.on('data', buffer => buffers.push(buffer));

    // 'end' 이벤트 핸들러
    const end = promisify(archive.on).bind(archive)('end');

    // PDF 파일 버퍼를 압축 파일에 추가
    for (let i = 0; i < pdfBuffers.length; i++) {
        const pdfBuffer = pdfBuffers[i];
        archive.append(pdfBuffer, { name: `${encodeURIComponent(names[i])}.pdf` });
    }

    // 압축 파일 생성
    archive.finalize();

    await end;

    // 버퍼를 합쳐서 반환
    return Buffer.concat(buffers);
};
const nf = async ()=>{
    const params = {
        htmlString: '<html><body><h1>Hello, world!</h1></body></html>'
    };
    const pdfBuffer = await htmlToPdf(params)
    const pdfBuffers = [pdfBuffer, pdfBuffer]
    const names = ['1.pdf', '2.pdf']
    const buffer = await zipBuffer(pdfBuffers, names);
     await s3.putObject({
        Bucket: 'sample--bucket',
        Key: 'files.zip',
        Body: buffer,
        ContentDisposition: `attachment;filename="files.zip"`,
        ACL: 'private',
    }).promise()
}
nf()