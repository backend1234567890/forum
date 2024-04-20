import fs from 'fs';
import crypto from 'crypto';
export type EmptyObject = Record<never, never>;

const SECRET_TEXT = 'JanganTinggalkanAkuSendiri';

export const getHash = (plainText: string) => {
  return crypto.createHash('sha256').update(plainText + SECRET_TEXT).digest('hex');
};

export const randomizer = () => {
  return Math.floor(Math.random() * (100)) + 1;
};

export const SECRET_INT = randomizer();

export const getHashInteger = (integerValue: number, multipliers: number, range = 1000000000) => {
  const hash = crypto.createHash('sha256')
    .update(String(integerValue * multipliers) + SECRET_TEXT + SECRET_INT)
    .digest('hex');

  // Use the first 8 characters (4 bytes) of the hash as an integer
  const hashedInt = parseInt(hash.slice(0, 8), 16);

  // Map the hashed integer to the desired range
  const mappedInt = Math.floor((hashedInt / (2 ** 32)) * range);

  return mappedInt;
};

export interface Users {
    username: string;
    displayName: string;
    password: string;
}

export interface Tokens {
    token: number;
    username: string;
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
    username: string;
    sender: string;
    timeSent: number;
    message: string;
}

export interface DataStore {
    users: Users[];
    tokens: Tokens[];
    topics: Topics[];
    messages: Messages[];
}


import request, { HttpVerb } from 'sync-request';
// Open submission.ts and update DEPLOYED_URL
export const DEPLOYED_URL = "https://faizarradhin-forum1203.vercel.app/";

const requestHelper = (method: HttpVerb, path: string, payload: object) => {
  let json = {};
  let qs = {};
  if (['POST', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    json = payload;
  }

  const res = request(method, DEPLOYED_URL + path, { qs, json, timeout: 20000 });
  return JSON.parse(res.body.toString());
};

export const getData = (): DataStore => {
  try {
    const res = requestHelper('GET', '/data', {});
    return res.data;
  } catch (e) {
    return {
      users: [],
      tokens: [],
      topics: [],
      messages: []
    };
  }
};

export const setData = (newData: DataStore) => {
  requestHelper('PUT', '/data', { data: newData });
};


let data: DataStore = {
  users: [],
  tokens: [],
  topics: [],
  messages: [],
};

const save = () => {
  fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
};

// export const getData = (): DataStore => {
//   if (fs.existsSync('./database.json')) {
//     const json = fs.readFileSync('./database.json', { encoding: 'utf8' });
//     data = JSON.parse(json);
//   }
//   return data;
// };

// // Use set(newData) to pass in the entire data object, with modifications made
// export const setData = (newData: DataStore): void => {
//   data = newData;
//   save();
// };
