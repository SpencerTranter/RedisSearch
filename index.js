const waterfall = require('async.waterfall');
const Redis     = require('redis');
const config    = require('./config.json');

var env         = 'prod';
var db          = process.env.npm_config_database;
var key         = process.env.npm_config_key
var redisBase   = process.env.npm_config_redisbase;


var redis;

waterfall([

  function (next) {

    redis = Redis.createClient(config[env].redis[redisBase]);

    redis.on('error', (err) => {

      console.log('Unable to connect to Redis.', err);

      next(err);

    });

    redis.on('connect', () => {

      console.log('Connected to Redis.');

      next(null);

    });

  },
  function (next) {

    console.log('Setting Redis Client Name (searchRedis).');
    // easy to debug identity when executing CLIENT LIST.
    redis.send_command('CLIENT', ['SETNAME', 'searchRedis'], (err) => {

      if (err) next(err);
      else     next(null);

    });

  },
  function (next) {

    console.log(`searching for ${key}`);
    // gather all records

    if (key === 'all') {

      redis.hgetall(db, (error, reply) => {

        if (error) next(error);
        else if (reply[0] === null) next('NO DATA');
        else {

          console.log(reply);

          next(null);

        }

      });

    }
    else {

      redis.hmget(db, key,  (error, reply) => {

        if (error) next(error);
        else if (reply[0] === null) next('NO DATA');
        else {

          console.log(reply);

          next(null);

        }

      });

    }

  }
], (err) => {


  console.log('Disconnecting from Redis..');
  redis.end(true);

  if (err) console.log(err);
  else console.log('done');

});
