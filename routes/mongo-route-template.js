'use strict';

const logger = require('../utils/logger');

const mongodb = require('mongodb');
const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
let db = null;

/**
 * getDBConnection() Generate a singleton reference to a database connection
 *
 * @return {mongodb.MongoClient} singleton reference to a MongoClient database connection
 */
async function getDBConnection() {
  return new Promise(function(resolve, reject) {
    if (db) {
      resolve(db);
      return;
    }

    mongodb.MongoClient.connect(
      mongo_uri,
      function(err, client) {
        if (err) {
          logger.log(err);
          reject('Database connection not established');
          return;
        }
        db = client.db();
        logger.log('Database connection ready');
        resolve(db);
      }
    );
  });
}

/**
 * initMongoRoute() Create basic endpoints for Mongo Collection
 *
 * @param {express.Router} router - Express Router to configure the accessor endpoints
 * @param {string} collectionName - Name fo the MongoDB collection
 *
 * @return {void}
 */
function initMongoRoute(router, collectionName) {
  // Get everything in the collection
  // TODO: Should the name here be the pluralform?
  // TODO: should this be paged?
  router.get(`/${collectionName}`, async function(req, res) {
    const conn = await getDBConnection();
    conn
      .collection(collectionName)
      .find({})
      .toArray(function(err, docs) {
        if (err) {
          logger.error(err);
        } else {
          res.status(200).json(docs);
        }
      });
  });

  // Get one item from collection
  router.get(`/${collectionName}/:id`, async function(req, res) {
    const conn = await getDBConnection();
    let oid;
    try {
      oid = new mongodb.ObjectId(req.params.id);
    } catch (e) {
      logger.error(e);
      res.status(400).send(e);
      return;
    }

    conn.collection(collectionName).findOne({ _id: oid }, function(err, docs) {
      if (err) {
        logger.error(err);
        res.status(500).send('Server failed to handle request. Admin should check logs');
      } else {
        res.status(200).json(docs);
      }
    });
  });

  //create one new item in colelction
  router.post(`/${collectionName}`, async function(req, res) {
    const newEntry = req.body;
    const conn = await getDBConnection();
    conn.collection(collectionName).insertOne(newEntry, function(err, doc) {
      if (err) {
        logger.error(err);
        res.status(500).send('Server failed to handle request. Admin should check logs');
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  });
}

module.exports = {
  initMongoRoute
};
