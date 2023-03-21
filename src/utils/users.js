const db            =   require('../../models')
const bcrypt = require('bcrypt');
const userModel     =   db.user
const users         =   []

const addUsers = ({id,username,room}) =>{
    if(!username || !room)
    {
        return {
            error:"Username and room required"   
        }

    }
    const hashedPassword =  bcrypt.hash('1234', 10);


    const isExist =  userModel.findOne({
        where:{
            email: username
            // email: req.body.email
        }
    })
    console.log(isExist)
    if(!isExist) {
        // return res.status(400).json({ message: 'Email already exists.' });
        const data =  userModel.create({
            name: username,
            email: username,
            password: '12354'
        });
        console.log(data)

    }
 
    const existingUser     =    users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser)
    {
        return {
            error:"User already exist"
        }
    }
    room = room.trim().toLowerCase()

    const user = {id,username,room}
    users.push(user)
    return{user}

}

const removeUser = (id)=>{
    const index  = users.findIndex((user)=> user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user)=> user.id === id)
}
const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}

module.exports ={
    addUsers,
    getUser,
    getUserInRoom,
    removeUser
}