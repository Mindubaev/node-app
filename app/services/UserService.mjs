import {newUserIsValid,userIsValid} from '../Validators/UserValidator.mjs';
import bcrypt from 'bcrypt';

export default class UserService{

    constructor(userRepository,saltRounds){
        this.userRepository=userRepository;
        this.saltRounds=saltRounds;
    }

    async findById(id){
        return  await this.userRepository.findOne(
            {
                where:{id}
            })
        .then(user=>(!user)? null : user)
        .catch(err=>null);
    }

    async findByUsername(username){
        let users = await this.userRepository.findAll({
            where:{username}
        })
        .catch(err=>[]);
        return users;
    }

    async save(user){
        if (userIsValid(user)){
            return await this.userRepository.update({
                username:user.username,
                password:user.password
            },
            {
                where:{id:user.id}
            }).then(u=>user)
            .catch(err=>{
                console.error(err);
                return null;
            });
        }else if (newUserIsValid(user))
            return await this.userRepository.create({
                username:user.username,
                password:user.password
            }).then(resp=>resp.dataValues)
            .catch(err=>{
                console.error(err);    
                return null;
            });
    }

    delete(user){
        if (userIsValid(user))
            this.userRepository.destroy({
                where:{
                    id:user.id
                }
            }).then(res=>console.log(res));
        else
            console.error("invalide user - "+JSON.stringify(user)+" for removing");
    }

    async asyncFilter(arr, predicate){
        return arr.reduce(async (memo, e) =>
            await predicate(e) ? [...await memo, e] : memo
        , []);
    }

    async getUserByUsernameAndPassword(username,password){
        let users= await this.findByUsername(username);
        let passwordCompare=async (u)=>bcrypt.compare(password,u.password);
        return await this.asyncFilter(users,passwordCompare).then(filteredUser=>{
            if (filteredUser.length>0)
                return filteredUser[0];
        });
    }

}