import express from 'express';
import session from 'express-session';
import ws from 'express-ws';
import connectPgSimple from 'connect-pg-simple';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

import {pgPool,User,Note,UserImage,Message} from './app/DataSource.mjs';

import UserService from "./app/services/UserService.mjs";
import NoteService from "./app/services/NoteService.mjs";
import UserImageService from "./app/services/UserImageService.mjs";
import MessageService from "./app/services/MessageService.mjs";

import UserController from './app/Controllers/UserController.mjs';
import NoteController from './app/Controllers/NoteController.mjs';
import MessageController from './app/Controllers/MessageController.mjs';

const SALT_ROUNDS=10;

export const startWorker=function(){
    dotenv.config();
    const app=express();
    const expressWs=ws(app);
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
            saveUninitialized: false,
            cookie: { maxAge: 5*60*1000 }
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
    let messageService=new MessageService(Message,userService,userImageService);

    let userController=new UserController(app,userService,noteService,userImageService,SALT_ROUNDS);
    let noteController=new NoteController(app,noteService);
    let messageController=new MessageController(app,expressWs,messageService,);

    const server=app.listen(Number(process.env.PORT));

    process.on("SIGTERM",()=>{
        server.close(()=>{
            process.exit(0);
        });
    });

}