'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Place from '../model/place';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/places`;

const pCreatePlaceMock = () => {
  return new Place({
    city: faker.lorem.words(2),
    state: faker.lorem.words(1),
  }).save();
};

describe('/api/places', () => { 
  beforeAll(startServer); 
  afterAll(stopServer);
  afterEach(() => Place.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const placeToPost = {
      city: faker.lorem.words(10),
      state: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(placeToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.city).toEqual(placeToPost.city);
        expect(response.body.state).toEqual(placeToPost.state);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const placeToPost = {
      state: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(placeToPost)
      .then(Promise.reject) 
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/places', () => {
    test('should respond with 200 if there are no errors', () => {
      let placeToTest = null; 

      return pCreatePlaceMock() 
        .then((place) => {
          placeToTest = place;
          return superagent.get(`${apiURL}/${place._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.city).toEqual(placeToTest.city);
          expect(response.body.state).toEqual(placeToTest.state);
        });
    });
    test('should respond with 404 if there is no place to be found', () => {
      return superagent.get(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject) 
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/places', () => {
    test('should update a note and return a 200 status code', () => {
      let placeToUpdate = null;
      return pCreatePlaceMock()
        .then((placeMock) => {
          placeToUpdate = placeMock;
          return superagent
            .put(`${apiURL}/${placeMock._id}`)
            .send({ city: 'Seattle' })
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.city).toEqual('Seattle');
              expect(response.body.state).toEqual(placeToUpdate.state);
              expect(response.body._id).toEqual(placeToUpdate._id.toString());
            });
        });
    });
  });
  describe('DELETE /api/places/:id', () => {
    test('should respond with a 204 error if there is no content in the body', () => {
      return pCreatePlaceMock()
        .then((place) => { // eslint-disable-line no-unused-vars
          return superagent.delete('{apiUrl}/{place._id}');
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 error if there is no resource with that id', () => {
      return superagent.delete(`${apiURL}/InvalidId`)
        .then(Promise.reject) 
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
