import { getData, setData, getHash, getHashInteger, EmptyObject } from './dataStore';
import { loggedinId } from './auth';
import HTTPError from 'http-errors';

export interface TopicId {
    topicId: number;
}

export const userTopicCreate = (token: string, title: string, description: string): TopicId => {
    const data = getData();
    loggedinId(token).username;

    if (title.length < 5 || title.length > 50) {
        throw HTTPError(400, "Title must be between 5 and 50 long");
    }

    const topicId = getHashInteger(data.topics.length, 9);

    data.topics.push({
        topicId,
        title,
        description,
        pin: false
    })

    setData(data);
    return {
        topicId
    }
}