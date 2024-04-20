import request from 'sync-request-curl';
import config from './config.json';
import HTTPError from 'http-errors';

const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

const throwingError = (statusCode: number, message: string | Buffer) => {
  const errorMessage = JSON.parse(message.toString());
  switch (statusCode) {
    case 400:
    case 401:
    case 403:
      throw HTTPError(statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(statusCode, 'Cannot find. Hint: Check that your server.ts have the correct path AND method');
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (statusCode !== 200) {
        throw HTTPError(statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${statusCode} online!\n`);
      }
  }
};

interface Register {
  username: string;
  displayName: string;
  password: string;
  repeatPassword: string;
}

interface Login {
  username: string;
  password: string;
}

interface Topic {
  title: string;
  description: string
}

export const clear = () => {
  const res = request(
    'DELETE',
    SERVER_URL + '/clear',
    {
      qs: { }
    }
  );
  return JSON.parse(res.body.toString());
};

export const userAuthRegister = (message: Register) => {
  const res = request(
    'POST',
    SERVER_URL + '/user/auth/register',
    {
      json: message
    }
  );

  throwingError(res.statusCode, res.body.toString());
  return JSON.parse(res.body.toString());
};

export const userAuthLogin = (message: Login) => {
  const res = request(
    'POST',
    SERVER_URL + '/user/auth/login',
    {
      json: message
    }
  );

  throwingError(res.statusCode, res.body.toString());
  return JSON.parse(res.body.toString());
};

export const userAuthLogout = (token: string) => {
  const res = request(
    'POST',
    SERVER_URL + '/user/auth/logout',
    {
      headers: { token }
    }
  );

  throwingError(res.statusCode, res.body.toString());
  return JSON.parse(res.body.toString());
};

export const userTopicCreate = (token: string, message: Topic) => {
  const res = request(
    'POST',
    SERVER_URL + '/user/topic/create',
    {
      headers: { token },
      json: message
    }
  );

  throwingError(res.statusCode, res.body.toString());
  return JSON.parse(res.body.toString());
}