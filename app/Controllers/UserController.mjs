import express from 'express';

export default class UserController{

    constructor(app,userService){
        this.app=app;
        this.userService=userService;
        this.jsonParser=express.json();
        this.handleGetUserById();
        this.handelePostNewUser();
        this.handleLoginUser();
        this.handleGetUser();
        this.handleLogout();
    }

    // static async build (app,userService) {//альтернатива
    //     let userController=new UserController(app,userService);
    //     userController.handleGetUser();
    //     return userController;
    // }

    handleLoginUser(){
        this.app.post("/login",this.jsonParser,async (req,resp)=>{
            let user=req.body;
            if (!user || (user && (!user.username || !user.password)))
                resp.sendStatus(400);
            let users=this.userService.findByUsername(user.username);
            users=users.filter(u=>u.password===user.password);//!
            if (users.length===1){
                req.session.user=users[0];
                resp.status(200);
                resp.json({id:users[0].id,username:users[0].username});
            }
            else
                resp.sendStatus(404);
        });
    }

    handleGetUser(){
        this.app.get("/user",(req,resp)=>{
            let user=req.session.user;
            if (user)
                resp.json({id:user.id,username:user.username});
            resp.sendStatus(404);
        });
    }

    handleLogout(){
        this.app.get("/logout",(req,resp)=>{
            req.session.destroy(err=>{
                console.log(err);
                resp.sendStatus(400);
            });
            resp.sendStatus(200);
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
                    resp.json({id:user.id,username:user.username});
                }
            }
        });
    }

    handelePostNewUser(){
        this.app.post("/user",this.jsonParser,async (req,resp)=>{
            if (!req.body)
                resp.sendStatus(400);
            else{
                let user=this.userService.save(req.body);
                if (user){
                    resp.status(200);
                    resp.json(user);
                }
                resp.sendStatus(400);
            }
        });
    }

}
