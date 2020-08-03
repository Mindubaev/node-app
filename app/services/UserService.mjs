import { User } from "../DataSource.mjs";
import {newUserIsValid,userIsValid} from '../Validators/UserValidator.mjs';

export default class UserService{

    constructor(userRepository){
        this.userRepository=userRepository;
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
        return  await this.userRepository.findAll(
            {
                where:{username}
            })
        .catch(err=>[]);
    }

    async save(user){
        if (newUserIsValid(user))
            return await User.create({
                username:user.username,
                password:user.password
            }).catch(err=>null);
        if (userIsValid(user)){
            await User.update({
                username:user.username,
                password:user.password
            },
            {
                where:{id:user.id}
            });
            return this.findById(user.id);
        }
    }

}