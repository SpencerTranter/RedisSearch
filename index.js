const waterfall = require('async.waterfall');
const Redis     = require('redis');
const config    = require('./config.json');

var db          = process.env.npm_config_database;
var key         = process.env.npm_config_key
var field       = process.env.npm_config_field;
console.log(db);

var redis;

const createRedis = () => new Promise((resolve, resolve) => {

  redis = Redis.createClient(config[db]);

  redis.on('error', (err) => {

    console.log('Unable to connect to Redis.', err);

    reject(err);

  });

  redis.on('connect', () => {

    console.log('Connected to Redis.');

    resolve(redis);

  });

});

const setRedis = () => new Promise((resolve, reject) => {

  console.log('Setting Redis Client Name (searchRedis).');
  // easy to debug identity when executing CLIENT LIST.
  redis.send_command('CLIENT', ['SETNAME', 'searchRedis'], (err) => {

    if (err) reject(err);
    else resolve();

  });

});

const getRedis = () => new Promise((resolve, reject) => {

  console.log(`searching for ${field} in ${key}`);
  // gather all records

  if (field === 'all') {

    redis.hgetall(key, (error, reply) => {

      if      (error) reject(error);
      else if (reply[0] === null) reject('NO DATA');
      else {

        console.log(reply);
        resolve();

      }

    });

  }
  else {

    redis.hmget(key, field,  (error, reply) => {

      if      (error) reject(error);
      else if (reply[0] === null) reject('NO DATA');
      else {

        console.log(reply);
        resolve();

      }

    });

  }

});

createRedis()
.then(() => setRedis())
.then(() => getRedis())
.then(() => {

  console.log('Disconnecting from Redis..');
  redis.end(true);

  console.log('Success!');

})
.catch((err) => {

  console.log('Disconnecting from Redis..');
  redis.end(true);

  console.log('ERROR', err);

});
