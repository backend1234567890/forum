import {
  userAuthRegister,
  userTopicCreate,
  userTopicInfo,
  userPost,
  clear
} from './testWrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  clear();
});

describe('1. userPost()', () => {
  let token1: string;
  let token2: string;
  let topicId1: number;

  beforeEach(() => {
    token1 = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    token2 = userAuthRegister({
      username: 'shadowfaiz',
      displayName: 'Shadow',
      password: 'IMissU123',
      repeatPassword: 'IMissU123'
    }).token;

    topicId1 = userTopicCreate(token1, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userPost(JSON.stringify(JSON.parse(token1) + 1), topicId1, { message: 'This is my message' })).toThrow(HTTPError[401]);
  });

  test('b. Error: Invalid topicId', () => {
    expect(() => userPost(token1, topicId1 + 1, { message: 'This is my message' })).toThrow(HTTPError[400]);
  });

  test('c. Error: Message is empty', () => {
    expect(() => userPost(token1, topicId1, { message: '' })).toThrow(HTTPError[400]);
  });

  test('d. Success', () => {
    const message1 = userPost(token1, topicId1, { message: 'This is my first message.' });
    const message2 = userPost(token2, topicId1, { message: 'This is his first message.' });
    const message3 = userPost(token1, topicId1, { message: 'This is my second message.' });
    const message4 = userPost(token1, topicId1, { message: 'This is my third message.' });
    const message5 = userPost(token2, topicId1, { message: 'This is his second message.' });
    expect(message1).toStrictEqual({ messageId: expect.any(Number) });
    expect(message2).toStrictEqual({ messageId: expect.any(Number) });
    expect(message3).toStrictEqual({ messageId: expect.any(Number) });
    expect(message4).toStrictEqual({ messageId: expect.any(Number) });
    expect(message5).toStrictEqual({ messageId: expect.any(Number) });

    expect(userTopicInfo(token1, topicId1)).toStrictEqual({
      topicId: topicId1,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: [
        {
          me: true,
          sender: 'Faiz Arradhin',
          messageId: message1.messageId,
          message: 'This is my first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          messageId: message2.messageId,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          messageId: message3.messageId,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          messageId: message4.messageId,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          messageId: message5.messageId,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        }
      ]
    });

    expect(userTopicInfo(token2, topicId1)).toStrictEqual({
      topicId: topicId1,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: [
        {
          me: false,
          sender: 'Faiz Arradhin',
          messageId: message1.messageId,
          message: 'This is my first message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Shadow',
          messageId: message2.messageId,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          messageId: message3.messageId,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          messageId: message4.messageId,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Shadow',
          messageId: message5.messageId,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        }
      ]
    });
  });
});
