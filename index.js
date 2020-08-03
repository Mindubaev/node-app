import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import {DataSource,User,Note} from './app/DataSource.mjs';
import UserController from './app/Controllers/UserController.mjs';
import UserService from "./app/services/UserService.mjs";
import morgan from 'morgan'

console.log("Update SQL schema...");
DataSource.sync()
.then(result=>console.log(result))
.catch(err=> console.log(err));
console.log("SQL schema was updated");

console.log("Start http server...");
const app=express();
var pgSession=connectPgSimple(session);

app.use(morgan('short'));
app.use(session({
        // store:new pgSession({
        //     conString:'postgres://postgres:root@localhost:5432/NodeDB'
        // }),
        secret:"09Vj752Ys",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3 * 60 * 1000 }
    }));

let userService=new  UserService(User);
let userController=new UserController(app,userService);

app.listen(8080);
console.log("Server started");