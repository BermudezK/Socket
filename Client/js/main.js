//la variable socket utiliara la libreria io del lado del cliente
//para conectarse a nuestro servidor
var socket = io.connect('http://localhost:8081',{'forceNew':'false'});


//
socket.on('messages',function (data){
  render(data)
});


//funcionalidades para imprimir los mensajes que se encuentren
function render (data){
  //data es el conjunto de todos los mensajes en la sala
  console.log(data);
  var html=  `<div>
            <strong>${data.est}</strong>:
            <em>${data.msj}</em>
            </div>`;

//en que lugar ubicara esta informacion en el index.html
document.getElementById('messages').innerHTML =html;
}

function addMessage(evento){
  //objeto que enviaremos al servidor
  var aEnviar = {
    // author:document.getElementById('username').value,
    text:document.getElementById('texto').value
  };

  socket.emit('new-message',aEnviar);

  return false;
}
