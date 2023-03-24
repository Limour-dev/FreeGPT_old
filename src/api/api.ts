import { ConfigInterface, MessageInterface } from '@type/chat';
import useStore from '@store/store';

const get1Key = (key: string) => {
  const arr = key.split("|")
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomSubstr = arr[randomIndex];
  return randomSubstr;
}

const getLessMessages = (messages: MessageInterface[]) => {
  if (messages[0].role === 'system') {
    if(messages.length > 6){
      return [...messages.slice(0, 3), ...messages.slice(-3)];
    }
  }else{
    if(messages.length > 5){
      return [...messages.slice(0, 2), ...messages.slice(-3)];
    }
  }
  return messages;
}

export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  apiKey?: string
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (apiKey) headers.Authorization = `Bearer ${get1Key(apiKey)}`;
  if(useStore.getState().continuousConversation){
    messages = getLessMessages(messages)
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      ...config,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  apiKey?: string
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (apiKey) headers.Authorization = `Bearer ${get1Key(apiKey)}`;
  if(useStore.getState().continuousConversation){
    messages = getLessMessages(messages)
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      ...config,
      stream: true,
    }),
  });
  if (response.status === 404 || response.status === 405)
    throw new Error(
      'Message from freechatgpt.chat:\nInvalid API endpoint! We recommend you to check your free API endpoint.'
    );

  if (response.status === 429 || !response.ok) {
    const text = await response.text();
    let error = text;
    if (text.includes('insufficient_quota')) {
      error +=
        '\nMessage from freechatgpt.chat:\nToo many request! We recommend changing your API endpoint or API key';
    }
    throw new Error(error);
  }

  const stream = response.body;
  return stream;
};
