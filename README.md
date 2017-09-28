# searchRedis

### Usage

The commmand line prompt is as follows:

npm run start --env='prod' --database='trap_photos_by_mac' --key='001C2C1B26097F0B' --redisbase='latest'

env: Either `stage` or `prod`.

database: Which redis collection you are looking to search through.

key: What the collection is keyed on. Usually a mac address or `all`.

redisbase: Either 'latest', 'general' or 'nodesByGateway'.

---

This requires a config file that @stranter can give.
