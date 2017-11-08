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
  example: gulp resetDatabase --setting development --seed
```

### npm
```
npm start - 啟動 webpack-dev-server
npm run build - 產生客戶端骨架 bundle
npm run lint - lint 整個 ./src 之下的程式碼
npm run lint-backend - 僅 lint 後端程式碼
npm run watch-server - 用 nodemon 以開發模式啟動後端伺服器
```

## WEBAPI
### client access
* **GET protocol://domain:port/sys_ref** - index.html
* **GET protocol://domain:port/sys_ref/path** - public assets

### series
* **GET protocol://domain:port/sys_ref/api/series** - get full series dataset only
* **GET protocol://domain:port/sys_ref/api/series/products** - get full series dataset with product and photo details (without photo data)
* **GET protocol://domain:port/sys_ref/api/series/:id** - get series item by id only
* **GET protocol://domain:port/sys_ref/api/series/:id/products** - get series item by id with product and photo details (without photo data)
* **GET protocol://domain:port/sys_ref/api/series/name/:name** - get series item by name only
* **GET protocol://domain:port/sys_ref/api/series/name/:name/products** - get series item by name with product and photo details (without photo data)
* **POST protocol://domain:port/sys_ref/api/series/:name** - insert a new series with 'name' field value of :name (id is automatically given and set at the next avaialable order position)
* **PUT protocol://domain:port/sys_ref/api/series/:id/:name/:order** - update a series record's 'name' and 'order' value by id
* **PATCH protocol://domain:port/sys_ref/api/series/:id/name/:name** - update a series record's 'name' value by id
* **PATCH protocol://domain:port/sys_ref/api/series/:id/order/:order** - update a series record's 'order' value by id
* **DELETE protocol://domain:port/sys_ref/api/series/id/:id** - delete a series record by id
* **DELETE protocol://domain:port/sys_ref/api/series/name/:name** - delete a series record by name

### products
* **GET protocol://domain:port/sys_ref/api/series(?details=true)** - get full product catalog

### token
* **POST protocol://domain:port/sys_ref/api/token** - apply for jwt token to access data modification end points

## LICENSE
MIT © [ASJ Group] (chiayu.tsai.personal@gmail.com / papago75@gmail.com)
