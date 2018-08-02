'use strict';
import { MongoClient } from 'mongodb';

export default (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      (err, client) => {
        if (err) {
          console.debug(err);
          console.info(`${url} Waiting...`);
          return resolve(false);
        }

        console.info(`${url} CONNECTED`);
        client.close();
        resolve(true);
      }
    );
  });
};
