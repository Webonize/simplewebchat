const socketio = require('socket.io')
const express = require('express')
const getip = require('./mod_getip')
const path = require('path')

const expressApp = express().use(express.static(path.resolve(__dirname, 'public')))

const appServer = expressApp.listen(3000,'0.0.0.0' , () => {
  const addr = 'http://'+getip.getLocalIP4()+':3000'
  console.log('\n-> Live chat has started\n  |_ Console  @ '+addr+'\n\n')
})

const io = socketio(appServer, {
  pingTimeout: 2500,
  pingInterval: 10000
})

const colorArr = [
  '#8AE234', // light lime
  '#FCE94F', // light yellow
  '#3987EB', // blue
  '#C662BB', // pink
  '#34E2E2', // light blue
]

io.on('connection', socket => {
  socket.username = socket.id
  socket.roomid = socket.id
  socket.color = colorArr[Math.floor(Math.random() * 5)]

  io.to(socket.roomid).emit('newmsg', {
    user: socket.id,
    userip: socket.handshake.address,
    color: socket.color,
    msg: '[+] connected to chat'
  })

  socket.on('sendmsg', message => {

    if (message === '/users') {
      let usersString = `Users in room ${socket.roomid} are: `
      for (const id in io.sockets.adapter.rooms[socket.roomid].sockets) usersString += io.sockets.sockets[id].username + ', '
      io.emit('newmsg', {
        user: 'system', 
        userip: 'localhost',
        color: '#8AE234',
        msg: usersString, 
      })
    } 
    else {
      io.to(socket.roomid).emit('newmsg', {
        user: socket.username, 
        userip: socket.handshake.address,
        color: socket.color,
        msg: message, 
      })
    }
  })
  .on('joinroom', roomid => {
    socket.leaveAll()
    socket.join(roomid)
    socket.roomid = roomid

    io.to(socket.roomid).emit('newmsg', {
      user: socket.username,
      userip: socket.handshake.address,
      color: socket.color,
      msg: `Joined this room (${roomid})`
    })
  })
  .on('setusername', username => {
    io.to(socket.roomid+'').emit('newmsg', {
      user: socket.username,
      userip: socket.handshake.address,
      color: socket.color,
      msg: 'Set their UID to '+username
    })
    socket.username = username
  })
  .on('disconnect', reason => {
    io.to(socket.roomid).emit('newmsg', {
      user: socket.username,
      userip: socket.handshake.address,
      color: socket.color,
      msg: '[-] left for: '+reason
    })
  })
})
