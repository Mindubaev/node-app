import sequelizePkg from 'sequelize';
let {DataTypes}=sequelizePkg;

export const NoteModel={
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:true
    },
    text:{
        type:DataTypes.STRING,
        allowNull:true
    }
}