import { MessageInterface } from '@type/chat';
import countTokens from './countTokens';
import useStore from '@store/store';

export const limitMessageTokens = (
  messages: MessageInterface[],
  limit: number = 4096
): MessageInterface[] => {
  if(useStore.getState().continuousConversation){
    return [...messages]
  };

  const limitedMessages: MessageInterface[] = [];
  let tokenCount = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const count = countTokens(messages[i].content);
    if (count + tokenCount > limit) break;
    tokenCount += count;
    limitedMessages.unshift({ ...messages[i] });
  }

  return limitedMessages;
};
