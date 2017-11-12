# PRODUCT CATALOG

simple product catalog website and backend with product data, user and client management functionalities suitable for small businesses, written with react and node.js

## INSTALL

### instructions pending

## USAGE

### CLI Commands

### gulp

1. gulp backupDotEnv - copy a skeleton copy of .env to ./src/workflow/backup/blank.env
2. glup removeLogs - remove *.log from the entire project file structure
3. gulp resetDatabase - 將資料庫淨空或者淨空後再填入基礎或測試資料

   * options:

    --setting (development | staging | production): 由 config/database.js 取得指定淨空的資料庫連線設定. 預設: 'development'

    --seed: 植入資料

   * example: **gulp resetDatabase --setting development --seed**

### npm

1. npm start - 啟動 webpack-dev-server
2. npm run build - 產生客戶端骨架 bundle
3. npm run lint - lint 整個 ./src 之下的程式碼
4. npm run lint-backend - 僅 lint 後端程式碼
5. npm run watch-server - 用 nodemon 以開發模式啟動後端伺服器

## WEBAPI

### client access

* **GET protocol://domain:port/sys_ref** - index.html
* **GET protocol://domain:port/sys_ref/path** - public assets

### series

* **GET protocol://domain:port/sys_ref/api/series** - get series data

  * examples:
    1. GET protocol://domain:port/sys_ref/api/series(?details)
    2. GET protocol://domain:port/sys_ref/api/series(?id=x(&details))
    3. GET protocol://domain:port/sys_ref/api/series(?name=xxx(&details))

* **POST protocol://domain:port/sys_ref/api/series** - insert series record

  * request header: { "x-access-token": "jwt-token-string" }
  * examples: POST protocol://domain:port/sys_ref/api/series?name=xxx(&details)

* **PUT protocol://domain:port/sys_ref/api/series** - update a series record

  * request header: { "x-access-token": "jwt-token-string" , "Content-Type": "application/json"}
  * request body: { "id": 11, "name": "hello", "order": 7 }
  * examples: PUT protocol://domain:port/sys_ref/api/series(?details)

* **DELETE protocol://domain:port/sys_ref/api/series** - delete a series record by id

  * request header: { "x-access-token": "jwt-token-string" }
  * examples:
    1. DELETE protocol://domain:port/sys_ref/api/series?id=x(&details)
    2. DELETE protocol://domain:port/sys_ref/api/series?name=xxx(&details)

### products

* **GET    protocol://domain:port/sys_ref/api/products** - get product catalog

  * examples:
    1. GET protocol://domain:port/sys_ref/api/products(?details)
    2. GET protocol://domain:port/sys_ref/api/products(?id=x(&details))
    3. GET protocol://domain:port/sys_ref/api/products(?code=xxx(&details))

* **POST protocol://domain:port/sys_ref/api/products** - insert product and photo records

  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "multipart/form-data"}
  * request body: {

        "code": "xxx",
        "name": "xxx",
        "specification": "xxx",
        "description": "xxx",
        "tags": ["tagId", "tagId"...], // optional
        "primaryPhoto": file, // optional, but must exist if secondaryPhotos are sent
        "secondaryPhotos": files // optional

    }
  * examples: POST protocol://domain:port/sys_ref/api/products?name=xxx(&details)

* **PUT protocol://domain:port/sys_ref/api/products** - update multiple fields of a product record by id

  * request header: { "x-access-token": "jwt-token-string" , "Content-Type": "application/json"}
  * request body: {

        "id": "product uuid", // required
        "code": "xxx", // optional
        "name": "xxx", // optional
        "specification": "xxx", // optional
        "description": "xxx", // optional
        "publish": true/false, // optional
        "seriesId": integer // optional

    }
  * note: 除了必要的 product id 值，至少要有另一個欄位存在

### token

* **POST   protocol://domain:port/sys_ref/api/token** - apply for jwt token to access data modification end points

## LICENSE

MIT © [ASJ Group] (chiayu.tsai.personal@gmail.com / papago75@gmail.com)
