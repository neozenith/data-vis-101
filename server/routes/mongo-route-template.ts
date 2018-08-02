'use strict';

import logger from '../utils/logger';

/**
 * initMongoRoute() Create basic endpoints for Mongo Collection
 *
 * @param {express.Router} router - Express Router to configure the accessor endpoints
 * @param {mongoose.Model} model - Mongoose model
 *
 * @return {void}
 */
export function initMongoRoute(router, model) {
  // Get everything in the collection
  // TODO: Should the name here be the pluralform?
  // TODO: should this be paged?
  logger.log(model.modelName.toLowerCase());
  const collection = model.modelName.toLowerCase();

  router.get(`/${collection}`, function(req, res) {
    model
      .find({})
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        logger.error(err);
      });
  });

  router.get(`/${collection}/:id`, function(req, res) {
    model.findById(req.params.id).exec((err, docs) => {
      if (err) {
        logger.error(err);
        return res.status(500).send(err);
      }
      res.status(200).json(docs);
    });
  });

  router.post(`/${collection}`, function(req, res) {
    const newItem = new model(req.body);
    newItem
      .save()
      .then(result => {
        logger.info(result);
        res.status(201).send(result);
      })
      .catch(e => {
        logger.error(e);
        res.status(500).send(e);
      });
  });
}
