import {
    userAuthRegister,
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
        })
    });

    test.each([
        ["a. Error: username has space", "invalid space", 'Displayed Name', 'validPass123', 'validPass123'],
        ["b. Error: username contains non-alphanumeric character", "invalidCapital", 'Displayed Name', 'validPass123', 'validPass123'],
        ["c. Error: username has been used", "faizarradhin", 'Displayed Name', 'validPass123', 'validPass123'],
        ["d. Error: password too short", "validusername", "Displayed Name", 'Short12', 'short12'],
        ["e. Error: password does not contain 1 lowercase", "validusername", "Displayed Name", 'NO_LOWERCASE123', 'NO_LOWERCASE123'],
        ["f. Error: password does not contain 1 uppercase", "validusername", "Displayed Name", 'no_uppercase123', 'no_uppercase123'],
        ["g. Error: password does not contain 1 number", "validusername", "Displayed Name", 'no_number', 'no_number'],
        ["h. Error: wrong repeated password", "validusername", "Displayed Name", 'validPass123', 'validPass123'],
      ])('%s', (username, displayName, password, repeatPassword) => {
        expect(() => userAuthRegister({ username, displayName, password, repeatPassword })).toThrow(HTTPError[400]);
      });

    test.skip('i. Success registering', () => {
        //waiting for login function
    });
})