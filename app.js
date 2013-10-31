var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();



STARTED = 1;
RUNNING = 2;
ERROR = -1;
FINISHED = 0;

var process = {};

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.use(express.bodyParser());

//StartProcess - Pykachu
app.post('/process', function(req, res) {
    console.log("Criando novo processo");
    Pykachu_id = new Date().getTime() + Math.floor((Math.random()*10)+1);
    ret = "Start Pykachu;id="+Pykachu_id;

    process[Pykachu_id] = {
        id: Pykachu_id ,
        step: 0,
        total: -1,
        msg_step: '',
        status: STARTED
    };

    total = req.body.total;
    msg_step = req.body.msg_step;

    if (!(total === undefined))
        process[Pykachu_id]['total'] = parseInt(total);
    if (!(msg_step === undefined))
        process[Pykachu_id]['msg_step'] = msg_step;

    console.log(process[Pykachu_id]);
    res.send(process[Pykachu_id]);
});

// Next Step - Pykachu
app.post(/^\/process\/(\d+)\/next$/, function(req, res){
    console.log("Proximo Processo");
    var id = req.params[0];
    process[Pykachu_id]['step']++;

    msg_step = req.body.msg_step;

    if (!(msg_step === undefined))
        process[Pykachu_id]['msg_step'] = msg_step;

    res.send(process[id]);
});

// GetProcess - Pykachu
app.get(/^\/process\/(\d+)$/, function(req, res){
    console.log("Devolvendo processo");
    var id = req.params[0];
    res.send(process[id]);
});

// DeleteProcess - Pykachu
app.put(/^\/process\/(\d+)$/, function(req, res){
    console.log("Atualizando Processo");
    var id = req.params[0];

    step = req.body.step;
    total = req.body.total;
    msg_step = req.body.msg_step;
    status = req.body.status;

    if (!(step === undefined))
        process[id]['step'] = parseInt(step);
    if (!(total === undefined))
        process[id]['total'] = parseInt(total);
    if (!(msg_step === undefined))
        process[id]['msg_step'] = msg_step;
    if (!(status === undefined))
        process[id]['status'] = parseInt(status);

    res.send(process[id]);
});

// DeleteProcess - Pykachu
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

setInterval(function () {
	
	io.sockets.emit('news', process);
	
},1000);