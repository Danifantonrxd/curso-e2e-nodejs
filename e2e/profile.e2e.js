const request = require('supertest');
const createApp = require("../src/app");
const { models } = require("../src/db/sequelize");
const { upSeed, downSeed } = require('./utils/umzug');

describe('test for /profile path', () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /my-user admin user', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: "admin123",
      };
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send(inputData);
      accessToken = bodyLogin.access_token;
    });

    test('should return 401', async () => {
      // Arrange
      // Act
      const { statusCode } = await api.get('/api/v1/profile/my-user').set({
        'Authorization': `Bearer 7897`,
      });
      // Assert
      expect(statusCode).toBe(401);
    });

    test('should return a user with accessToken valid', async () => {
      // Arrange
      const user = await models.User.findByPk('1');
      // Act
      const { statusCode, body } = await api.get('/api/v1/profile/my-user').set({
        'Authorization': `Bearer ${accessToken}`,
      });
      // Assert
      expect(statusCode).toBe(200);
      expect(body.email).toEqual(user.email);
    });

    afterAll(() => {
      accessToken = null;
    });
  });

  describe('GET /my-orders', () => {
    test('should return 401', async () => {
      // Arrange
      // Act
      const { statusCode } = await api.get('/api/v1/profile/my-user').set({
        'Authorization': `Bearer 7897`,
      });
      // Assert
      expect(statusCode).toBe(401);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
