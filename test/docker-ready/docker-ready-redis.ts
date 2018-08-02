'use strict';
import redis from 'redis';

export default (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const client = redis.createClient(url);
    client.on('connect', () => {
      client.ping(() => {
        console.info(`${url} CONNECTED`);
        client.quit();
        resolve(true);
      });
    });
    client.on('error', err => {
      console.info(`${url} Waiting...`);
      client.quit();
      resolve(false);
    });
  });
};
