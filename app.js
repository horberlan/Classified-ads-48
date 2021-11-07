const {APIHost, OUTLOOK, PING_LIMITER} = require('./consts');

const bootstrap = require('./bootstrap').ops;
bootstrap.checkEnvironmentVariables();

const dotenv = require('dotenv');
dotenv.config();
// console.log(`Your port is ${process.env.PORT}`); // 8626
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json(),
  ),
  // defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: './logs/error.log', level: 'error'}),
    new winston.transports.File({filename: './logs/combined.log'}),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

global._logger = logger;


// mongooooooooooooooooooooooooooooo MAIN //
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.NODE_ENV === 'local' ?
  'mongodb://localhost:27017' : process.env.MONGODB_URI;
const dbName = process.env.NODE_ENV === 'development' ? 'listings_db_dev' : 'listings_db';
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

bootstrap.checkEnvironmentData(url).then(async (reply) => {
  prepareData();
}).catch((err) => {
  _logger.log({level: 'error', message: 'Refusing to start because of ' + err});
  process.exit();
});

// Use connect method to connect to the Server
const prepareData = () => {
  client.connect(async function(err) {
    assert.equal(null, err);
    console.log('Connected successfully to server', 'url', url.split('@')[0],
        'dbName', dbName);
    const db = client.db(dbName);
    const collection = db.collection('listing');
    // Create indexes
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
      await collection.deleteMany({});
      bootstrap.seedDevelopmenetData(_logger, db).then(async (reply) => {
        await bootstrap.createIndexes(_logger, db);
        bootstrap.wordsMapReduce(_logger, db);
      }).catch((err) => {
        _logger.log({level: 'error', message: 'Refusing to start because of ' + err});
        process.exit();
      });
    } else {
      // TODO: deal with production indexes and map reduce functions
    }
    global.mongodb = db;
    db.on('error', function(error) {
      _logger.log({level: 'error', message: error});
      // global.mongodb.disconnect();
    });
  });
};


// const createError = require('http-errors');
const express = require('express');
const {auth} = require('express-openid-connect');
const path = require('path');
const flash = require('connect-flash');
// const Filter = require('bad-words');
const compression = require('compression');
// var CensorifyIt = require('censorify-it')
const helmet = require('helmet');

const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      backend: {
        loadPath: __dirname + '/data/locales/{{lng}}/{{ns}}.json',
      },
      fallbackLng: 'en',
      preload: ['en', 'ar', 'fr'],
      cookiename: 'locale',
      detection: {
        order: ['cookie'],
        lookupCookie: 'locale',
        caches: ['cookie'],
      },
    });

const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SESSION_SECRET,
  baseURL: process.env.AUTH0_BASEURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
};

const app = express();
app.use(auth(authConfig));
app.use(helmet({contentSecurityPolicy: false}));
app.use(compression());
app.use(flash());
app.use(i18nextMiddleware.handle(i18next));

app.get('/i18n/:locale', (req, res) => {
  res.cookie('locale', req.params.locale);
  if (req.headers.referer) res.redirect(req.headers.referer);
  else res.redirect('/');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParser(process.env.SESSION_SECRET));
app.use('/so-c', express.static(path.join(__dirname, 'app_so-cards')));
app.use('/blog/', express.static(path.join(__dirname, 'app_blog/build')));
// const customFilter = new Filter({placeHolder: 'x'});

const nodemailer = require('nodemailer');
// const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;
const transportOptions = {
  pool: true,
  host: OUTLOOK.MAIL_SERVER,
  port: OUTLOOK.SMTP_PORT,
  secure: false,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
  tls: OUTLOOK.TLS,
};
const transporter = nodemailer.createTransport(transportOptions);
transporter.verify(function(error, success) {
  if (error) {
    logger.log({level: 'error', message: error.message});
  } else {
    logger.log({level: 'info', message: 'Messaging server ready'});
  }
});

let mailHogTransporter;
try {
  mailHogTransporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
  });
  mailHogTransporter.verify(function(error, success) {
    if (error) {
      logger.log({level: 'error', message: error.message});
    } else {
      logger.log({level: 'info', message: 'MailHog server ready'});
      global.mailHogTransporter = mailHogTransporter;
    }
  });
} catch (error) {
  logger.log({level: 'error', message: error.message});
}


// Process generic parameters
const _ = require('underscore');
const processParams = function(req, res, next) {
  res.locals.isAuthenticated = req.oidc.isAuthenticated();

  if (req.oidc.isAuthenticated()) {
    res.locals.user = req.oidc.user;
  } else {
    _logger.log({level: 'info', message: 'login:: user is not authenticated'});
  }

  // 1: Trimmer
  req.body = _.object(_.map(req.body, function(value, key) {
    if (value && value.length) {
      return [key, value.trim()];
    } else {
      return [key, value];
    }
  }));
  // 2: Pagination
  // Add pagination constants based on API, device, browser, etc.
  // No pagination for search pages
  if (req.url.indexOf('geolocation') >= 0 ||
    req.url.indexOf('gwoogl') >= 0 ||
    req.url.indexOf('contact') >= 0) {
    return next();
  }
  const perPage = 9;
  const page = req.query.p || 1;
  req.body.pagination = {perPage: perPage, page: page};
  next();
};
app.use(processParams);


const indexRouter = require('./lib/routes/index');
const listingsRouter = require('./lib/routes/listings');
const dataRouter = require('./lib/routes/data');
const gameRouter = require('./lib/routes/game');
app.use('/', indexRouter);
app.use('/listings', listingsRouter);
app.use('/data', dataRouter);
app.use('/', gameRouter);


const rateLimit = require('express-rate-limit');
const addLimiter = rateLimit(PING_LIMITER.RATE_LIMIT);
// /listings/ + /^\/(donations|skills|blogs)/
app.post('/listings/donations/', addLimiter);
app.post('/listings/skills/', addLimiter);

const slowDown = require('express-slow-down');
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, etc)
const speedLimiter = slowDown(PING_LIMITER.SLOW_DOWN_LIMIT);
app.use(speedLimiter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Thehoneypot project: forbid spam
const dns = require('dns');
app.use(function(req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }
  if (process.env.NODE_ENV === 'local' || ip.split('.')[0] === '127') {
    return next();
  }
  const reversedIp = ip.split('.').reverse().join('.');
  dns.resolve4([process.env.HONEYPOT_KEY, reversedIp, 'dnsbl.httpbl.org'].join('.'),
      function(err, addresses) {
        if (!addresses) {
          return next();
        }
        const _response = addresses.toString().split('.').map(Number);
        // visitor_type[_response[3]]
        const test = (_response[0] === 127 && _response[3] > 0);
        if (test) {
          res.send({msg: 'we hate spam to begin with!'});
        }
        return next();
      });
});

module.exports = app;

