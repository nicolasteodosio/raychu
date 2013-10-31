mockProcess = function(n) {
    var i = 0;
    while(i <= n) {
        $.ajax({
            type: "POST",
            url: "/process",
            content_type: 'application/json',
            data: {
                total: Math.floor((Math.random()*10)+1),
                owner: "JMilk",
                status: 1,
                step: 0
            }
        });
        i++;
    }
}
