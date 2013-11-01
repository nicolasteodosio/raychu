// Constantes usadas
// ------------------------

STARTED = 1;
RUNNING = 2;
ERROR = 3;
FINISHED = 0;
PORT = 8080;
MOMENT_DATETIME_STRING = "DD/MM/YYYY HH:mm:ss";

// ------------------------
// Inicializações
// ------------------------

var process = {};

var moment = require('moment');
moment.lang('pt-br');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: false });
server.listen(PORT);
app.use(express.bodyParser());

// ------------------------
// Funções que fazem requisições
// ------------------------


//TODO: Criar o POST de erro

// Função a ser chamada quando um processo for iniciado
app.post('/process', function(request, response) {
    console.log("Criando novo processo");
    var json = request.body,
        processId = new Date().getTime() + Math.floor((Math.random()*10)+1);

    json.id = processId;
    json.data_inicio = moment().format(MOMENT_DATETIME_STRING);
    json.data_fim = null ;

    if(json.passo_total === undefined){
        json.passo_total = -1;
    }
    json.passo_total = parseInt(json.passo_total);

    if(json.passo_atual === undefined){
        json.passo_atual = 0;
    }
    json.passo_atual = parseInt(json.passo_atual);

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

// Função a ser chamada quando um processo passa para o próximo passo_total, se houver mais de um
app.post(/^\/process\/(\d+)\/next$/, function(request, response){
    var id = request.params[0];

    process[id]['passo_atual']++;
    passo_msg = request.body.passo_msg;

    //Acabou
    if (process[id]['passo_total'] == process[id]['passo_atual']){
        process[id]['status'] = FINISHED;
        process[id]['data_fim'] = moment().format(MOMENT_DATETIME_STRING);
        process[id]['data_duracao'] = moment(process[id]['data_fim'], MOMENT_DATETIME_STRING).from(moment(process[id]['data_inicio'], MOMENT_DATETIME_STRING));
    }
    else{
        process[id]['status'] = RUNNING;
    }

    response.send(process[id]);
});

// Função a ser chamada para receber parâmetros de um processo
app.get(/^\/process\/(\d+)$/, function(request, response){
    var id = request.params[0];
    response.send(process[id]);
});

// Função a ser chamada quando um processo tiver algum parâmetro mudado
app.put(/^\/process\/(\d+)$/, function(request, response){
    var id = request.params[0],
        passo_atual = request.body.passo_atual,
        passo_total = request.body.passo_total,
        passo_msg = request.body.passo_msg,
        status = request.body.status;

    if(passo_total !== undefined)
        process[id]['passo_total'] = parseInt(passo_total);

    if(passo_atual !== undefined)
        process[id]['passo_atual'] = parseInt(passo_atual);

    if(passo_msg !== undefined)
        process[id]['passo_msg'] = passo_msg;

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
