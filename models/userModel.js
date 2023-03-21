module.exports = (sequelize, DataTypes)=> {
    const User    = sequelize.define('users',{
        name: {
            type: DataTypes.STRING 
        },
        email: {
            type: DataTypes.STRING, 
            isUnique :true,
            allowNull:false,
            validate:{
                isEmail : true
            }
        },
        password: {
            type: DataTypes.STRING 
        }
    })
    return User;
}