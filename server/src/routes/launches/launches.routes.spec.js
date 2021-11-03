const request = require('supertest')
const app = require('../../app')
const {
  connectToMongoDB,
  disconnectFromMongoDB
} = require('../../services/mongo');

describe('launches.route', function () {

  beforeAll(async () => {
    await connectToMongoDB()
  })

  afterAll(async () => {
    await disconnectFromMongoDB()
  })

  describe('test GET launches', () => {
    it('Should response with 200', async () => {
      const response = await request(app).get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200)
      // expect(response.statusCode).toBe(200)
    });
  });

  describe('test POST launches', () => {
    const requestWithDate = {
      "mission": "Evgeniy111",
      "rocket": "Evgeniy Intelstellar IS1",
      "target": "Kepler-452 b",
      "launchDate": "January 17, 2030"
    }
    const requestWithoutDate = {
      "mission": "Evgeniy111",
      "rocket": "Evgeniy Intelstellar IS1",
      "target": "Kepler-452 b",
    }

    it('Should respond with 201', async () => {
      const response = await request(app).post('/v1/launches')
        .send({
          "mission": "Evgeniy111",
          "rocket": "Evgeniy Intelstellar IS1",
          "target": "Kepler-452 b",
          "launchDate": "January 17, 2030"
        })
        .expect('Content-Type', /json/)
        .expect(201)
      expect(response.body).toMatchObject(requestWithoutDate)
      expect(new Date(requestWithDate.launchDate).valueOf())
        .toBe(new Date(response.body.launchDate).valueOf())
    });
    it('Should catch missing required properties', async () => {
      const response = await request(app).post('/v1/launches')
        .send(requestWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
      })
    });
    it('Should catch invalid dates', async () => {
      const requestWithInvalidDate = {
        "mission": "Evgeniy155",
        "rocket": "Evgeniy Intelstellar IS1",
        "target": "Kepler-186 f",
        "launchDate": "test"
      }
      const response = await request(app).post('/v1/launches')
        .send(requestWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
      })
    });
  });
});


