const AWS = require('aws-sdk')
const s3= new AWS.S3();
const { Configuration, OpenAIApi } = require("openai");
const {readFileSync} = require("fs");
const configuration = new Configuration({
    organization: process.env.ORGANIZATION, 
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

const { LAMBDA_TASK_ROOT } = process.env
module.exports.handler = async event =>{
    const { resource } = event;
    if(resource == '/pdf'){

        const certTemplateFile =  '<html><body><h1>Hello, world!</h1></body></html>'
        const certHtmlStr = encodeURIComponent(certTemplateFile)

        const certS3Keys = ['f1.pdf', 'f2.pdf']
        const pdfBuffers = await  htmlToPdf({htmlStrings:certHtmlStr})


            await s3.putObject({
                Bucket: 'sample--bucket',
                Key: certS3Keys[0],
                Body: pdfBuffers, ContentType: 'application/pdf',
                ContentDisposition: `attachment;filename="certificate.pdf"`,

            }).promise()


    }else {
        const request = JSON.parse(event.body);
        console.log(request)
        // 1. fix code error
        // 2. 코드 간략하게 정리
        // 3. 직접입력
        const {askAIType, conts, codeConts} = request
        let content
        switch (askAIType) {
            case 'BUG':
                content = "Fix error of the code"
                break
            case 'OPTIMIZE':
                content = "Optimize the code"
                break
            default:
                content = conts
                break
        }
        content += codeConts
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content}],
        })
        console.log(completion.data)
        const completion_text = completion.data.choices[0].message.content;
        console.log(completion_text);
        return completion_text
    }
}


const htmlToPdf = async (params) => {
    const puppeteer = require("puppeteer-core");
    const chromium = require("@sparticuz/chromium");
    try {
        const { htmlString, options = { format: 'A4', pageRanges: '1' } } = params
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        let page = await browser.newPage();
        await page.goto(`data:text/html;charset=UTF-8,${htmlString}`, {
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
