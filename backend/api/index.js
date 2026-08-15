import serverless from 'serverless-http';
import dotenv from 'dotenv';
import app from '../app.js';

dotenv.config();

export const handler = serverless(app);
