import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config.json';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

import { clear } from './other';
import {
  userAuthRegister,
  userAuthLogin,
  userAuthLogout,
  userAuthProfile,
  userAuthEdit
} from './auth';
import {
  userTopicCreate,
  userTopicInfo,
  userTopicList,
  userTopicDelete,
  userTopicPin,
  userTopicUpdate
} from './topic';
import { userPost, userPostDelete, userPostUpdate } from './message';

import { createClient } from '@vercel/kv';
import { DEPLOYED_URL } from './dataStore';

// Replace this with your API_URL
// E.g. https://large-poodle-44208.kv.vercel-storage.com
const KV_REST_API_URL="https://viable-pangolin-51033.upstash.io";
// Replace this with your API_TOKEN
// E.g. AaywASQgOWE4MTVkN2UtODZh...
const KV_REST_API_TOKEN="AcdZASQgNDgxOTZkMzYtY2M4Zi00ZTY2LWIwNTQtYmI4ZWM5N2Q5NjI4ODM4ZDZkNzE3MDdhNGIwMDgxNmY5OWY4OWZjNzgwNGY=";

const database = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});


const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = DEPLOYED_URL;
//const HOST: string = process.env.IP || '127.0.0.1'

const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  //res.json({message: "Someone is accessing our URL 👀"});
  res.sendFile(path.join(__dirname, '../login.html'));
});

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

app.get('/forum', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../forum.html'));
});

app.get('/error', (req: Request, res: Response) => {
  const errorCode = req.params.errorcode as string;
  res.sendFile(path.join(__dirname, '../error.html'));
});

app.get('/editicon', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../edit.png'));
});
// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED BELOW THIS DIVIDER
// ========================================================================= //

app.get('/data', async (req: Request, res: Response) => {
  const data = await database.hgetall("data:name");
  res.status(200).json(data);
});

app.put('/data', async (req: Request, res: Response) => {
  const { data } = req.body;
  await database.hset("data:name", { data });
  return res.status(200).json({});
});


app.delete('/clear', (req: Request, res: Response) => {
  const response = clear();

  res.json(response);
});

app.post('/user/auth/register', (req: Request, res: Response) => {
  const { username, displayName, password, repeatPassword } = req.body;
  const response = userAuthRegister(username, displayName, password, repeatPassword);

  res.json(response);
});

app.post('/user/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const response = userAuthLogin(username, password);

  res.json(response);
});

app.post('/user/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = userAuthLogout(token);

  res.json(response);
});

app.post('/user/topic/create', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { title, description } = req.body;
  const response = userTopicCreate(token, title, description);

  res.json(response);
});

app.get('/user/topic/:topicid/info', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const response = userTopicInfo(token, JSON.parse(topicId));

  res.json(response);
});

app.get('/user/topic/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = userTopicList(token);

  res.json(response);
});

app.delete('/user/topic/:topicid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const response = userTopicDelete(token, JSON.parse(topicId));

  res.json(response);
});

app.put('/user/topic/:topicid/pin', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const response = userTopicPin(token, JSON.parse(topicId));

  res.json(response);
});

app.put('/user/topic/:topicid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const { title, description } = req.body;
  const response = userTopicUpdate(token, JSON.parse(topicId), title, description);

  res.json(response);
});

app.post('/user/topic/:topicid/message', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const { message } = req.body;
  const response = userPost(token, JSON.parse(topicId), message);

  res.json(response);
});

app.put('/user/topic/:topicid/message/:messageid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const messageId = req.params.messageid as string;
  const { message } = req.body;
  const response = userPostUpdate(token, JSON.parse(topicId), JSON.parse(messageId), message);

  res.json(response);
});

app.delete('/user/topic/:topicid/message/:messageid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const topicId = req.params.topicid as string;
  const messageId = req.params.messageid as string;
  const response = userPostDelete(token, JSON.parse(topicId), JSON.parse(messageId));

  res.json(response);
});

app.get('/user/auth/profile', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = userAuthProfile(token);

  res.json(response);
});

app.put('/user/auth/profile', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { displayName } = req.body;
  const response = userAuthEdit(token, displayName);

  res.json(response);
});

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED ABOVE THIS DIVIDER
// ========================================================================= //

/*
 * 404 Not Found Middleware
 *
 * This should be put at the very end (after all your routes are defined),
 * although still above errorHandlers (if any) and app.listen().
 */
app.use((req: Request, res: Response) => {
  const error = `
      404 Not found - This could be because:
        0. You have defined routes below (not above) this middleware in server.ts
        1. You have not implemented the route ${req.method} ${req.path}
        2. There is a typo in either your test or server, e.g. /posts/list in one
           and, incorrectly, /post/list in the other
        3. You are using ts-node (instead of ts-node-dev) to start your server and
           have forgotten to manually restart to load the new changes
        4. You've forgotten a leading slash (/), e.g. you have posts/list instead
           of /posts/list in your server.ts or test file
    `;
  res.status(404).json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
