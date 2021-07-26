import { MessageToSend, useChannelActionContext } from 'stream-chat-react';

import { useGiphyContext } from '../contexts/GiphyContext';

export const useOverrideSubmit = () => {
  const { sendMessage } = useChannelActionContext();
  const { giphyState, setGiphyState } = useGiphyContext();

  const overrideSubmitHandler = (message: MessageToSend) => {
    let updatedMessage;

    if (message.attachments?.length && message.text?.startsWith('/giphy')) {
      const updatedText = message.text.replace('/giphy', '');
      updatedMessage = { ...message, text: updatedText };
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...message, text: updatedText };
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message;
      const parentMessage = newMessage.parent;

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString(),
            }
          : undefined,
      };

      sendMessage(messageToSend);
    }

    setGiphyState(false);
  };

  return overrideSubmitHandler;
};
