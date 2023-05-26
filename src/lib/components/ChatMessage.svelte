
<script lang="ts">
    import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
    export let type: ChatCompletionRequestMessageRoleEnum
    export let message: string
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
    <div class="chat-image avatar">
        <div class="w-10 rounded-full">
            <img
                src="https://ui-avatars.com/api/?name={type === 'user' ? 'Me' : 'Ct'}"
                alt="{type} avatar"
            />
        </div>
    </div>
    <div class="chat-bubble {type === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
        {message}
    </div>
</div>

<style>
    .chat {
        display: flex;
        align-items: flex-end;
        max-width: 80%;
        padding: 0.8em;
        border-radius: 1em;
        color: white;
        margin-bottom: 0.5em;
    }

    .chat-start {
        align-self: flex-start;
        background-color: #007bff;
        border-bottom-left-radius: 0;
    }

    .chat-end {
        align-self: flex-end;
        background-color: #28a745;
        border-bottom-right-radius: 0;
    }

    .chat-bubble-primary {
        background-color: #007bff;
    }

    .chat-bubble-secondary {
        background-color: #28a745;
    }

    .avatar {
        margin-right: 0.5em;
    }

    .w-10 {
        width: 2.5rem;
        height: 2.5rem;
    }
</style>


