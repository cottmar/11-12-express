'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Place from '../model/place';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const placeRouter = new Router();

placeRouter.post('/api/places', jsonParser, (request, response, next) => {
  // logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.city) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'title is required'));
  }
 
  return new Place(request.body).save()
    .then((note) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(place);
    })
    .catch((next) => {
    });
});

placeRouter.put('/api/notes:id', jsonParser, (request, response, next => {
  const options = { runValidators: true, new: true };

  return Place.findByIdAndUpdate(request.params.id, request.body, options)
  .then((updatedPlace) => {
    if (!updatedPlace) {
      logger.log(logger.INFO, 'GET - responding with a 404 status code = (!note)');
      return next(new HttpErrors(404, 'note not found'));
    }
    logger.log(logger.INFO, 'GET - responding with a 200 status code');
    return response.json(updatedPlace);
  })
  .catch(next);
}),

placeRouter.get('/api/places/:id', (request, response, next) => {
  return Place.findById(request.params.id)
    .then((place) => {
      if (!place) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!place)');
        return next (new HttpErrors(404, 'note not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(place);
    })
    .catch(next);
  }),

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
    })
});

export default placeRouter;
