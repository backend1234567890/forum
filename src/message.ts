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
  const username = data.users.find(u => u.username === user.username).username;
  const timeSent = Math.floor(Date.now() / 1000);

  data.messages.push({
    messageId,
    topicId,
    sender,
    timeSent,
    message,
    username
  });

  setData(data);
  return {
    messageId
  };
};

export const userPostUpdate = (token: string, topicId: number, messageId: number, message: string): EmptyObject => {
  const data = getData();
  const user = loggedinId(token);

  const chosenMessage = data.messages.find(mes => mes.messageId === messageId);
  if (chosenMessage.username !== user.username) {
    throw HTTPError(403, 'Message not owned by this user');
  }
  
  if (chosenMessage.topicId !== topicId) {
    throw HTTPError(400, "Message is not in this topic");
  }

  const topic = data.topics.find(top => top.topicId === topicId);
  if (!topic) {
    throw HTTPError(400, 'Invalid topicId');
  }

  if (message === '') {
    throw HTTPError(400, 'Messasge cannot be empty');
  }

  chosenMessage.message = message;

  setData(data);
  return {};
}