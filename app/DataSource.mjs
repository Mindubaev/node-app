import sequelizePKG from 'sequelize';
import {UserModel} from './models/User.mjs';
import {NoteModel} from './models/Note.mjs';
import {UserImageModel} from './models/UserImage.mjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
export const pgPool=new pg.Pool({
    connectionString:process.env.DATABASE_URL
});

export const DataSource = new sequelizePKG.Sequelize(process.env.DATABASE_URL,{
    define: {timestamps: false},
});

export const User=DataSource.define("User",UserModel);
export const Note=DataSource.define("Note",NoteModel);
export const UserImage=DataSource.define("UserImage",UserImageModel);

User.hasMany(Note);
Note.belongsTo(User);

User.hasOne(UserImage);
