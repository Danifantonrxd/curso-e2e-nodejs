const { PRODUCT_TABLE } = require('../models/product.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
        name: 'Product 1',
        image: 'https://api.lorem.space/image/game',
        description: 'A description',
        price: 10,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'Product 2',
        image: 'https://api.lorem.space/image/game',
        description: 'A description',
        price: 20,
        category_id: 2,
        created_at: new Date(),
      },
      {
        name: 'Product 3',
        image: 'https://api.lorem.space/image/game',
        description: 'A description',
        price: 30,
        category_id: 2,
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  },
};
