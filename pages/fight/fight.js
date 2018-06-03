function sendMoveRequest(val) {
    apiRequest('/turn', {method: 'post', body: val})
        .then(text => {
            res = JSON.parse(text);
            if (res.status === 'ok') {
                console.log(res);
                health_change(1, res.combat.enemy.health);
            }
            else {
                console.error(res.message);
            }
        });
}



function makeMove() {

    //в какие комбинации бить
    var hit = parseInt(document.querySelector('.attack:checked').value);
    //массив строк -> массив чисел
    var block = document.querySelector('.block:checked').value.split(",");
    block.forEach(function(item, i, arr){
        item = parseInt(item);});

    console.log(block);
    var turn = JSON.stringify({"hit": hit, "blocks": block});
    console.log(turn);

    //apiRequest('/login', {method: 'post', body: 'user_id=KUpXGc'}).then(text=>console.log(text));

    combatid = getCombatObject().combat.id;
    sendMoveRequest(`token=${getUser().token}&combat_id=${combatid}&turn=${turn}`);
}


window.onload = function () {
}

function health_change(player, newValue) {
    var health = document.getElementById("health" + player);
    return health.value = newValue;
}

function end_game() {
    var health1 = document.getElementsByClassName("progress_player1")[0].value;
    var health2 = document.getElementsByClassName("progress_player2")[0].value;

    if (health1 <= 0 & health2 > 0) {
        return 2;
    }
    if (health1 > 0 & health2 <= 0) {
        return 1;
    }
    return 0;
}
