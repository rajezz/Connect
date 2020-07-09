# Connect

A place where you can connect with everyone.

## About me

This application is created with NodeJs (ExpressJs) as back-end, MySql for database maintainence and JavaScript/jQuery as front-end.

## Setup

* Clone the repository.

### Database setup

* Create a mysql connection with below settings in [`MySql Community server`](https://dev.mysql.com/downloads/mysql/).
    * username: `root`
    * password: `root`
    * host: `localhost`
    * port: `3306`

* Run the below command in MySql Workbench to create a database with name `TestDB`.

```cmd
create database TestDB;
```

> (Database name must be `TestDB`).

* Switch to newly created database by running below command:

```cmd
use TestDB;
```

* Run below command to create necessary tables for the application:

```cmd
source <query.sql file path> Eg.C:\Project\dbdata\query.sql
```

> It will be located inside `<root directory>\dbdata\query.sql`.

### Running WebApp

Open command terminal and head back to WebApp root directory where `index.js` file is located and execute below command:

```cmd
node index.js
```

### Fake data generation

Since we have created a new database we need to populate them with data using `faker.js`.

Click [`here`](http://localhost:3000/generateposts) to Generate posts.

> Every time on clicking above link it will create 100 posts.

### Functionality

Once the above setup is completed. You can Register and Sign In to your account, where you can share `pictures` and `texts`, `like`, `comment` and `view` other's posts.
