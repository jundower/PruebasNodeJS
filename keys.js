module.exports = {
    options: {
        config: {
            userName: 'DB_A2CA98_ErpWebSystems_admin',
            password: 'Solu123456',
            server: 'SQL5097.site4now.net',
            database: 'DB_A2CA98_ErpWebSystems'
        },
        idleTimeout : 90000 ,
    },
    database: {
        user: 'DB_A2CA98_ErpWebSystems_admin',
        password: 'Solu123456',
        server: 'SQL5097.site4now.net',
        database: 'DB_A2CA98_ErpWebSystems',
        options:{
            enableArithAbort: true
        }
    }
};




/*

    "bcryptjs": "^2.4.3",
    "connect-flash": "^0.1.1",
    "connect-tedious": "^1.1.2",
    "express": "^4.17.1",
    "express-handlebars": "^3.1.0",
    "express-session": "^1.17.0",
    "jsreport-chrome-pdf": "^1.8.0",
    "jsreport-core": "^2.9.0",
    "jsreport-handlebars": "^2.1.0",
    "morgan": "^1.9.1",
    "mssql": "^6.0.0",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "puppeteer": "^5.2.1",
    "qrcode": "^1.4.4",
    "serve-favicon": "^2.5.0",

    npm i bcryptjs connect-flash connect-tedious express express-handlebars express-session jsreport-chrome-pdf jsreport-core jsreport-handlebars morgan mssql passport passport-local puppeteer qrcode serve-favicon
    
    npm i connect-tedious express express-handlebars express-session morgan mssql serve-favicon
    npm i bcryptjs connect-flash 
    npm i passport passport-local
    npm i qrcode
    npm i jsreport-chrome-pdf jsreport-core jsreport-handlebars puppeteer 
    
    npm i nodemon -D

mkdir src
cd src
mkdir lib public routes views
cd..
npm init --yes 
npm install serve-favicon

npm install jsreport-core
npm install jsreport-handlebars
npm install puppeteer jsreport-chrome-pdf
npm install --save qrcode
npm install got
npm install scrapeIt
got y scrapeit rebotan error de header char

*/