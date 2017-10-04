# redis-search

## Usage

The commmand line prompt is as follows:

npm run start --database='redis-latest-prod' --key='nodes-by-mac' --field='001C2C1B26097F0B'

database: Which Redis deployment you are looking to search through.

key: What key of that deployment are you searching through.

field: Which value to grab data back from. Can be set too `all`.

---

## Note

Please create a config.json file and ensure it is in the following format.
```
{
  "database-name-1": {
    "host": "",
    "port": "",
    "password": ""
  },
  "database-name-2": {
    "host": "",
    "port": "",
    "password": ""
  }
}
```
