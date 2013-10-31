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

    console.log(json);
    response.send(json);
});

// Função a ser chamada quando um processo passa para o próximo passo, se houver mais de um
app.post(/^\/process\/(\d+)\/next$/, function(req, res){
    console.log("Proximo Processo");
    var id = req.params[0];
    process[Pykachu_id]['step']++;

    msg_step = req.body.msg_step;

    if (!(msg_step === undefined))
        process[Pykachu_id]['msg_step'] = msg_step;

    res.send(process[id]);
});

// Função a ser chamada para receber parâmetros de um processo
app.get(/^\/process\/(\d+)$/, function(req, res){
    console.log("Devolvendo processo");
    var id = req.params[0];
    res.send(process[id]);
});

// Função a ser chamada quando um processo tiver algum parâmetro mudado
app.put(/^\/process\/(\d+)$/, function(req, res){
    console.log("Atualizando Processo");
    var id = req.params[0];

    step = req.body.step;
    total = req.body.total;
    msg_step = req.body.msg_step;
    status = req.body.status;

    if (step !== undefined)
        process[id]['step'] = parseInt(step);
    if (total !== undefined)
        process[id]['total'] = parseInt(total);
    if (msg_step !== undefined)
        process[id]['msg_step'] = msg_step;
    if (status !== undefined)
        process[id]['status'] = parseInt(status);

    res.send(process[id]);
});

// Função a ser chamada quando algum processo é removido
app.delete(/^\/process\/(\d+)$/, function(req, res){
    console.log("Deletando processo");
    var id = req.params[0];
    delete process[id];
    res.send(process[id]);
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
