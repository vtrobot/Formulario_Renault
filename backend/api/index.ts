import app from '../src/app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await app.ready();
  app.server.emit('request', req, res);
}
