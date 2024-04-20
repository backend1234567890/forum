import {
    userAuthRegister,
    userTopicCreate,
    userTopicInfo,
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

    test.skip('c. Success creating topic', () => {
        const topicId = userTopicCreate(token, {
            title: 'How to do something?',
            description: 'Do not know what to explain'
        }).topicId;

        //waiting topicInfo
    })
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

    })

    test('b. Error: Invalid topicId', () => {
        
    })

    test('c. Success', () => {
        
    })
});