import express from 'express';
import bcrypt from 'bcrypt';

export default class UserController{

    constructor(app,userService,noteService,userImageService,saltRounds){
        this.app=app;
        this.userService=userService;
        this.noteService=noteService;
        this.userImageService=userImageService;
        this.saltRounds=saltRounds;
        this.jsonParser=express.json();
        this.handleGetUserImage();
        this.handlePostUserImage();
        this.handleGetUserNotesCount();
        this.handleGetUserNotesById();
        this.handleGetUserNotes();
        this.handleGetUserById();
        this.handelePostNewUser();
        this.handleLoginUser();
        this.handleGetUser();
        this.handleLogout();
        this.handleGetNotesByUserId();
        this.handlePutUser();
    }

    handleLoginUser(){
        this.app.post("/login",this.jsonParser,async (req,resp)=>{
            let user=req.body;
            if (!user || (user && (!user.username || !user.password)))
                resp.sendStatus(400);
            else{
                this.userService.getUserByUsernameAndPassword(user.username,user.password)
                .then(u=>{
                    if (u){
                        req.session.user=u;
                        resp.status(200);
                        resp.json({id:u.id,username:u.username});
                    }
                    else
                        resp.sendStatus(404); 
                });
            }
        });
    }

    handleGetUser(){
        this.app.get("/user",(req,resp)=>{
            let user=req.session.user;
            if (user){
                resp.status(200);
                resp.json({id:user.id,username:user.username});
            }
            else
                resp.sendStatus(404);
        });
    }

    handleLogout(){
        this.app.get("/logout",(req,resp)=>{
            req.session.destroy(err=>{
                console.log(err);
            });
            resp.sendStatus(200);
        });
    }

    handleGetUserNotesCount(){
        this.app.get("/user/notes/count",async (req,resp)=>{
            if (req.session.user){
                let userId=req.session.user.id;
                if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                    resp.sendStatus(400);
                else{
                    let count= await this.noteService.countUserNotes(userId);
                    if (!count && count!==0)
                        resp.sendStatus(404);
                    else{
                        resp.status(200);
                        resp.json({count});
                    }
                }
            }
            else
                resp.sendStatus(403);
        });
    }

    handleGetUserNotes(){
        this.app.get("/user/notes",async (req,resp)=>{
            if (req.session.user){
                let size=Number(req.query.size);
                let page=Number(req.query.page);
                let userId=req.session.user.id;
                if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                    resp.sendStatus(400);
                else{
                    let notes=null;
                    if (Number.isInteger(size) && Number.isInteger(page))
                        notes= await this.noteService.findByUserIdPageRequest(userId,size,page);
                    else
                        notes= await this.noteService.findByUserId(userId);
                    if (!notes)
                        resp.sendStatus(404);
                    else{
                        resp.status(200);
                        resp.json(notes);
                    }
                }
            }
            else
                resp.sendStatus(403);
        });
    }

    handleGetUserNotesById(){
        this.app.get("/user/:userId/notes",async (req,resp)=>{
            let userId=Number(req.params.userId);
            let size=Number(req.query.size);
            let page=Number(req.query.page);
            if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                resp.sendStatus(400);
            else{
                let notes=null;
                if (Number.isInteger(size) && Number.isInteger(page))
                    notes= await this.noteService.findByUserIdPageRequest(userId,size,page);
                else
                    notes= await this.noteService.findByUserId(userId);
                if (!notes)
                    resp.sendStatus(404);
                else{
                    resp.status(200);
                    resp.json(notes);
                }
            }
        });
    }

    handleGetUserById(){
        this.app.get("/user/:userId", async (req,resp)=>{
            let userId=Number(req.params.userId);
            if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                resp.sendStatus(400);
            else{
                let user=await this.userService.findById(userId);
                if (user===null)
                    resp.sendStatus(404);
                else{
                    resp.status(200);
                    resp.json({
                        id:user.id,
                        username:user.username
                    });
                }
            }
        });
    }

    handelePostNewUser(){
        this.app.post("/user",this.jsonParser,async (req,resp)=>{
            let user=req.body;
            if (!user)
                resp.sendStatus(400);
            else{
                if (!await this.userService.getUserByUsernameAndPassword(user.username,user.password)){
                    user.password=await bcrypt.hash(user.password,this.saltRounds);
                    user= await this.userService.save(user);
                    if (user){
                        await this.userImageService.save({UserId:user.id});
                        req.session.user=user;
                        resp.status(200);
                        resp.json({
                            id:user.id,
                            username:user.username
                        });
                    }
                    else
                        resp.sendStatus(400);
                }else
                    resp.sendStatus(400);
            }
        });
    }

    handlePutUser(){
        this.app.put("/user",this.jsonParser,async (req,resp)=>{
            let user=req.body;
            if (!user || (user && !(user.id)))
                resp.sendStatus(400);
            else{
                if (req.session.user.id===user.id ){
                    if (user.oldPassword
                        &&  await bcrypt.compare(user.oldPassword,req.session.user.password)   
                        && !(await this.userService.getUserByUsernameAndPassword(user.username,user.password))
                    ){
                        user.password=await bcrypt.hash(user.password,this.saltRounds);
                        delete user.oldPassword;
                        user= await this.userService.save(user);
                    }else if (
                        !(user.oldPassword)
                        && await bcrypt.compare(user.password,req.session.user.password)
                        && !(await this.userService.getUserByUsernameAndPassword(user.username,user.password))
                    ){
                        user.password=await bcrypt.hash(user.password,this.saltRounds)
                        user= await this.userService.save(user);
                    }else
                        user= null;
                    if (user){
                        req.session.user=user;
                        resp.status(200);
                        resp.json({
                            id:user.id,
                            username:user.username
                        });
                    }
                    else
                        resp.sendStatus(400);
                }else
                    resp.sendStatus(403);
            }
        });
    }

    handleGetNotesByUserId(){
        this.app.get("/user/:userId/notes",async (req,resp)=>{
            let userId=Number(req.params.userId);
            if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                resp.sendStatus(400);
            else{
                let notes= await this.noteService.findByUserId(userId);
                if (!notes)
                    resp.sendStatus(404);
                else{
                    resp.status(200);
                    resp.json(notes);
                }
            }
        });
    }

    handleGetUserImage(){
        this.app.get("/user/:id/image",async (req,resp)=>{
            let userId=Number(req.params.id);
            if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                resp.sendStatus(400);
            else{
                let userImage=await this.userImageService.findByUserId(userId);
                if (userImage){
                    if (userImage.image){
                        resp.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': userImage.image.length
                        });
                        resp.end(userImage.image);
                    }
                    else{
                        resp.redirect("/profile.png");
                    }
                }else
                    resp.sendStatus(404);
            }
        });
    }

    handlePostUserImage(){
        this.app.post("/user/:id/image",async (req,resp)=>{
            let userId=Number(req.params.id);
            if (!Number.isInteger(userId) ||  (Number.isInteger(userId) && userId<0))
                resp.sendStatus(400);
            else{
                if (req.files.image && req.files.image.mimetype==='image/png'){
                    let userImage = await this.userImageService.findByUserId(userId);
                    userImage.image=req.files.image.data;
                    userImage=await this.userImageService.save(userImage);
                    if (userImage)
                        resp.sendStatus(200);
                    else
                        resp.sendStatus(500);
                }else{
                    resp.sendStatus(400);
                }
            }
        });
    }

}
