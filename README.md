# Product Catalog
simple product catalog website and backend with product data, user and client management functionalities suitable for small businesses, written with react and node.js

## Install
### instructions pending

## Usage
### CLI Commands
### gulp
```
gulp backupDotEnv - copy a skeleton copy of .env to ./src/workflow/backup/blank.env
glup removeLogs - remove *.log from the entire project file structure
gulp resetDatabase - 將資料庫淨空或者淨空後再填入基本/MOCK資料
  options:
    -- setting (development | staging | production) 由 config/database.js 取得指定淨空的資料庫連線設定. 預設: 'development'
    -- seed (default | mock | none)
      default: 基本資料，由使用者定義
      mock: 除了基本資料，另外再由系統亂數產生資料
      none (預設): 不植入資料 (空白資料庫)
```
### npm
```
npm lint-backend - lint backend code
npm watch-server - start server in development mode with nodemon
```

## API
GET /SYS_REF - index.html and public assets

## License
MIT © [ASJ Group](chiayu.tsai.personal@gmail.com)
