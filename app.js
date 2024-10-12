var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoutes');
const stationRouter = require('./routes/stationRoutes');
const trainRouter = require('./routes/trainRoutes');

var app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { default: mongoose } = require('mongoose');

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
        url: 'http://localhost:3000', // L'URL de votre serveur local
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Indique où trouver les fichiers contenant les annotations
};

// Initialisation de swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect('mongodb+srv://alexandre:Txf7zow8J307dwmQ@cluster0.k98hw.mongodb.net/')
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
