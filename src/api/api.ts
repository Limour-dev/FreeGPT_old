import { ConfigInterface, MessageInterface } from '@type/chat';

const get1Key = (key: string) => {
  const arr = key.split("|")
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomSubstr = arr[randomIndex];
  return randomSubstr;
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
