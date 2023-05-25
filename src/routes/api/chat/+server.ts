import { OPENAI_KEY } from "$env/static/private";
import type { ChatCompletionRequestMessage } from "openai";
import type { RequestHandler } from "./$types"

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

        const reqmessages: ChatCompletionRequestMessage[] = requestData.messages;
        
    }catch(err){}
    return new Response();
};