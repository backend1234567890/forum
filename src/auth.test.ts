import {
    userAuthRegister,
    userAuthLogin,
    clear
} from './testWrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
    clear();
});

describe('1. userAuthRegister()', () => {
    beforeEach(() => {
        userAuthRegister({
            username: "faizarradhin",
            displayName: 'Faiz Arradhin',
            password: 'KuCintaKau4Ever',
            repeatPassword: 'KuCintaKau4Ever'
        });
    });

    test.each([
        ["a. Error: username has space", "invalid space", 'Displayed Name', 'validPass123', 'validPass123'],
        ["b. Error: username contains non-alphanumeric character", "invalid#symbol", 'Displayed Name', 'validPass123', 'validPass123'],
        ["c. Error: username contains capital letter", "invalidCapital", 'Displayed Name', 'validPass123', 'validPass123'],
        ["d. Error: username has been used", "faizarradhin", 'Displayed Name', 'validPass123', 'validPass123'],
        ["e. Error: password too short", "validusername", "Displayed Name", 'Short12', 'short12'],
        ["f. Error: password does not contain 1 lowercase", "validusername", "Displayed Name", 'NO_LOWERCASE123', 'NO_LOWERCASE123'],
        ["g. Error: password does not contain 1 uppercase", "validusername", "Displayed Name", 'no_uppercase123', 'no_uppercase123'],
        ["h. Error: password does not contain 1 number", "validusername", "Displayed Name", 'no_number', 'no_number'],
        ["i. Error: wrong repeated password", "validusername", "Displayed Name", 'validPass123', 'validPass123'],
      ])('%s', (username, displayName, password, repeatPassword) => {
        expect(() => userAuthRegister({ username, displayName, password, repeatPassword })).toThrow(HTTPError[400]);
      });

    test.skip('j. Success registering', () => {
        //waiting for login function
    });
});

describe.skip('2. userAuthLogin()', () => {
    beforeEach(() => {
        userAuthRegister({
            username: "faizarradhin",
            displayName: 'Faiz Arradhin',
            password: 'KuCintaKau4Ever',
            repeatPassword: 'KuCintaKau4Ever'
        });
        
        //waiting for logout function
    });

    test('a. Error: Wrong username or password', () => {
        expect(() => userAuthLogin({
            username: "faizarradhin",
            password: "lupaPassword123"
        })).toThrow(HTTPError[400]);

        expect(() => userAuthLogin({
            username: "whoisthis",
            password: "KuCintaKau4Ever"
        })).toThrow(HTTPError[400]);
    });

    test('b. Error: Already logged in', () => {
        userAuthLogin({
            username: "faizarradhin",
            password: "KuCintaKau4Ever"
        })
        expect(() => userAuthLogin({
            username: "faizarradhin",
            password: "KuCintaKau4Ever"
        })).toThrow(HTTPError[400]);
    });

    test('c. Success login', () => {
        expect(userAuthLogin({
            username: "faizarradhin",
            password: "KuCintaKau4Ever"
        }).body).toStrictEqual({ token: expect.any(String) })
    })
});