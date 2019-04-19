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

let messages = []
const colorArr = [
  '#8AE234', // light lime
  '#FCE94F', // light yellow
  '#3987EB', // blue
  '#C662BB', // pink
  '#34E2E2', // light blue
]

io.on('connection', socket => {
  socket.username = socket.id
  socket.color = colorArr[Math.floor(Math.random() * 5)]

  messages.forEach(msg => {
    socket.emit('newmsg', {
      user: msg.user, 
      userip: msg.userip,
      color: msg.color,
      msg: msg.msg
    })
  })
  socket.broadcast.emit('newmsg', {
    user: socket.id,
    userip: socket.handshake.address,
    color: socket.color,
    msg: '[+] connected to chat'
  })

  socket.on('sendmsg', message => {
    messages.push({
      msg: message, 
      user: socket.username,
      userip: socket.handshake.address,
      color: socket.color
    })
    io.emit('newmsg', {
      user: socket.username, 
      userip: socket.handshake.address,
      color: socket.color,
      msg: message, 
    })
  })
  .on('setusername', username => {
    socket.broadcast.emit('newmsg', {
      user: socket.username,
      userip: socket.handshake.address,
      color: socket.color,
      msg: 'Set their UID to '+username
    })
    socket.username = username
  })
  .on('disconnect', reason => {
    io.emit('newmsg', {
      user: socket.username,
      userip: socket.handshake.address,
      color: socket.color,
      msg: '[-] left for: '+reason
    })
  })
})
