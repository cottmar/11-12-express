'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Place from '../model/place';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const placeRouter = new Router();

placeRouter.post('/api/places', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.city) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
 
  return new Place(request.body).save()
    .then((place) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(place);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

placeRouter.get('/api/places/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');
  return Place.findById(request.params.id)
    .then((place) => {
      if (!place) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!place)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 202 status code');
      return response.json(place);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

placeRouter.delete('/api/places/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - deleting a place route');
  return Place.findByIdAndRemove(request.params.id)
    .then((place) => {
      if (!place) {
        logger.log(logger.INFO, 'DELETE - responding with a 303 status code');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE');
      return response.json(place);
    });
});

export default placeRouter;
