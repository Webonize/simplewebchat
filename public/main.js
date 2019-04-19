const socket = io('/', {
  forceNew: false
});
const input = document.getElementById('input')
const el = document.getElementById('main')
const notification = document.getElementById('notification')
let canPlayNotification = false

socket.on('newmsg', data => {

  const scrollDown = el.scrollTop - el.scrollHeight + el.clientHeight >= -5
  const urlReg = /(https?:\/\/)?([a-z0-9\.\-]*)\.([a-z0-9]{2,9})(\:[0-9]{1,5})?([\/\#\?]?(.*))/ig
  const msgWithUrl = data.msg.replace(urlReg, '<a href="$1" target="blank">$2$3.$4</a>')

  el.innerHTML += `<pre style="margin:0;padding:5px 0;color:${data.color};">${data.user}@${data.userip}~ ${msgWithUrl}</pre>`
  if (scrollDown) el.scrollTop = el.scrollHeight
  if (!document.hasFocus() && canPlayNotification) notification.play()
})


input.onkeydown = function(e) {
  if (e.key == "Enter" && !e.shiftKey && /[^\n\r\s]+/.test(input.value)) {
    socket.emit('sendmsg', input.value)
    input.value = ''
    input.style.height = ''
    e.preventDefault()
  }
}


setTimeout(() => canPlayNotification = true, 1500)
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function getUidFromuser() {
  let username = null
  username = prompt('Enter your displayname')
  while (!/[a-zA-Z0-9]+/gi.test(username)) {
    username = prompt('Enter your displayname')
    console.log(/[a-zA-Z0-9]+/gi.test(username))
  }
  setCookie('username', username)
  socket.emit('setusername', getCookie('username'))
}
if (getCookie('username') === null) {
  getUidFromuser()
} else {
  socket.emit('setusername', getCookie('username'))
}