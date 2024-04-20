import { getData, setData, getHash, getHashInteger, EmptyObject } from './dataStore';
import { loggedinId } from './auth';
import HTTPError from 'http-errors';

export interface TopicId {
    topicId: string;
}

export const userTopicCreate = (token: string, title: string, description: string): TopicId => {
    return {
        topicId: ""
    }
}