# PRODUCT CATALOG
simple product catalog website and backend with product data, user and client management functionalities suitable for small businesses, written with react and node.js

## INSTALL

### instructions pending

## USAGE
### CLI Commands
### gulp
```
gulp backupDotEnv - copy a skeleton copy of .env to ./src/workflow/backup/blank.env
glup removeLogs - remove *.log from the entire project file structure
gulp resetDatabase - 將資料庫淨空或者淨空後再填入基本/MOCK資料
  options:
    -- setting (development | staging | production): 由 config/database.js 取得指定淨空的資料庫連線設定. 預設: 'development'
    -- seed: 植入資料
```

### npm
```
npm start - run webpack-dev-server
npm run build - produce a bare bone frontend bundle
npm run lint - lint full source code
npm run lint-backend - lint only backend code
npm run watch-server - start server in development mode with nodemon
```

## API
GET /SYS_REF - index.html and public assets

## LICENSE
MIT © [ASJ Group](chiayu.tsai.personal@gmail.com)
