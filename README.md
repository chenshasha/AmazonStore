
===========
AmazonStore
===========

Amazon Store node.js

This application intends to test the performance of the node.js application with or without connection pooling and caching.
The connection pooling and caching layer were self implemented without using plugins.


## Instructions

If you would like to download the code and try it for yourself:

1. Clone the repo
2. Install packages: `npm install`
3. Change out the database configuration in config/database.js
4. Launch: `node server.js`
5. Visit in your browser at: `http://localhost:8080`

## How to test the application with different databases, cache, and connection pooling.

1. test with mongodb only
    1.1 in servers.js comment out other routes*.js files
    1.2 include the following codes
    //use mongodb only
      require('./app/routes.js')(app, passport);
      var configDB = require('./config/database.js');
      mongoose.connect(configDB.url); // connect to our database
      var db = mongoose.connection;


2. test with mongodb and mysql without caching or connection pooling
    2.1 in servers.js comment out other routes*.js files
    2.2 include the following code
        require('./app/routes-mysql&mongo.js')(app, passport);
    2.3 change the mysql connection setting in the routes-mysql&mongo.js file
    2.4 run the sql.dump file to populate the database

3. test with mongodb and mysql with caching
    3.1 in servers.js comment out other routes*.js files
    3.2 include the following code
        require('./app/routes-caching.js')(app, passport);
    3.3 change the mysql connection setting in the routes-caching.js file
    3.4 run the sql.dump file to populate the database

4. test with mongodb and mysql with connection pooling
    3.1 in servers.js comment out other routes*.js files
    3.2 include the following code
        require('./app/routes-pooling.js')(app, passport);
    3.3 change the mysql connection setting in the routes-pooling.js file
    3.4 run the sql.dump file to populate the database