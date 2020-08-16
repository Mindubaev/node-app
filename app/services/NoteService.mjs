import {newNoteIsValid,noteIsValid} from '../Validators/NoteValidator.mjs';

export default class NoteService{

    constructor(noteRepository){
        this.noteRepository=noteRepository;
    }

    async findById(id){
        return  await this.noteRepository.findOne(
            {
                where:{id}
            })
        .then(note=>(!note)? null : note)
        .catch(err=>{
            console.error("fetching with NoteId="+id+" was failed");
            return null;
        });
    }

    async findByUserId(UserId){
        return await this.noteRepository.findAll({
            where:{UserId}
        })
        .catch(err=>{
            console.error("fetching with UserId="+UserId+" was failed");
            return [];
        });
    }

    async findByUserIdPageRequest(UserId,size,page){
        return await this.noteRepository.findAll({
            where:{UserId},
            order:[
                ['id','DESC']
            ],
            limit:size,
            offset:(page-1)*size
        })
        .catch(err=>{
            console.error("fetching page request with UserId="+UserId+" was failed");
            return [];
        });
    }

    async countUserNotes(UserId){
        return await this.noteRepository.count({
            where:{UserId}
        })
        .catch(err=>{
            console.error("fetching note count with UserId="+UserId+" was failed");
            return [];
        });
    }

    async save(note){
        if (noteIsValid(note)){
            return await this.noteRepository.update({
                title:note.title,
                text:note.text,
                UserId:note.UserId
            },
            {
                where:{id:note.id}
            }).then(()=>{
                return note
            }).catch(err=>{
                console.error("Can not update "+JSON.stringify(note)+" in DB: "+err);
                return null;
            });
            // return this.findById(note.id);
        }else if (newNoteIsValid(note))
            return await this.noteRepository.create({
                title:note.title,
                text:note.text,
                UserId:note.UserId
            }).then(res=>res.dataValues).catch(err=>{
                console.error("Can not save "+JSON.stringify(note)+" in DB");
                return null;
            });
        console.error("invalide note - "+JSON.stringify(note)+" for saving");
        return null;
    }

    async delete(id){
        return await this.noteRepository.destroy({
            where:{
                id
            }
        }).then(res=>{
            console.log(res);
            return true;
        }).catch(err=>{
            console.error(res);
            return false;
        });
    }

}