const bcrypt = require('bcrypt');
const sequelize = require('../../src/db/sequelize');
const { models } = sequelize;

async function upSeed() {
  try {
    await sequelize.sync({ force: true });
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await models.User.create({
      email: 'admin@gmail.com',
      password: hash,
      role: 'admin',
    });

    await models.Category.bulkCreate([
      {
        name: 'Category 1',
        image: 'https://api.lorem.space/image/game',
      },
      {
        name: 'Category 2',
        image: 'https://api.lorem.space/image/game',
      },
    ]);
  } catch (error) {
    // console.error(error);
  }
}

async function downSeed() {
  await sequelize.drop();
}

module.exports = {
  upSeed,
  downSeed,
};
