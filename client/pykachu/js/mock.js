mockProcess = function(n) {
    var i = 1;
    while(i <= n) {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/process",
            content_type: 'application/json',
            data: {
                // Campos com regra de negocio do cliente
                cliente: 'FIVE IMPORTS COM. IMP &amp; EXP. LTDA - ME - Buscapé',
                cliente_id: '1135',
                solicitante: 'Joao Leite',
                // Campos Calculados pela Node
                // velocidade: Math.floor((Math.random()*10)+1),
                // termina_em: '39 min',
                // Campos obrigatorios pelo app.js
                // data_inicio: '10/10/2013 às 15:43:21',
                // data_fim: '10/10/2013 às 15:43:21',
                id: 162532134165234,
                titulo: 'Criar tag em grupo de tags já existente',
                passo_msg: 'Preparando Backup',
                passo_atual: Math.floor((Math.random()*49)+1),
                passo_total: Math.floor((Math.random()*100)+50),
                status: 1
            }
        });
        i++;
    };
}
//mockProcess(2)

finishProcess = function(process) {
    i = process.passo_atual;
    while(i < process.passo_total) {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/process/" + process.id + "/next",
            content_type: 'application/json',
            data: {
                id: process.id,
                passo_msg: 'Seguindo para o passo '
            }
        });

        for(j=0; j<1000; j++) {

        }
        i++;
    }
}