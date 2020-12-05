export default class MessageService{

    constructor(messageRepository,userService,userImageService){
        this.messageRepository=messageRepository;
        this.userService=userService;
        this.userImageService=userImageService;
    }

    async save(message){
        return this.messageRepository.create({
            text:message.text,
            UserId:message.UserId
        }).then(res=>res.dataValues).catch(err=>{
            console.error("Can not save "+JSON.stringify(message)+" in DB");
            return null;
        });
    }

    async findAll(){
        return this.messageRepository.findAll();
    }

    async findPageRequest(size,page){
        return await this.messageRepository.findAll({
            order:[
                ['id','DESC']
            ],
            limit:size,
            offset:(page-1)*size
        })
        .catch(err=>{
            console.error("fetching message page request was failed");
            return [];
        });
    }

    async findUserInfoByMessages(messages){
        let addedMessages=[];
        for (let message of messages){
            let outboxMessage = await this.convertMessageToOutbox(message);
            addedMessages.push(outboxMessage);
        }
        return addedMessages;
    }

    //{id:?,text:?,user:{id:?,username:?}}
    async convertMessageToOutbox(message){
        let UserId=message.UserId;
            let user = await this.userService.findById(UserId);
            return {
                id:message.id,
                text:message.text,
                user:{
                    id:user.id,
                    username:user.username
                }
            };
    }

}