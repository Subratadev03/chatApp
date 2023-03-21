const generateMessage = (text,user)=>{
    return {
        user:user.username,
        room:user.room,
        text ,
        createdAt:new Date().getTime()
    }
}


const getUserLocation = (user,url) => {
    return {
        user:user.username,
        room:user.room,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    getUserLocation
}