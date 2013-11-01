// Constantes usadas
// ------------------------

STARTED = 1;
RUNNING = 2;
ERROR = -1;
FINISHED = 0;
PORT = 8080;

// ------------------------
// Inicializações
// ------------------------

var process = {};

var moment = require('moment');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(PORT);
app.use(express.bodyParser());

// ------------------------
// Funções que fazem requisições
// ------------------------


// Função a ser chamada quando um processo for iniciado
app.post('/process', function(request, response) {
    console.log("Criando novo processo");
    var json = request.body,
        processId = new Date().getTime() + Math.floor((Math.random()*10)+1);

    json.id = processId;
    json.data_inicio = moment();
    json.data_fim = null ;

    if(json.passos === undefined){
        json.passos = -1;
    }

    if(json.passo_atual === undefined){
        json.passo_atual = 0;
    }

    if(json.passo_msg === undefined){
        json.passo_msg = "Iniciando processo";
    }

    if(json.titulo === undefined){
        json.titulo = "Processo ["+ json.id+"]";
    }

    if(json.status === undefined){
        json.status = STARTED;
    }

    process[processId] = json;
    response.send(json);
});

// Função a ser chamada quando um processo passa para o próximo passo, se houver mais de um
app.post(/^\/process\/(\d+)\/next$/, function(request, response){
    console.log("Proximo Processo");

    var id = request.params[0];

    process[id]['step']++;
    msg_step = request.body.msg_step;

    if (msg_step !== undefined) {
        process[id]['msg_step'] = msg_step;
    }

    response.send(process[id]);
});

// Função a ser chamada para receber parâmetros de um processo
app.get(/^\/process\/(\d+)$/, function(request, response){
    console.log("Retornando processo");

    var id = request.params[0];
    response.send(process[id]);
});

// Função a ser chamada quando um processo tiver algum parâmetro mudado
app.put(/^\/process\/(\d+)$/, function(request, response){
    console.log("Atualizando Processo");

    var id = request.params[0],
        step = request.body.step,
        total = request.body.total,
        msg_step = request.body.msg_step,
        status = request.body.status;

    if(step !== undefined)
        process[id]['step'] = parseInt(step);
    if(total !== undefined)
        process[id]['total'] = parseInt(total);
    if(msg_step !== undefined)
        process[id]['msg_step'] = msg_step;
    if(status !== undefined)
        process[id]['status'] = parseInt(status);

    response.send(process[id]);
});

// Função a ser chamada quando algum processo é removido
app.delete(/^\/process\/(\d+)$/, function(request, response){
    console.log("Deletando processo");

    var id = request.params[0];

    delete process[id];

    response.send(process[id]);
});


io.sockets.on('connection', function (socket) {
  socket.on('_evento_de_deletar', function (data) {
    console.log(data);
  });
});

// ------------------------
// Comunicação com o client-side
// ------------------------

setInterval(function () {

    // Emite evento para ser capturado pelo client
	io.sockets.emit('news', process);
},1000);
