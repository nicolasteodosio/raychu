MilkNotification = function(mensagem){
    url = "http://push.joaoleite.com/push";
    nickname = "joaoleite";
    password = "mbeqpuif651cimd8654p9bi0de";

    $.ajax({
        type: "POST",
        url: url,
        content_type: "application/json",
        data: {
            mensagem: mensagem,
            nickname: nickname,
            password: password
        }
    });
}

