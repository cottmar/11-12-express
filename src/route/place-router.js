
'use strict';

/*
import express from 'express';
const Router = express.Router;
 */

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Place from '../model/place';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const placeRouter = new Router();

placeRouter.post('/api/places', jsonParser, (request, response, next) => {
  if (!request.body.city) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'city is required'));
  }
  return new Place(request.body).save()
    .then((place) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(place);
    })
    .catch(next);
});

placeRouter.put('/api/places/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Place.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPlace) => {
      if (!updatedPlace) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code - (!place)');
        return next(new HttpErrors(404, 'place not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedPlace);
    })
    .catch(next);
});

placeRouter.get('/api/places/:id', (request, response, next) => {
  return Place.findById(request.params.id)
    .then((place) => { 
      if (!place) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!place)');
        return next(new HttpErrors(404, 'place not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(place);
    })
    .catch(next);
});

placeRouter.delete('/api/places/:id', (request, response, next) => { // eslint-disable-line no-unused-vars
  return Place.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > 1) {
        logger.log(logger.INFO, 'DELETE');
        logger.log(logger.VERBOSE, `Could not parse the object id ${request.params.id}`);
        // return response.sendStatus(404);
      }
      return response.sendStatus(404);
    });
});

export default placeRouter;
