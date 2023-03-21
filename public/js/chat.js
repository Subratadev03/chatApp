const socket = io()
const $messageForm   = document.querySelector('#form-submit')
const $formInput     = $messageForm.querySelector('input')
const $formButton    = $messageForm.querySelector('button')
const $sendLocation  = document.querySelector("#send-location")
const $message       = document.querySelector('#message')
const $locations     = document.querySelector('#location')
const $roomName      =  document.querySelector('#room-name')
const $chatList      =  document.querySelector('#chat-list')


const messageTemplet       =    document.querySelector('#message-template').innerHTML
const roomTemplate         =    document.querySelector("#room-template").innerHTML
const locationTemplate     =    document.querySelector("#location-template").innerHTML
const chatListTemplate     =    document.querySelector('#chatlist-template').innerHTML
const {username, room}     =    Qs.parse(location.search,{ignoreQueryPrefix:true})


socket.on('message',(message)=>{
    const html  = Mustache.render(messageTemplet,{
        message:message.text,
        user:message.user,
        room:message.room,
        createdAt:moment(message.createdAt).format('h:mm a')
    })

    $message.insertAdjacentHTML('beforeend',html)
})

socket.on('connection',(user)=>{
    const roomHtml  =   Mustache.render(roomTemplate,{
        room:user.room 
    })
    $roomName.insertAdjacentHTML('beforeend',roomHtml)

})

socket.on('locationMessage',(url)=>{
    const html  = Mustache.render(locationTemplate,{
        url:url.url,
        user:url.user,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $locations.insertAdjacentHTML('beforeend',html);

    console.log(url)
})

socket.on('userData',(user)=>{
    const html  =   Mustache.render(chatListTemplate,{
        users:user
    })    
    $chatList.insertAdjacentHTML('beforeend',html)
    console.log(user)
})


// var el = document.getElementById('increment');
// console.log(el);
// if(el){
//   el.addEventListener('click', swapper, false);
// }
document.querySelector('#form-submit').addEventListener('submit',(e)=>{
    e.preventDefault()
    // console.log('Clicked')
    $formButton.setAttribute('disabled','disabled')
    const message  = document.querySelector('#message_input').value
    // console.log(message)
    socket.emit('sendMessage',message,(error)=>{
        $formButton.removeAttribute('disabled')
        $formInput.value = ''
        $formInput.focus();
        if(error)
        {
            return console.log(error)
        }
    })
})
document.querySelector("#send-location").addEventListener('click',(e)=>{
    $sendLocation.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        alert('Geolocation not supported')
    }
    else{
        navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('shareLocation',{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },()=>{
                $sendLocation.removeAttribute('disabled')
                // console.log('shared location')
            })
            // console.log(position.coords.latitude);
        })
    }
})

socket.emit('join',{username,room},(error)=>{
    console.log(error)
    if(error)
    {
        alert("user already using")
        location.href = '/'
    }
})

