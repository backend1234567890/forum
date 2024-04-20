import { getData, setData, getHash, getHashInteger } from './dataStore';
import HTTPError from 'http-errors';

export interface Token {
    token: string
}

export const userAuthRegister = (username: string, displayName: string, password: string, repeatPassword: string): Token => {
    const data = getData();
    
    if (username.length === 0 || displayName.length === 0) {
        throw HTTPError(400, "Username and displayName cannot be empty");
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        throw HTTPError(400, "Username can only contains alphanumeric characters");
    };

    if (data.users.some(u => u.username === username)) {
        throw HTTPError(400, "Username has been used")
    }

    if (password !== repeatPassword) {
        throw HTTPError(400, "Password does not match");
    }

    if (password.length < 8) {
        throw HTTPError(400, "Password is too short");
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
        throw HTTPError(400, "Password must contain at least 1 number, 1 lowercase, and 1 uppercase");
    }

    username = username.toLowerCase();
    password = getHash(password);
    const userId = getHashInteger(data.users.length, 2);

    let newToken = -1;
    if (data.tokens.length === 0) {
      newToken = 0;
    } else {
      newToken = data.tokens[data.tokens.length - 1].token + 1;
    }

    const token = getHashInteger(newToken, 4);

    data.users.push({
        userId,
        username,
        displayName,
        password
    })

    data.tokens.push({
        userId,
        token
    })

    setData(data);
    return {
        token: JSON.stringify(token)
    }
}

export const userAuthLogin = (username: string, password: string): Token => {
    return {
        token: 'token'
    }
}