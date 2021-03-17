const express = require('express')
const db = require('./config/db')
const userRouter = require('./routers/userRouter')
const questionRouter = require('./routers/questionRouter')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc')
const cors = require('cors');
const answerRouter = require('./routers/answerRouter');
require('dotenv').config()

// start db
db.authenticate()
  .then((result) => {
    console.log('Connection established.')
    return db.sync()
  })
  .then(console.log('All tables created successfully.'))
  .catch((error) => {
    console.log('Unable to connect to db: ', error)
  })

// start app
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRouter)
app.use('/api/questions', questionRouter)
app.use('/api/answers', answerRouter)

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

const port = process.env.PORT || 5000
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WDS-QA API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          },
          required: ['code', 'message']
        }
      },
    },
    security: [{
      bearerAuth: []
    }]
  },

  apis: ['./routers/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`)
})
