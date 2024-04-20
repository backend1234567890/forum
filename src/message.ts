import { getData, setData, getHash, getHashInteger, EmptyObject } from './dataStore';
import { loggedinId } from './auth';
import HTTPError from 'http-errors';

export interface Message{
    messageId: number
}

export const userPost = (token: string, topicId: number, message: string): Message => {
    return {
        messageId: 123
    }
}