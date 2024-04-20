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
    const data = getData();
    const user = loggedinId(token);

    const topics = data.topics.filter(topic => topic.pin === false).map(topic => {
        if (data.messages.filter(mes => mes.topicId === topic.topicId)) {
            return {
                topicId: topic.topicId,
                title: topic.title,
                lastMessage: {
                    me: true,
                    sender: '',
                    message: ''
                }
            }
        }
        const selectedMessage = (data.messages.sort((a, b) => b.timeSent - a.timeSent))[0];

        const { sender, message } = selectedMessage;
        let me: boolean;
        if (selectedMessage.sender === user.username) {
            me = true;
        } else {
            me = false;
        }
        return {
            topicId: topic.topicId,
            title: topic.title,
            lastMessage: {
                me,
                sender,
                message
            }
        }
    }).reverse();

    const pinnedTopics = data.topics.filter(topic => topic.pin === true).map(topic => {
        if (data.messages.filter(mes => mes.topicId === topic.topicId)) {
            return {
                topicId: topic.topicId,
                title: topic.title,
                lastMessage: {
                    me: true,
                    sender: '',
                    message: ''
                }
            }
        }
        const selectedMessage = (data.messages.sort((a, b) => b.timeSent - a.timeSent))[0];

        const { sender, message } = selectedMessage;
        let me: boolean;
        if (selectedMessage.sender === user.username) {
            me = true;
        } else {
            me = false;
        }
        return {
            topicId: topic.topicId,
            title: topic.title,
            lastMessage: {
                me,
                sender,
                message
            }
        }
    }).reverse();

    return {
        topics: [...pinnedTopics, ...topics]
    };
}

export const userTopicDelete = (token: string, topicId: number): EmptyObject => {
    const data = getData();
    loggedinId(token);

    const topic = data.topics.find(top => top.topicId === topicId);
    if (!topic) {
        throw HTTPError(400, "Topic Id is not valid");
    }

    data.topics = data.topics.filter(top => top.topicId !== topicId);
    data.messages = data.messages.filter(mes => mes.topicId !== topicId);
    
    setData(data);
    return {};
}

export const userTopicPin = (token: string, topicId: number): EmptyObject => {
    const data = getData();
    loggedinId(token);

    const topic = data.topics.find(top => top.topicId === topicId);
    if (!topic) {
        throw HTTPError(400, "Topic Id is not valid");
    }

    if (data.topics.filter(top => top.pin === true).length === 3) {
        throw HTTPError(400, "Can only pin 3 topics");
    }

    topic.pin = !topic.pin

    setData(data);
    return {};
}

export const userTopicUpdate = (token: string, topicId: number, title: string, description: string): EmptyObject => {
    return {}
}