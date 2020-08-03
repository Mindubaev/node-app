import sequelizePKG from 'sequelize';
import {UserModel} from './models/User.mjs';
import {NoteModel} from './models/Note.mjs';

export const DataSource = new sequelizePKG.Sequelize("NodeDB","postgres","root",{
    dialect:"postgres",
    host: "localhost",
    define: {timestamps: false}
});

export const User=DataSource.define("User",UserModel);
export const Note=DataSource.define("Note",NoteModel);

User.hasMany(Note);
Note.belongsTo(User);
