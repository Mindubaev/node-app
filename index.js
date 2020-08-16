import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import {DataSource,pgPool,User,Note,UserImage} from './app/DataSource.mjs';
import UserController from './app/Controllers/UserController.mjs';
import UserService from "./app/services/UserService.mjs";
import NoteController from './app/Controllers/NoteController.mjs';
import NoteService from "./app/services/NoteService.mjs";
import UserImageService from "./app/services/UserImageService.mjs";
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

const SALT_ROUNDS=10;
dotenv.config();

console.log("Update SQL schema...");
DataSource.sync({force:true})
.then(result=>console.log(result))
.catch(err=> console.log(err));
console.log("SQL schema was updated");

console.log("Start http server...");
const app=express();
let pgSession=connectPgSimple(session);

app.use(morgan('short'));
app.use(cookieParser());
app.use(express.static(process.cwd()+"/public"));
app.use(fileUpload({
    limits:{fileSize:50*1024*1024},
    debug:true,
    tempFileDir:"/tmp/",
    // useTempFiles:true
}));

app.use(session({
        store:new pgSession({
            pool:pgPool
        }),
        secret:"09Vj752Ys",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 10 * 60 * 1000 }
    }));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header("Access-Control-Allow-Origin", process.env.Access_Control_Allow_Origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
let userImageService=new UserImageService(UserImage);
let userService=new UserService(User,SALT_ROUNDS);
let noteService=new NoteService(Note);
let userController=new UserController(app,userService,noteService,userImageService,SALT_ROUNDS);
let noteController=new NoteController(app,noteService);

app.listen(Number(process.env.PORT));
console.log("Server started");