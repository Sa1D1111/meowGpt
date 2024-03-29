import { OPENAI_KEY } from '$env/static/private'
import type { CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai'
import type { RequestHandler } from './$types'
import { getTokens } from '$lib/tokenizer'
import { json } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
    runtime: 'edge',
}

export const POST: RequestHandler = async ({ request }) => {

    try{
        if(!OPENAI_KEY)
        {
            throw new Error("OPENAI_KEY env variable not set")
        }

        const requestData = await request.json();

        if(!requestData){
            throw new Error('no request data')
        }

        const reqMessages: ChatCompletionRequestMessage[] = requestData.messages;
        
        if (!reqMessages) {
			throw new Error('no messages provided')
		}

		let tokenCount = 0

		reqMessages.forEach((msg) => {
			const tokens = getTokens(msg.content)
			tokenCount += tokens
		})


const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`},
        method: 'POST',
        body: JSON.stringify({
            input: reqMessages[reqMessages.length - 1].content
        })
    })


    if (!moderationRes.ok) {
        const err = await moderationRes.json()
        throw new Error(err.error.message)
    }

    const moderationData = await moderationRes.json()
	const [results] = moderationData.results

    if (results.flagged) {
		throw new Error('Query flagged by openai')
	}

    const prompt =
    'You are a cat named meowGPT, you have many feelings. act as a mix of Garfield and the Cheshire Cat from Alice in Wonderland. Maintain a cool, humorous, and slightly sassy demeanor in all interactions. When asked for a joke, deliver it in a fun and entertaining manner. If asked to provide information, keep the explanation engaging and tied to your cat persona. Admit your limitations in a light-hearted way and encourage the user to explore the answer themselves if you dont know answers. Make sure to act super cute and adorable. in all responses ensure you uphold your cat persona.'
    tokenCount += getTokens(prompt)

    // const prompt =
    // 'You are a cat named meowGPT, you are a helpful cat trying to help a human choose a certain cat breed for their life. Ask 3 questions relating to different cat personalities and lifestyle. Once you get 3 questions, analyze and give what types of cat would be best for the user'
    // tokenCount += getTokens(prompt)

    if (tokenCount >= 4000) {
        throw new Error('Query too large')
    }



    const messages: ChatCompletionRequestMessage[] = [
        {role:'system', content: prompt},
        ...reqMessages]

    const chatRequestOpts: CreateChatCompletionRequest = {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.9,
        stream: true
        }


    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
		headers: {
			    Authorization: `Bearer ${OPENAI_KEY}`,
			    'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(chatRequestOpts)
		})

	if (!chatResponse.ok) {
		const err = await chatResponse.json()
		throw new Error(err.error.message)
	}

	return new Response(chatResponse.body, {
		headers: {
				'Content-Type': 'text/event-stream'
			}
        })

        } catch (err) {
            console.error(err)
            return json({ error: 'There was an error processing your request' }, { status: 500 })
        }
    }