import {
  userAuthRegister,
  userTopicCreate,
  userTopicInfo,
  userPost,
  clear,
  userPostUpdate
} from './testWrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  clear();
});

describe('1. userPost()', () => {
  let token1: string;
  let token2: string;
  let token3: string;
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

    token3 = userAuthRegister({
      username: 'shadow',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
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
    const message6 = userPost(token3, topicId1, { message: 'This is his first second message.' });
    expect(message1).toStrictEqual({ messageId: expect.any(Number) });
    expect(message2).toStrictEqual({ messageId: expect.any(Number) });
    expect(message3).toStrictEqual({ messageId: expect.any(Number) });
    expect(message4).toStrictEqual({ messageId: expect.any(Number) });
    expect(message5).toStrictEqual({ messageId: expect.any(Number) });
    expect(message6).toStrictEqual({ messageId: expect.any(Number) });

    expect(userTopicInfo(token1, topicId1)).toStrictEqual({
      topicId: topicId1,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: [
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message1.messageId,
          message: 'This is my first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message2.messageId,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message3.messageId,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message4.messageId,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message5.messageId,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'shadow',
          messageId: message6.messageId,
          message: 'This is his first second message.',
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
          username: 'faizarradhin',
          messageId: message1.messageId,
          message: 'This is my first message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message2.messageId,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message3.messageId,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message4.messageId,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message5.messageId,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'shadow',
          messageId: message6.messageId,
          message: 'This is his first second message.',
          timeSent: expect.any(Number)
        }
      ]
    });

    expect(userTopicInfo(token3, topicId1)).toStrictEqual({
      topicId: topicId1,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: [
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message1.messageId,
          message: 'This is my first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message2.messageId,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message3.messageId,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message4.messageId,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message5.messageId,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'shadow',
          messageId: message6.messageId,
          message: 'This is his first second message.',
          timeSent: expect.any(Number)
        }
      ]
    });
  });
});

describe('2. userPostUpdate()', () => {
  let token1: string;
  let token2: string;
  let token3: string;
  let topicId1: number;
  let topicId2: number;
  let message1: number;
  let message2: number;
  let message3: number;
  let message4: number;
  let message5: number;
  let message6: number;

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

    token3 = userAuthRegister({
      username: 'shadow',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    topicId1 = userTopicCreate(token1, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;

    topicId2 = userTopicCreate(token1, {
      title: 'How to do something else?',
      description: 'Do not know what to explain'
    }).topicId;

    message1 = userPost(token1, topicId1, { message: 'This is my first message.' }).messageId;
    message2 = userPost(token2, topicId1, { message: 'This is his first message.' }).messageId;
    message3 = userPost(token1, topicId1, { message: 'This is my second message.' }).messageId;
    message4 = userPost(token1, topicId1, { message: 'This is my third message.' }).messageId;
    message5 = userPost(token2, topicId1, { message: 'This is his second message.' }).messageId;
    message6 = userPost(token3, topicId1, { message: 'This is his first second message.' }).messageId;
    message6 = userPost(token3, topicId2, { message: 'This is his first second message.' }).messageId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userPostUpdate(JSON.stringify(JSON.parse(token1) + 1), topicId1, message1, { message: 'New messaage' })).toThrow(HTTPError[401]);
  });

  test('b. Error: Invalid topicId', () => {
    expect(() => userPostUpdate(token1, topicId1 + 1, message1, { message: 'New message' })).toThrow(HTTPError[400]);
  });

  test('c. Error: Message is empty', () => {
    expect(() => userPostUpdate(token1, topicId1, message1, { message: '' })).toThrow(HTTPError[400]);
  });

  test('d. Error: MessageId is not in this topic', () => {
    expect(() => userPostUpdate(token1, topicId2, message1, { message: 'New message' })).toThrow(HTTPError[400]);
  })

  test('e. Error: Message is not sent by the correct sender', () => {
    expect(() => userPostUpdate(token2, topicId1, message1, { message: 'New message' })).toThrow(HTTPError[403]);
  })

  test('f. Success', () => {
    userPostUpdate(token2, topicId1, message1, { message: 'New message' });
    expect(userTopicInfo(token1, topicId1)).toStrictEqual({
      topicId: topicId1,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: [
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message1,
          message: 'New message',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message2,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message3,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message4,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message5,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'shadow',
          messageId: message6,
          message: 'This is his first second message.',
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
          username: 'faizarradhin',
          messageId: message1,
          message: 'New message',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message2,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message3,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message4,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message5,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'shadow',
          messageId: message6,
          message: 'This is his first second message.',
          timeSent: expect.any(Number)
        }
      ]
    });

    expect(userTopicInfo(token3, topicId1)).toStrictEqual({
      topicId: topicId1,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: [
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message1,
          message: 'New message',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message2,
          message: 'This is his first message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message3,
          message: 'This is my second message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Faiz Arradhin',
          username: 'faizarradhin',
          messageId: message4,
          message: 'This is my third message.',
          timeSent: expect.any(Number)
        },
        {
          me: false,
          sender: 'Shadow',
          username: 'shadowfaiz',
          messageId: message5,
          message: 'This is his second message.',
          timeSent: expect.any(Number)
        },
        {
          me: true,
          sender: 'Faiz Arradhin',
          username: 'shadow',
          messageId: message6,
          message: 'This is his first second message.',
          timeSent: expect.any(Number)
        }
      ]
    });
  });
});
