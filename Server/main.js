//SERVIDOR NODEJS EN EL CUAL VAMOS A UTILIZAR EXPRESS

//al pakage.js le agregamos la dependencia nodemo para evitarnos
//el hecho de tener que reiniciar el servidor cada vezz que
//realizamos un cambio
//al pakage.json le agregamos un scrip start para que reinicie

//crearemos una variable express
//para utilizarlo instalamos la libreria por npm
var express = require('express');
//aplicacion a ejecutar en el servidor
var app = express();

//creamos el servidor en una variable server
var server = require('http').Server(app);//con el metodo server le pasamos la aplicacion express que creamos

//la variable io tendra toda la funcionalidad de los sockets
//io requerira la libreria socket.io y le pasamos como parametro el servidor
//instalamos la libreria

//servidor de socket
var io =  require('socket.io')(server);



//para poder usar la parte publica de nuestra aplicacion
//usamos un mideweare que trae express 'STATIC'
app.use(express.static('Client/js'));

///pasamos el PATH a
var pathHTML ='F:/Documents/GIT/Socket-3/Socket';

app.get('/index.html',function(req,res,next){
  res.status(200).sendFile(pathHTML+'/Client/index.html');

});
//en el caso de que no se ingrese el path se emitira un mensaje de error
app.use(function (req, res) {

    var html = `<!DOCTYPE html>
    <html long="en">
    <head>
      <meta charset= "UTF-8">
        <title>App con socket</title>
    </head>
    <body>
      <h1>404 Not Found</h1>
      </body>
    </html>`;
    res.status(404).send(html);

});
//con el comando on le decimos a nuestra aplicacion socket
//que escuche en un determinado mensaje que le llegue del navegador
//cuando reciba el mensaje "coneccion" ejecutara la funcion que recibe como parametro un socket
//array de todos los mensajes en el chat
var mensajes = [{
  est:0,
  msj:''}];

function respuesta (consulta){
  switch (consulta.text) {
    case 'hora':
      var dt = new Date();
      est=200;
      msj=dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds();
      break;

    case 'fecha':
      var dt = new Date();
      est=200;
      msj=dt.getDate()+':'+(dt.getMonth()+1)+':'+dt.getFullYear();

      break;

    default:
    est=500;
    msj='No Existe la opcion... intente nuevamente';

  }

  return {est,msj};
};

io.on("connection",function(socket){

  console.log('>> alguien se ha conectado con socket IP: '+socket.request.connection.remoteAddres+':'+socket.request.connection.remotePort);
  //aparte de imprimir por consola se emita el mensaje de abajo
  socket.emit('messages',mensajes);
  //escuchar el evento del cliente
  socket.on('new-message', function(data){
    //para guardar los mensajes para mostrarlos en el chat
    //vamos a almacenarlos en arreglos (podemos usar bd)
    info=respuesta(data);
  //  mensajes.push(info);

     // console.log(mensajes[mensajes.length]);
    //avisamos a todos los socket que ubieran en el servidor del
    //nuevo mensaje
    //funciona como un broadcast
    socket.emit('messages',info)
  });

  socket.on('disconnect', function(){

    console.log('>>> usuario desconectado'+socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort);

});

});



//Hacemos que el servidor creado escuche en el puerto definido
// mostramos por consola el mensaje "El Servidor se encuentra Activo"
server.listen(8081,function(){
  console.log("El Servidor se encuentra Activo en http://localhost:8081 ");
});
