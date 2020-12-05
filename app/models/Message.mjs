import sequelizePkg from 'sequelize';
let {DataTypes}=sequelizePkg;

export const MessageModel={
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    text:{
        type:DataTypes.STRING(256),
        allowNull:false
    }
}