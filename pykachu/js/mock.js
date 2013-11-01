mockProcess = function(n) {
    var i = 0;
    while(i <= n) {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/process",
            content_type: 'application/json',
            data: {
                // Campos com regra de negocio do cliente
                cliente: 'FIVE IMPORTS COM. IMP & EXP. LTDA - ME - Buscapé',
                cliente_id: '1135',
                solicitante: 'Joao Leite',
                // Campos Calculados pela Tela
                velocidade: '10/s',
                termina_em: '39 min',
                // Campos obrigatorios pelo app.js
                id: 162532134165234,
                titulo: 'Criar tag em grupo de tags ja existentii',
                data_inicio: '10/10/2013 às 15:43:21',
                data_fim: '10/10/2013 às 15:43:21',
                passo_msg: 'Preparando Backup',
                passo_atual: Math.floor((Math.random()*49)+1),
                total: Math.floor((Math.random()*100)+50),
                status: 1
            }
        });
        i++;
    };
}
