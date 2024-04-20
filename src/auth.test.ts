import {
  userAuthRegister,
  userAuthLogin,
  userAuthLogout,
  clear,
  userAuthProfile
} from './testWrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  clear();
});

describe('1. userAuthRegister()', () => {
  beforeEach(() => {
    userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    });
  });

  test.each([
    ['a. Error: username has space', 'invalid space', 'Displayed Name', 'validPass123', 'validPass123'],
    ['b. Error: username contains non-alphanumeric character', 'invalid#symbol', 'Displayed Name', 'validPass123', 'validPass123'],
    ['c. Error: username contains capital letter', 'invalidCapital', 'Displayed Name', 'validPass123', 'validPass123'],
    ['d. Error: username has been used', 'faizarradhin', 'Displayed Name', 'validPass123', 'validPass123'],
    ['e. Error: password too short', 'validusername', 'Displayed Name', 'Short12', 'short12'],
    ['f. Error: password does not contain 1 lowercase', 'validusername', 'Displayed Name', 'NO_LOWERCASE123', 'NO_LOWERCASE123'],
    ['g. Error: password does not contain 1 uppercase', 'validusername', 'Displayed Name', 'no_uppercase123', 'no_uppercase123'],
    ['h. Error: password does not contain 1 number', 'validusername', 'Displayed Name', 'no_number', 'no_number'],
    ['i. Error: wrong repeated password', 'validusername', 'Displayed Name', 'validPass123', 'validPass123'],
  ])('%s', (username, displayName, password, repeatPassword) => {
    expect(() => userAuthRegister({ username, displayName, password, repeatPassword })).toThrow(HTTPError[400]);
  });

  test('j. Success registering', () => {
    const user = userAuthRegister({
      username: 'faizarradhinnew',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    });
    expect(user).toStrictEqual({ token: expect.any(String) });
    userAuthLogout(user.token);
    expect(() => userAuthLogin({
      username: 'faizarradhinnew',
      password: 'KuCintaKau4Ever'
    })).not.toThrow(HTTPError[400]);
  });
});

describe('2. userAuthLogin()', () => {
  beforeEach(() => {
    const token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;

    userAuthLogout(token);
  });

  test('a. Error: Wrong username or password', () => {
    expect(() => userAuthLogin({
      username: 'faizarradhin',
      password: 'lupaPassword123'
    })).toThrow(HTTPError[400]);

    expect(() => userAuthLogin({
      username: 'whoisthis',
      password: 'KuCintaKau4Ever'
    })).toThrow(HTTPError[400]);
  });

  test('b. Error: Already logged in', () => {
    userAuthLogin({
      username: 'faizarradhin',
      password: 'KuCintaKau4Ever'
    });
    expect(() => userAuthLogin({
      username: 'faizarradhin',
      password: 'KuCintaKau4Ever'
    })).toThrow(HTTPError[400]);
  });

  test('c. Success login', () => {
    expect(userAuthLogin({
      username: 'faizarradhin',
      password: 'KuCintaKau4Ever'
    })).toStrictEqual({ token: expect.any(String) });
  });
});

describe('3. userAuthLogout()', () => {
  let token: string;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userAuthLogout(JSON.stringify(JSON.parse(token) + 1))).toThrow(HTTPError[401]);
  });

  test('b. Success logout', () => {
    expect(userAuthLogout(token)).toStrictEqual({});
    expect(() => userAuthLogin({
      username: 'faizarradhin',
      password: 'KuCintaKau4Ever'
    })).not.toThrow(HTTPError[400]);
  });
});

describe('4. userAuthProfile()', () => {
  let token: string;

  beforeEach(() => {
    token = userAuthRegister({
      username: 'faizarradhin',
      displayName: 'Faiz Arradhin',
      password: 'KuCintaKau4Ever',
      repeatPassword: 'KuCintaKau4Ever'
    }).token;
  });

  test('a. Error: Invalid token', () => {
    expect(() => userAuthProfile(JSON.stringify(JSON.parse(token) + 1))).toThrow(HTTPError[401]);
  });

  test('b. Success', () => {
    expect(userAuthProfile(token)).toStrictEqual({
      username: "faizarradhin",
      displayName: "Faiz Arradhin"
    });
  });
});
