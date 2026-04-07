import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth';
import packagesRoute from './routes/packages';
import blog from './routes/blog';
import data from './routes/data';

const app = new Hono().basePath('/api');

app.onError((err, c) => {
  console.error('[unhandled]', err);
  return c.json({ error: 'Internal server error' }, 500);
});

app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'https://prostanone-premium-prostate-health.vercel.app',
    credentials: true,
  }),
);

app.route('/auth', auth);
app.route('/packages', packagesRoute);
app.route('/blog', blog);
app.route('/', data);

const port = Number(process.env.PORT) || 8080;
serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on port ${port}`);
});
