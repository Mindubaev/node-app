import sequelizePkg from 'sequelize';
let {DataTypes}=sequelizePkg;


export const UserModel={
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,


    }
}