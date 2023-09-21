const request = require('supertest');
const createApp = require("../src/app");
const { models } = require("../src/db/sequelize");
const { upSeed, downSeed } = require('./utils/umzug');

describe('test for /users path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /users', () => {
    test('should return a user', async () => {
      // Arrange
      const user = await models.User.findByPk('1');
      // Act
      const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`)
      // Assert
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(user.id);
      expect(body.email).toEqual(user.email);

    });
  });

  describe('POST /users', () => {
    test('should return 400 Bad Request with invalid password', async () => {
      // Arrage
      const inputData = {
        email: "danifanton@gmail.com",
        password: "---",
      };
      // Act
      const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return 400 Bad Request invalid email', async () => {
      // Arrage
      const inputData = {
        email: "---",
        password: "sasdasdsadqwe12",
      };
      // Act
      const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/email/);
    });

    test('should return new user', async () => {
      // Arrage
      const inputData = {
        email: "daniel@gmail.com",
        password: "root1234",
      };
      // Act
      const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toBe(201);
      // Check DB
      const user = await models.User.findByPk(body.id);
      expect(user).toBeTruthy();
      expect(user.role).toEqual('admin');
      expect(user.email).toEqual(inputData.email);
    });


  });

  describe('PATCH /users', () => {

  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
