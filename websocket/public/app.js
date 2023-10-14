const socket = io();
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("msgInput");
const allMessages = document.getElementById("messages");

// print received message
socket.on("message", (message) => {
  console.log(message);
  const chat = document.createElement("li");
  chat.className = "message";
  chat.innerText = message;
  allMessages.appendChild(chat);
  window.scrollTo(0, document.body.scrollHeight);

});

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
 if(messageInput.value !==""){
     const message = messageInput.value;
     // console.log(message);
     socket.emit("user-message", message);
     messageInput.value = "";
    }
});
