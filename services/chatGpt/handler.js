const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.ORGANIZATION, 
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
module.exports.handler = async event =>{
    const request = JSON.parse(event.body);
    console.log(request)
    // 1. fix code error
    // 2. 코드 간략하게 정리
    // 3. 직접입력
    const { askAIType, conts, codeConts } = request
    let content
	switch(askAIType){
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
        messages: [{ role: "user", content}],
    })
    console.log(completion.data)
	const completion_text = completion.data.choices[0].message.content;
    console.log(completion_text);
    return completion_text
}



