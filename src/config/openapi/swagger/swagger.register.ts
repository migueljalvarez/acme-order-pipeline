import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'Acme Order Pipeline API',
  description: 'API documentation for the Acme Order Pipeline',
  version: 'v1.0',
  envName: 'local',
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  tag: 'Acme Order Pipeline',
  path: 'api-docs',
}));
