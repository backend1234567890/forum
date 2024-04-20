import { getData, setData, getHashInteger, EmptyObject } from './dataStore';
import { loggedinId } from './auth';
import HTTPError from 'http-errors';

export interface Message{
    messageId: number
}

export const userPost = (token: string, topicId: number, message: string): Message => {
  const data = getData();
  const user = loggedinId(token);

  const topic = data.topics.find(top => top.topicId === topicId);
  if (!topic) {
    throw HTTPError(400, 'Invalid topicId');
  }

  if (message === '') {
    throw HTTPError(400, 'Messasge cannot be empty');
  }

  const messageId = getHashInteger(data.messages.length, 7);
  const sender = data.users.find(u => u.username === user.username).displayName;
  const timeSent = Math.floor(Date.now() / 1000);

  data.messages.push({
    messageId,
    topicId,
    sender,
    timeSent,
    message
  });

  setData(data);
  return {
    messageId
  };
};
