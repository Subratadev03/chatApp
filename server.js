const express   =   require('express');
const cors      =   require('cors');
const path      =   require('path')
const http      =   require('http')
const socketio  =   require('socket.io')
const {generateMessage, getUserLocation}  = require('./src/utils/message')
const { addUsers, getUser, getUserInRoom,removeUser }  = require('./src/utils/users')
require('dotenv').config();
// const cors      =   require('cors');
// require('dotenv').config();


const app       =   express()
const server    =   http.createServer(app)
const io        =   socketio(server)

app.use(express.json())   

const publicDirectoryPath  =    path.join(__dirname,'./public')
app.use(express.static(publicDirectoryPath));
var coreOptions =   {
    origin:'http://localhost:3000'
}

let count  = 0;

//Routes


//middleware
app.use(cors(coreOptions))
// app.use(express.json())
app.use(express.urlencoded({extended:true}))

//api
const  authRouter   = require('./routes/authenticationRoutes')
app.use('/api/auth',authRouter)



app.get('/',(req,res)=>{
    res.json({message:'Hello world'})
})


const PORT  = process.env.PORT || 3000



io.on('connection',(socket)=>{

    socket.on('join',(options, callback)=>{
        const {error,user}   =  addUsers({id:socket.id, ...options})
        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('Welocome!',user))
        socket.emit('connection',user)
        io.to(user.room).emit('userData',getUserInRoom(user.room))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined`,user));
    })


    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(message,user))
        callback('message delivered')
    })

    socket.on('shareLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',getUserLocation(user,`https:/google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        const user  = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('userData',getUserInRoom(user.room))
            io.to(user.room).emit("message",generateMessage(`${user.username} has leave`,user))
        }
    })    
})

server.listen(PORT,()=>{
    console.log(`Server running in port no ${PORT}`);
})