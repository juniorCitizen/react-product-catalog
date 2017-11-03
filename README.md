# Hi~
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
gulp resetDatabase - 將資料庫淨空或者淨空後再填入基礎或測試資料
  options:
    --setting (development | staging | production): 由 config/database.js 取得指定淨空的資料庫連線設定. 預設: 'development'
    --seed: 植入資料
```

### npm
```
npm start - 啟動 webpack-dev-server
npm run build - 產生客戶端骨架 bundle
npm run lint - lint 整個 ./src 之下的程式碼
npm run lint-backend - 僅 lint 後端程式碼
npm run watch-server - 用 nodemon 以開發模式啟動後端伺服器
```

## API
### index.html and public assets
GET http://domain:port/sys_ref
### series
GET http://domain:port/sys_ref/api/series?(products=true)
GET http://domain:port/sys_ref/api/series?id=x(&products=true)
GET http://domain:port/sys_ref/api/series?name=xxxx(&products=true)
POST http://domain:port/sys_ref/api/series?name=xxxx (headers: { "x-access-token": 'jwt string' })

## LICENSE
MIT © [ASJ Group] (chiayu.tsai.personal@gmail.com / papago75@gmail.com)
test
