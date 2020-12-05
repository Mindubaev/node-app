export default class MessageController{

    constructor(app,expressWs,messageService){
        this.app=app;
        this.messageService=messageService;
        this.handleGetMessages();
        this.handleGetMessagesPageRequest();
        this.wss=expressWs.getWss();

        this.app.ws("/chat",async (ws, req)=> {
            ws.route="/chat";

            ws.on('message',async (msg)=> {
                msg=JSON.parse(msg);
                if (msg && msg.text && msg.UserId){
                    msg=await this.messageService.save(msg);
                    msg=await this.messageService.convertMessageToOutbox(msg);
                    Array.from(
                        this.wss.clients
                    ).filter((sock)=>{
                        return sock.route == '/chat' 
                    }).forEach((client)=>{
                        client.send(JSON.stringify(msg));
                    });
                }

            });

        });
    }

    handleGetMessages(){
        this.app.get("/messages",async (req,resp)=>{
            let messages=await this.messageService.findAll();
            messages=await this.messageService.findUserInfoByMessages(messages);
            resp.status(200);
            resp.json(messages);
        });
    }

    handleGetMessagesPageRequest(){
        this.app.get("/messages",async (req,resp)=>{
            let size=Number(req.query.size);
            let page=Number(req.query.page);
            let messages=null;
            if (Number.isInteger(size) && Number.isInteger(page))
                messages= await this.messageService.findPageRequest(size,page);
            else
                messages= await this.noteService.findAll();
            if (!messages)
                resp.sendStatus(404);
            else{
                messages=await this.messageService.findUserInfoByMessages(messages);
                resp.status(200);
                resp.json(messages);
            }
        });
    }

}