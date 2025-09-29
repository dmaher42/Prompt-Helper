import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from './env.js';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true
          }
        }
});

export const httpLogger = pinoHttp({
  logger,
  customSuccessMessage: function () {
    return 'request completed';
  },
  customErrorMessage: function () {
    return 'request errored';
  },
  customAttributeKeys: {
    reqId: 'requestId'
  }
});
