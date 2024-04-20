import fs from 'fs';
export type EmptyObject = Record<never, never>;

export interface Users {
    username: string;
    displayName: string;
    password: string;
}

export interface Tokens {
    token: string;
    userId: number;
}

export interface Topics {
    topicId: number;
    title: string;
    description: string;
    pin: boolean;
}

export interface Messages {
    messageId: number;
    topicId: number;
    sender: number;
    timeSent: number;
}

export interface DataStore {
    users: Users[];
    tokens: Tokens[];
    topics: Topics[];
    messages: Messages[];
}

let data: DataStore = {
    users: [],
    tokens: [],
    topics: [],
    messages: []
};

const save = () => {
    fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
};

export const getData = (): DataStore => {
    if (fs.existsSync('./database.json')) {
      const json = fs.readFileSync('./database.json', { encoding: 'utf8' });
      data = JSON.parse(json);
    }
    return data;
};
  
  // Use set(newData) to pass in the entire data object, with modifications made
  export const setData = (newData: DataStore): void => {
    data = newData;
    save();
};