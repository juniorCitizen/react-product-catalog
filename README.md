# PRODUCT CATALOG

simple product catalog website and backend with product data, contact management functionalities suitable for small businesses, written with react and node.js

## INSTALL

### instructions pending

## USAGE

### CLI Commands

### gulp

1. gulp backupDotEnv - copy a skeleton copy of .env to ./src/workflow/backup/blank.env
2. glup removeLogs - remove *.log from the entire project file structure
3. gulp resetDatabase - 將資料庫淨空或者淨空後再填入基礎或測試資料

   * options: --seed: 植入資料
   * example: **gulp resetDatabase --seed**

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

* **GET protocol://domain:port/sys_ref/api/series(?details)** - get series data with optional details

* **GET protocol://domain:port/sys_ref/api/series/:seriesId(?details)** - get series by id with optional details

* **POST protocol://domain:port/sys_ref/api/series/name/:name(?details)** - insert new series record of 'name'

  * request header: { "x-access-token": "jwt-token-string" }

* **PUT protocol://domain:port/sys_ref/api/series/:seriesId(?details)** - update multiple fields of a series record by id

  * request header: { "x-access-token": "jwt-token-string" , "Content-Type": "application/json"}
  * request body: { "name": "hello", "order": 7 }

* **DELETE protocol://domain:port/sys_ref/api/series/:seriesId(?details)** - delete a series record by id

  * request header: { "x-access-token": "jwt-token-string" }
  * notes: will error if existing product/photo is still associated with the target series

### products

* **GET protocol://domain:port/sys_ref/api/products/count** - get total number of records in product dataset

* **GET protocol://domain:port/sys_ref/api/products(?per_page=x&page=y&details)** - get product catalog with optional details and pagination

* **GET protocol://domain:port/sys_ref/api/product/:productId(?details)** - get product by id with optional details

* **POST protocol://domain:port/sys_ref/api/products(?details)** - insert product with optional photo uploads and tags association

  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "multipart/form-data"}
  * request body:

        {
          "code": "xxx",
          "name": "xxx",
          "specification": "xxx",
          "description": "xxx",
          "tags": ["tagId", "tagId"...], // optional
          "primaryPhoto": file, // optional, but must exist if secondaryPhotos are present
          "secondaryPhotos": files // optional
        }

  * note: photo files are deleted during operation

* **PUT protocol://domain:port/sys_ref/api/products/:productId(?details)** - update multiple fields of a product record by id

  * request header: { "x-access-token": "jwt-token-string" , "Content-Type": "application/json"}
  * request body:

        {
          "code": "xxx", // optional
          "name": "xxx", // optional
          "specification": "xxx", // optional
          "description": "xxx", // optional
          "publish": true/false, // optional
          "seriesId": integer // optional
        }

  * note: at least one field must be

* **PATCH protocol://domain:port/sys_ref/api/products/:productId/series/:seriesId(?details)** - assign product to a series

  * request header: { "x-access-token": "jwt-token-string" }

* **DELETE protocol://domain:port/sys_ref/api/products/:productId** - delete a product record by id

  * request header: { "x-access-token": "jwt-token-string" }
  * notes:
    1. associated tags are disassociated by removal of related entry in the 'labels' table
    2. associated photos only has 'productId' field set to null, so orphan photos may be created

### photos

* **GET protocol://domain:port/sys_ref/api/photos/:photoId** - get **photo data** by id

* **POST protocol://domain:port/sys_ref/api/photos** - batch photo insert

  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "multipart/form-data"}
  * request body:

        {
          "primary": boolean, // optional
          "publish": boolean, // optional
          "seriesId": integer, // optional
          "productId": uuid, //optional
          "photos": files // at least one file must exist in the property
        }

  * note: photo files are deleted during operation

* **PATCH protocol://domain:port/sys_ref/api/photos** - publish or unpublish a photo

  * request header: { "x-access-token": "jwt-token-string" }

* **PATCH protocol://domain:port/sys_ref/api/photos/:photoId/products/:productId** - assign a photo to a product

  * request header: { "x-access-token": "jwt-token-string" }

* **PATCH protocol://domain:port/sys_ref/api/photos/:pnameh: "SJ GROUP", otoId/series/:seriesId** - assign a photo to a series

  * request header: { "x-access-token": "jwt-token-string" }

* **DELETE protocol://domain:port/sys_ref/api/photos/:photoId** - delete photo record by id

  * request header: { "x-access-token": "jwt-token-string" }

### regions

* **GET protocol://domain:port/sys_ref/api/regions** - get a list of world regions

### countries

* **GET protocol://domain:port/sys_ref/api/countries/count** - get total number of records in countries

* **GET protocol://domain:port/sys_ref/api/countries(&per_page=x&page=y)** - get a list of countries sorted by name and optional pagination

* **GET protocol://domain:port/sys_ref/api/countries/:countryId/flag** - get the flag svg from countryId

### carousels

* **GET protocol://domain:port/sys_ref/api/carousels/:carouselId** - get carousel image by Id

* **POST protocol://domain:port/sys_ref/api/carousels** - add carousel photo

  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "multipart/form-data"}
  * request body: { "image": file }
  * note: photo files are deleted during operation

* **PATCH protocol://domain:port/sys_ref/api/carousels/:carouselId/primary** - toggle carousel photo's primary state

  * request header: { "x-access-token": "jwt-token-string" }

* **PATCH protocol://domain:port/sys_ref/api/carousels/:carouselId/order/:order** - update carousel order

  * request header: { "x-access-token": "jwt-token-string" }

* **DELETE protocol://domain:port/sys_ref/api/carousels/:carouselId** - delete a carousel image record by id

  * request header: { "x-access-token": "jwt-token-string" }

### tokens

* **POST protocol://domain:port/sys_ref/api/tokens** - apply for jwt token to access data modification end points

  * request header: { "Content-Type": "application/json"}
  * request body:

        { // all fields are required
          "email": "admin@nowhere.com",
          "loginId": "admin",
          "password": "0000",
          "botPrevention": ""
        }

### Login

* **POST protocol://domain:port/sys_ref/api/login/user**
  * request header: { "Content-Type": "application/json"}
  * request body:

        {
          email: "example@example.com",
          password: "**********",
        }

  * response data:

        {
          result: true,
          user_info: {
            id: 0,
            email: "example@example.com",
            name: "JS GROUP",
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
          msg: "",
        }

* **POST protocol://domain:port/sys_ref/api/login/admin**
  * request header: { "Content-Type": "application/json"}
  * request body:

        {
          account: "",
          password: "**********",
        }

  * response data:

        {
          result: true,
          admin_info: {
            id: 0,
            account: "",
            name: "",
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
          msg: "",
        }

* **POST protocol://domain:port/sys_ref/api/logout/user** - log out user token
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
        }

  * response data:

        {
          result: true,
        }

* **POST protocol://domain:port/sys_ref/api/logout/admin** - log out admin token
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
        }

  * response data:

        {
          result: true,
        }

* **POST protocol://domain:port/sys_ref/api/check/token** - check token exists and update token
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
        }

  * response data:

        {
          result: true,
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
          msg: "",
        }

### Series

* **GET protocol://domain:port/sys_ref/api/series** - get series list
  * response data:

        [
          {
            id: 0,
            name: "xxxx",
            list: [
              {
                id: 0,
                name: "xxxxx",
              },
            ]
          },
        ]

* **POST protocol://domain:port/sys_ref/api/series** - insert series
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          name: "xxxx",
          parent: 0,
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **PUT protocol://domain:port/sys_ref/api/series** - update series
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          id: 1
          name: "xxxx",
          parent: 0,
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **DELETE protocol://domain:port/sys_ref/api/series/:id** - delete series
  * response data:

        {
          result: true,
          msg: "xxxx",
        }

### Product

* **GET protocol://domain:port/sys_ref/api/product/:code/:page** - get product list by code
  * response data:

        {
          list: [
            {
              id: 0,
              name: "xxxx",
              photo_id: "",
            },
          ],
          current: 1,
          total: 2,
        }

* **GET protocol://domain:port/sys_ref/api/product/serach/:string/:page** - get product list by search string
  * response data:

        {
          list: [
            {
              id: 0,
              code: 0,
              series_name: "",
              name: "xxxx",
              photo_id: "",
            },
          ]
          current: 1,
          total: 10,
        }

* **GET protocol://domain:port/sys_ref/api/product/detail/:id** - get product deatil by product id
  * response data:

        {
          id: 0,
          code: 0,
          name: "xxxx",
          specification: "",
          description: "",
          photo_id: "",
        }

* **GET protocol://domain:port/sys_ref/api/product/hot** - get hot product list
  * response data:

        {
          list: [
            {
              id: 0,
              code: 0,
              series_name: "",
              name: "xxxx",
              photo_id: "",
            },
          ]
          current: 1,
          total: 10,
        }

* **GET protocol://domain:port/sys_ref/api/product/new** - get new product list
  * response data:

        {
          list: [
            {
              id: 0,
              code: 0,
              series_name: "",
              name: "xxxx",
              photo_id: "",
            },
          ]
          current: 1,
          total: 10,
        }

* **POST protocol://domain:port/sys_ref/api/product** - insert product
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          id: 0,
          code: "",
          name: "",
          specification: "",
          description: "",
          publish: "",
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **PUT protocol://domain:port/sys_ref/api/product** - update product
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          id: 0,
          code: "",
          name: "",
          specification: "",
          description: "",
          publish: "",
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **DELETE protocol://domain:port/sys_ref/api/product/:id** - delete series
  * request header: { "x-access-token": "jwt-token-string" }
  * response data:

        {
          result: true,
          msg: "xxxx",
        }

### USER

* **POST protocol://domain:port/sys_ref/api/user/register** - register user
  * request header: { "Content-Type": "application/json"}
  * request body:

        {
          email: "",
          name: "",
          password: "",
          address: "",
          contact: "",
        }

  * response data:

        {
          result: true,
          user_info: {
            id: 0,
            email: "example@example.com",
            name: "JS GROUP",
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mMCexXfI",
          msg: "xxxx",
        }

* **POST protocol://domain:port/sys_ref/api/user** - insert user
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          email: "",
          name: "",
          password: "",
          address: "",
          contact: "",
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **PUT protocol://domain:port/sys_ref/api/user** - update user
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          id: 0,
          name: "",
          password: "",
          address: "",
          contact: "",
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **DELETE protocol://domain:port/sys_ref/api/user/:id** - delete user
  * request header: { "x-access-token": "jwt-token-string" }
  * response data:

        {
          result: true,
          msg: "xxxx",
        }

### ADMIN

* **POST protocol://domain:port/sys_ref/api/admin** - insert admin
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          account: "",
          name: "",
          password: "",
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **PUT protocol://domain:port/sys_ref/api/user** - update admin
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          id: 0,
          name: "",
          password: "",
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **DELETE protocol://domain:port/sys_ref/api/user/:id** - delete admin
  * request header: { "x-access-token": "jwt-token-string" }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

### ORDER

* **POST protocol://domain:port/sys_ref/api/order** - insert order
  * request header: { "x-access-token": "jwt-token-string", "Content-Type": "application/json"}
  * request body:

        {
          user_id: 0,
          order_date: 0,
          remark: "",
          detail: [
            {
              product_id: 0,
              quantity: 1,
            },
          ],
        }

  * response data:

        {
          result: true,
          msg: "xxxx",
        }

* **GET protocol://domain:port/sys_ref/api/order** - get order list
  * response data:

        {
          {
            id: 0,
            user_id: 0,
            order_date: 0,
            remark: "",
            detail: [
              {
                product_id: 0,
                quantity: 1,
              },
            ],
          },
        }

## LICENSE

MIT © [ASJ Group] (chiayu.tsai.personal@gmail.com / papago75@gmail.com)
