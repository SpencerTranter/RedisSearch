const waterfall = require('async.waterfall');
const Redis     = require('redis');
const config    = require('./config.json');

var env         = 'prod';
var db          = process.env.npm_config_database;
var key         = process.env.npm_config_key
var redisBase   = process.env.npm_config_redisbase;


var redis;

new Promise((resolve) => {

  redis = Redis.createClient(config[env].redis[redisBase]);

  redis.on('error', (err) => {

    console.log('Unable to connect to Redis.', err);

    throw new Error(err);

  });

  redis.on('connect', () => {

    console.log('Connected to Redis.');

    resolve();

  });

})
.then(() => new Promise((resolve) => {

  console.log('Setting Redis Client Name (searchRedis).');
  // easy to debug identity when executing CLIENT LIST.
  redis.send_command('CLIENT', ['SETNAME', 'searchRedis'], (err) => {

    if (err) throw new Error(err);
    else resolve();

  });

}))
.then(() => new Promise((resolve) => {

  console.log(`searching for ${key}`);
  // gather all records

  if (key === 'all') {

    redis.hgetall(db, (error, reply) => {

      if (error) throw new Error(error);
      else if (reply[0] === null) throw new Error('NO DATA');
      else {

        console.log(reply);

        resolve();

      }

    });

  }
  else {

    redis.hmget(db, key,  (error, reply) => {

      if (error) throw new Error(error);
      else if (reply[0] === null) throw new Error('NO DATA');
      else {

        console.log(reply);

        resolve();

      }

    });

  }

}))
.then(() => {

  console.log('Disconnecting from Redis..');
  redis.end(true);

  console.log('done');

})
.catch((err) => {

  console.log('Disconnecting from Redis..');
  redis.end(true);

  console.log('ERROR', err);

});
