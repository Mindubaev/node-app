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
        type:DataTypes.STRING(150),
        allowNull:true
    },
    text:{
        type:DataTypes.STRING(511),
        allowNull:true
    }
}