require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

var indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRoutes');
const stationRouter = require('./routes/stationRoutes');
const trainRouter = require('./routes/trainRoutes');

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
//const { default: mongoose } = require('mongoose');

// Configuration Swagger pour swagger-jsdoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blogify API',
      version: '1.0.0',
      description: 'API de Blogify pour la gestion des utilisateurs, posts, commentaires et likes',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'integer',
              description: 'ID de l\'utilisateur',
            },
            name: {
              type: 'string',
              description: 'Nom de l\'utilisateur',
            },
            email: {
              type: 'string',
              description: 'Email de l\'utilisateur',
            },
            password: {
              type: 'string',
              description: 'Mot de passe de l\'utilisateur',
            },
            role: {
              type: 'string',
              description: 'Rôle de l\'utilisateur',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de l\'utilisateur',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour de l\'utilisateur',
            },
          },
          required: ['name', 'email', 'password'],
        },
        Train: {
          type: 'object',
          properties: {
            _id: {
              type: 'integer',
              description: 'ID du train',
            },
            name: {
              type: 'string',
              description: 'Nom du train',
            },
            start_station: {
              $ref: '#/components/schemas/Station',
              description: 'Gare de départ du train',
            },
            end_station: {
              $ref: '#/components/schemas/Station',
              description: 'Gare d\'arrivée du train',
            },
            time_of_departure: {
              type: 'string',
              format: 'date-time',
              description: 'Heure de départ du train',
            },
            time_of_arrival: {
              type: 'string',
              format: 'date-time',
              description: 'Heure d\'arrivée du train',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du train',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour du train',
            },
          },
          required: ['name', 'start_station', 'end_station', 'time_of_departure', 'time_of_arrival'],
        },
        Station: {
          type: 'object',
          properties: {
            _id: {
              type: 'interger',
              description: 'ID de la gare',
            },
            name: {
              type: 'string',
              description: 'Nom de la gare',
            },
            open_hour: {
              type: 'string',
              description: 'Heure d\'ouverture de la gare',
            },
            close_hour: {
              type: 'string',
              description: 'Heure de fermeture de la gare',
            },
            image: {
              type: 'string',
              description: 'Image de la gare',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de la gare',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour de la gare',
            },
          },
          required: ['name', 'open_hour', 'close_hour', 'image'],
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

// Initialisation de swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stations', stationRouter);
app.use('/trains', trainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
