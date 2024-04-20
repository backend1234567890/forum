import { getData, setData, getHash, getHashInteger, EmptyObject } from './dataStore';
import { loggedinId } from './auth';
import HTTPError from 'http-errors';

export interface TopicId {
    topicId: number;
}

export interface MessageInfo {
    me: boolean;
    sender: string;
    messageId: number;
    message: string;
    timeSent: number;
}

export interface TopicInfo {
    topicId: number;
    title: string;
    description: string;
    messages: MessageInfo[];
}

export interface BriefMessage {
    me: boolean;
    sender: string;
    message: string;
}

export interface Topics {
    topicId: number;
    title: string;
    lastMessage: BriefMessage;
}

export interface TopicList {
    topics: Topics[];
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

export const userTopicInfo = (token: string, topicId: number): TopicInfo => {
    const data = getData();
    const user = loggedinId(token);

    const topic = data.topics.find(top => top.topicId === topicId);
    if (!topic) {
        throw HTTPError(400, "Invalid topicId");
    }

    const selectedMessages = data.messages.filter(mes => mes.topicId === topicId);
    const messages = selectedMessages.map(obj => {
        let bool: boolean;
        if (obj.sender === user.username) {
            bool = true;
        } else {
            bool = false;
        }
        return { ...obj, me: bool};
    });

    return {
        topicId,
        title: topic.title,
        description: topic.description,
        messages
    }
}

export const userTopicList = (token: string): TopicList => {
    return {
        topics: [
          {
            topicId: 1234567,
            title: "Topic Title",
            lastMessage: {
              me: true,
              sender: "Faiz Arradhin",
              message: "This is an example of a message"
            }
          }
        ]
    }
}