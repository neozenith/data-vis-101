'use strict';
import amqp from 'amqplib';

export default (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const startTime = new Date().valueOf();

    amqp
      .connect(url)
      .then((conn) =>
        conn.createChannel().then(() => {
          console.info(`${url} CONNECTED`);
          conn.close();
          resolve(true);
        })
      )
      .catch((err) => {
        console.info(`${url} Waiting...`);
        // console.error(err);
        resolve(false);
      });
  });
};
