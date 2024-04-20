import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

export interface Token {
    token: string
}

export const userAuthRegister = (username: string, displayName: string, password: string, repeatPassword: string): Token => {
    return {
        token: 'token'
    }
}