import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { port, url } from './config.json';

const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

// Root URL
app.get('/', (req: Request, res: Response) => {
  console.log('Print to terminal: someone accessed our root url!');
  res.status(200).json({ message: 'Hello darkness my old friend!' });
});

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED BELOW THIS DIVIDER
// ========================================================================= //



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
  
  /**
   * Start server
   */
  const server = app.listen(PORT, HOST, () => {
    console.log(`Express Server started and awaiting requests at the URL: '${url}:${PORT}'`);
  });
  
  /**
   * Handle Ctrl+C gracefully
   */
  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Shutting down server gracefully.');
      process.exit();
    });
  });
  