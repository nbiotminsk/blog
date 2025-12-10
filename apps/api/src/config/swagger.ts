import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nikolai API',
      version: '1.0.0',
      description: 'API for Nikolai service',
    },
    servers: [
      {
        url: '/api',
      },
    ],
  },
  apis: ['./src/routes/v1/*.ts'], 
};

export const specs = swaggerJsdoc(options);
