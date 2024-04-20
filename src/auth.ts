import { getData, setData, getHash, getHashInteger, EmptyObject } from './dataStore';
import HTTPError from 'http-errors';

export interface Token {
    token: string
}

export interface Username {
    username: string
}

export interface Profile {
  username: string;
  displayName: string;
}

export const loggedinId = (token: string): Username => {
  const data = getData();

  const user = data.tokens.find(u => u.token === JSON.parse(token));
  if (!user) {
    throw HTTPError(401, 'Invalid token');
  }

  return { username: user.username };
};

export const userAuthRegister = (username: string, displayName: string, password: string, repeatPassword: string): Token => {
  const data = getData();

  if (username.length === 0 || displayName.length === 0) {
    throw HTTPError(400, 'Username and displayName cannot be empty');
  }

  if (!/^[a-z0-9]+$/.test(username)) {
    throw HTTPError(400, 'Username can only contains lowercase alphanumeric characters');
  }

  if (data.users.some(u => u.username === username)) {
    throw HTTPError(400, 'Username has been used');
  }

  if (password !== repeatPassword) {
    throw HTTPError(400, 'Password does not match');
  }

  if (password.length < 8) {
    throw HTTPError(400, 'Password is too short');
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
    throw HTTPError(400, 'Password must contain at least 1 number, 1 lowercase, and 1 uppercase');
  }

  let newToken = -1;
  if (data.tokens.length === 0) {
    newToken = 0;
  } else {
    newToken = data.tokens[data.tokens.length - 1].token + 1;
  }

  const token = getHashInteger(newToken, 4);

  data.users.push({
    username,
    displayName,
    password: getHash(password)
  });

  data.tokens.push({
    username,
    token
  });

  setData(data);
  return {
    token: JSON.stringify(token)
  };
};

export const userAuthLogin = (username: string, password: string): Token => {
  const data = getData();

  const user = data.users.find(u => u.username === username && u.password === getHash(password));
  if (!user) {
    throw HTTPError(400, 'incorrect username or password');
  }

  if (data.tokens.some(t => t.username === username)) {
    throw HTTPError(400, 'Already logged in');
  }

  let newToken = -1;
  if (data.tokens.length === 0) {
    newToken = 0;
  } else {
    newToken = data.tokens[data.tokens.length - 1].token + 1;
  }

  const token = getHashInteger(newToken, 4);
  data.tokens.push({
    username,
    token
  });

  setData(data);
  return {
    token: JSON.stringify(token)
  };
};

export const userAuthLogout = (token: string): EmptyObject => {
  const data = getData();
  loggedinId(token);

  data.tokens = data.tokens.filter(t => t.token !== JSON.parse(token));
  setData(data);
  return {};
};

export const userAuthProfile = (token: string): Profile => {
  const data = getData();
  const user = loggedinId(token);
  const username = user.username;
  const displayName = data.users.find(u => u.username === username).displayName;

  return {
    displayName,
    username
  };
};

export const userAuthEdit = (token: string, displayName: string): EmptyObject => {
  const data = getData();
  loggedinId(token);

  if (displayName === '') {
    throw HTTPError(400, 'displayName cannot be empty');
  }

  const selectedUser = data.users.find(u => u.username);
  selectedUser.displayName = displayName;

  setData(data);
  return {};
};
