export default class UserImageService{

    constructor(userImageRepository){
        this.userImageRepository=userImageRepository;
    }

    async findByUserId(UserId){
        return await this.userImageRepository.findOne({
            where:{UserId}
        })
        .catch(err=>{
            console.error("fetching with UserId="+UserId+" was failed");
            return null;
        });
    }

    async save(userImage){
        if (userImage.id){
            return await this.userImageRepository.update({
                image:userImage.image,
                UserId:userImage.UserId
            },{
                where:{id:userImage.id}
            }).then(res=>userImage).catch(err=>{
                console.error("Can not update "+JSON.stringify(userImageRepository)+" in DB");
                return null;
            });
        }else{
            return await this.userImageRepository.create({
                image:userImage.image,
                UserId:userImage.UserId
            }).then(res=>res.dataValues)
            .catch(err=>{
                console.error("Can not save "+JSON.stringify(userImageRepository)+" in DB");
                return null;
            });
        }
    }

}