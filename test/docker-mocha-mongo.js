'use strict';
const MongoClient = require('mongodb').MongoClient;

function ping(url) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      (err, client) => {
        if (err) {
          console.debug(err);
          return resolve(false);
        }

        console.debug('Connected successfully to server');
        client.close();
        resolve(true);
      }
    );
  });
}

module.exports = {
  ping
};
