const express = require('express');
const path = require('path');
const app = express();

const http = require('http').createServer(app);


const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,'public')));


http.listen(port,()=>{
    console.log('listening on port '+port);
})


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
})



const io = require('socket.io')(http)

const users = {}

io.on('connection', socket =>{
    socket.on('new-user-join', name =>{
        users[socket.id] = name
        socket.broadcast.emit('user-joined',name)
    });


    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
    })

    socket.on('disconnect',name=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
    
})