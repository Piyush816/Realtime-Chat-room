const socket = io();

function append(name, message, type) {
  const messagearea = document.getElementById("messagearea");
  const msgbody = document.createElement("div");
  msgbody.innerHTML = `<div class="${type} messages">
    <h4>${name}</h4>
    <p>${message}</p>
  </div>`;

  messagearea.append(msgbody);
}

let notify = new Audio('tune.mp3')


function sendmssg() {
  let mssg = document.getElementById("usertext").value;
  socket.emit("send", mssg);
  append("you", mssg, "outgoing");
  mssg = document.getElementById("usertext").value = ''
}

const name = prompt("Enter your name please");
socket.emit("new-user-join", name);

socket.on("user-joined", (name) => {
  append(name, "has joined the chat", "incoming");
  notify.play()
});

socket.on("receive", data=> {
  append(data.name,data.message,"incoming");
  notify.play()
});

socket.on("left", name => {
  append(name,'left the chat',"incoming");
  notify.play()
});
