import {
    userAuthRegister,
    userTopicCreate,
    userTopicInfo,
    userTopicList,
    clear
} from './testWrapper';

import HTTPError from 'http-errors';

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
    })

    test('b. Error: Inappropriate length of title', () => {
        expect(() => userTopicCreate(token, {
            title: 'dot',
            description: 'Do not know what to explain'
        })).toThrow(HTTPError[400]);

        expect(() => userTopicCreate(token, {
            title: 'dot'.repeat(17),
            description: 'Do not know what to explain'
        })).toThrow(HTTPError[400]);
    })

    test('c. Success creating topic', () => {
        const topicId = userTopicCreate(token, {
            title: 'How to do something?',
            description: 'Do not know what to explain'
        }).topicId;

        expect(userTopicInfo(token, topicId)).toStrictEqual({
            topicId: topicId,
            title: "How to do something?",
            description: "Do not know what to explain",
            messages: []
        });
    })
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
    })

    test('b. Error: Invalid topicId', () => {
        expect(() => userTopicInfo(token, topicId + 1)).toThrow(HTTPError[400]);
    })

    test('c. Success', () => {
        expect(userTopicInfo(token, topicId)).toStrictEqual({
            topicId: topicId,
            title: "How to do something?",
            description: "Do not know what to explain",
            messages: []
        });
    })

    test.todo('d. check with message');
});

describe('3. userTopicList()', () => {
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
        expect(() => userTopicList(JSON.stringify(JSON.parse(token) + 1))).toThrow(HTTPError[401]);
    })

    test('b. Success', () => {
        expect(userTopicList(token)).toStrictEqual({
            topics: [
                {
                    topicId: topicId3,
                    title: "Now what?",
                    lastMessage: {
                      me: true,
                      sender: "",
                      message: ""
                    }
                },
                {
                    topicId: topicId2,
                    title: "Who am I?",
                    lastMessage: {
                      me: true,
                      sender: "",
                      message: ""
                    }
                },
                {
                    topicId: topicId1,
                    title: "How to do something?",
                    lastMessage: {
                      me: true,
                      sender: "",
                      message: ""
                    }
                }
            ]
        })
    })

    test.todo('c. Check with message');
});