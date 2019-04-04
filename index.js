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

io.on('connection', socket => {
  socket.username = socket.id
  messages.forEach(msg => {
    socket.emit('newmsg', {user: msg.user, msg: msg.msg})
  })
  socket.broadcast.emit('newmsg', {
    user: '',
    msg: '[+] '+socket.id+' connected'
  })

  socket.on('sendmsg', message => {
    messages.push({msg: message, user: socket.username})
    io.emit('newmsg', {
      user: socket.username, 
      msg: message, 
    })
  })
  .on('setusername', username => {
    socket.broadcast.emit('newmsg', {
      user: '',
      msg: 'User '+socket.username+' set their UID to '+username
    })
    socket.username = username
  })
  .on('disconnect', reason => {
    io.emit('newmsg', {
      user: '',
      msg: '[-] '+socket.username+' left - reason: '+reason
    })
  })
})
