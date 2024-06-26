import {
  userAuthRegister,
  userTopicCreate,
  userTopicInfo,
  userTopicList,
  userTopicDelete,
  userTopicPin,
  userPost,
  clear,
  userTopicUpdate
} from './testWrapper';

import HTTPError from 'http-errors';

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

beforeEach(() => {
  clear();
});

describe('1. userTopicCreate()', () => {
  let token: string;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userTopicCreate(token + 100, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    })).toThrow(HTTPError[401]);
  });

  test('b. Error: Inappropriate length of title', () => {
    expect(() => userTopicCreate(token, {
      title: 'dot',
      description: 'Do not know what to explain'
    })).toThrow(HTTPError[400]);

    expect(() => userTopicCreate(token, {
      title: 'dot'.repeat(17),
      description: 'Do not know what to explain'
    })).toThrow(HTTPError[400]);
  });

  test('c. Success creating topic', () => {
    const topicId = userTopicCreate(token, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;

    expect(userTopicInfo(token, topicId)).toStrictEqual({
      topicId: topicId,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: []
    });
  });
});

describe('2. userTopicInfo()', () => {
  let token: string;
  let topicId: number;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    topicId = userTopicCreate(token, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userTopicInfo(JSON.stringify(JSON.parse(token) + 1), topicId)).toThrow(HTTPError[401]);
  });

  test('b. Error: Invalid topicId', () => {
    expect(() => userTopicInfo(token, topicId + 1)).toThrow(HTTPError[400]);
  });

  test('c. Success', () => {
    expect(userTopicInfo(token, topicId)).toStrictEqual({
      topicId: topicId,
      title: 'How to do something?',
      description: 'Do not know what to explain',
      messages: []
    });
  });
});

describe('3. userTopicList()', () => {
  let token: string;
  let token2: string;
  let token3: string;
  let topicId1: number;
  let topicId2: number;
  let topicId3: number;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    token2 = userAuthRegister({
      username: 'shadowfaiz',
      displayName: 'Shadow',
      password: 'KuTakMauKehilanganmuKe2KaliNya',
      repeatPassword: 'KuTakMauKehilanganmuKe2KaliNya'
    }).token;

    token3 = userAuthRegister({
      username: 'shadowshadow',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    topicId1 = userTopicCreate(token, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;

    topicId2 = userTopicCreate(token, {
      title: 'Who am I?',
      description: 'No one knows'
    }).topicId;

    topicId3 = userTopicCreate(token, {
      title: 'Now what?',
      description: ''
    }).topicId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userTopicList(JSON.stringify(JSON.parse(token) + 1))).toThrow(HTTPError[401]);
  });

  test('b. Success', () => {
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
  });

  test('c. Check with message', () => {
    userPost(token, topicId2, { message: 'This is my first message.' });
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Faiz Arradhin',
            message: 'This is my first message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is my first message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    sleepSync(1 * 1000);
    userPost(token2, topicId2, { message: 'This is his first message.' });
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Shadow',
            message: 'This is his first message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Shadow',
            message: 'This is his first message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });

    expect(userTopicPin(token, topicId2)).toStrictEqual({});
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Shadow',
            message: 'This is his first message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Shadow',
            message: 'This is his first message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });

    sleepSync(1 * 1000);
    userPost(token, topicId2, { message: 'This is my second message.' });
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Faiz Arradhin',
            message: 'This is my second message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is my second message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });

    expect(userTopicPin(token, topicId2)).toStrictEqual({});
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Faiz Arradhin',
            message: 'This is my second message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is my second message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });

    sleepSync(1 * 1000);
    userPost(token3, topicId2, { message: 'This is his first second message.' });
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is his first second message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is his first second message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token3)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Faiz Arradhin',
            message: 'This is his first second message.'
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicPin(token, topicId2)).toStrictEqual({});
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is his first second message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token2)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: false,
            sender: 'Faiz Arradhin',
            message: 'This is his first second message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
    expect(userTopicList(token3)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: 'Faiz Arradhin',
            message: 'This is his first second message.'
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
  });
});

describe('4. userTopicDelete()', () => {
  let token: string;
  let topicId1: number;
  let topicId2: number;
  let topicId3: number;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    topicId1 = userTopicCreate(token, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;

    topicId2 = userTopicCreate(token, {
      title: 'Who am I?',
      description: 'No one knows'
    }).topicId;

    topicId3 = userTopicCreate(token, {
      title: 'Now what?',
      description: ''
    }).topicId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userTopicDelete(JSON.stringify(JSON.parse(token) + 1), topicId1)).toThrow(HTTPError[401]);
  });

  test('b. Error: Invalid topicId', () => {
    expect(() => userTopicDelete(token, topicId1 + 3)).toThrow(HTTPError[400]);
  });

  test('c. Success', () => {
    expect(userTopicDelete(token, topicId2)).toStrictEqual({});
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
  });
});

describe('5. userTopicPin()', () => {
  let token: string;
  let topicId1: number;
  let topicId2: number;
  let topicId3: number;
  let topicId4: number;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    topicId1 = userTopicCreate(token, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;

    topicId2 = userTopicCreate(token, {
      title: 'Who am I?',
      description: 'No one knows'
    }).topicId;

    topicId3 = userTopicCreate(token, {
      title: 'Now what?',
      description: ''
    }).topicId;

    topicId4 = userTopicCreate(token, {
      title: 'Again?',
      description: ''
    }).topicId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userTopicPin(JSON.stringify(JSON.parse(token) + 1), topicId1)).toThrow(HTTPError[401]);
  });

  test('b. Error: Invalid topicId', () => {
    expect(() => userTopicPin(token, topicId1 + 3)).toThrow(HTTPError[400]);
  });

  test('c. Error: Already pinned 3 topics', () => {
    userTopicPin(token, topicId1);
    userTopicPin(token, topicId2);
    userTopicPin(token, topicId3);
    expect(() => userTopicPin(token, topicId4)).toThrow(HTTPError[400]);
  });

  test('d. Successful', () => {
    expect(userTopicPin(token, topicId2)).toStrictEqual({});
    expect(userTopicList(token)).toStrictEqual({
      topics: [
        {
          topicId: topicId2,
          title: 'Who am I?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId4,
          title: 'Again?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId3,
          title: 'Now what?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        },
        {
          topicId: topicId1,
          title: 'How to do something?',
          lastMessage: {
            me: true,
            sender: '',
            message: ''
          }
        }
      ]
    });
  });
});

describe('6. userTopicUpdate()', () => {
  let token: string;
  let topicId: number;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    topicId = userTopicCreate(token, {
      title: 'How to do something?',
      description: 'Do not know what to explain'
    }).topicId;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userTopicUpdate(JSON.stringify(JSON.parse(token) + 1), topicId, {
      title: 'New Title',
      description: 'New Description'
    })).toThrow(HTTPError[401]);
  });

  test('b. Error: Invalid topicId', () => {
    expect(() => userTopicUpdate(token, topicId + 1, {
      title: 'New Title',
      description: 'New Description'
    })).toThrow(HTTPError[400]);
  });

  test('c. Error: Inappropriate length of title', () => {
    expect(() => userTopicCreate(token, {
      title: 'new',
      description: ''
    })).toThrow(HTTPError[400]);

    expect(() => userTopicCreate(token, {
      title: 'new'.repeat(17),
      description: 'hahahhaa'
    })).toThrow(HTTPError[400]);
  });

  test('d. Success', () => {
    expect(userTopicUpdate(token, topicId, {
      title: 'New Title',
      description: 'New Description'
    })).toStrictEqual({});

    expect(userTopicInfo(token, topicId)).toStrictEqual({
      topicId: topicId,
      title: 'New Title',
      description: 'New Description',
      messages: []
    });
  });
});
