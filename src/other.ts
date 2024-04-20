import { getData, setData, EmptyObject } from './dataStore'

export const clear = (): EmptyObject => {
    const data = getData();
    data.users.length = 0;
    data.tokens.length = 0;
    data.topics.length = 0;
    data.messages.length = 0;
    setData(data);
    return {};
}