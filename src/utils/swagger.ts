const swaggerJsDoc = require('swagger-jsdoc');

module.exports = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Devils CRM',
      version: '1.0.0',
      contact: {
        name: 'Sam',
        email: 'tingzhuangzhou@gmail.com',
      },
      description: 'Open API standard swagger document for Devils CRM System',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  apis: ['src/controllers/*.ts'],
});
