import sequelizePkg from 'sequelize';
let {DataTypes}=sequelizePkg;

export const UserImageModel={
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    image:{
        type:DataTypes.BLOB,
        allowNull:true
    }
}