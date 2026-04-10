import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth';
import packagesRoute from './routes/packages';
import blog from './routes/blog';
import data from './routes/data';
import testimonialsRoute from './routes/testimonials';

const app = new Hono().basePath('/api');

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.route('/auth', auth);
app.route('/packages', packagesRoute);
app.route('/testimonials', testimonialsRoute);
app.route('/blog', blog);
app.route('/', data);

serve({ fetch: app.fetch, port: 8080 }, () => {
  console.log('API server running on http://localhost:8080');
});
