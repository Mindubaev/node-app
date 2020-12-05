import sequelizePKG from 'sequelize';
import {UserModel} from './models/User.mjs';
import {NoteModel} from './models/Note.mjs';
import {UserImageModel} from './models/UserImage.mjs';
import {MessageModel} from './models/Message.mjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();//Подгружаем переменные среды из env.
export const pgPool=new pg.Pool({
    connectionString:process.env.DATABASE_URL
});

export const DataSource = new sequelizePKG.Sequelize(process.env.DATABASE_URL,{
    define: {timestamps: false},
});//конфигурируем подключение

export const User=DataSource.define("User",UserModel);//объявляем модели 
export const Note=DataSource.define("Note",NoteModel);
export const UserImage=DataSource.define("UserImage",UserImageModel);
export const Message=DataSource.define("Message",MessageModel);

User.hasMany(Note);//создаём связи
Note.belongsTo(User);

User.hasOne(UserImage);

User.hasMany(Message);
Message.belongsTo(User);
