function sendMoveRequest(val) {
    apiRequest('turn', {method: 'post', body: val})
        .then(text => {
            res = JSON.parse(text);
            if (res.status === 'ok') {
                //healthChange(res.);
            }
            else {
                console.error(res.message);
            }
        });
}



function makeMove() {
    var head = document.querySelector('.head'),
        chest = document.querySelector('.chest'),
        torso = document.querySelector('.torso'),
        leg = document.querySelector('.leg'),
        headChest = document.querySelector('.headChest'),
        cheastTorso = document.querySelector('.cheastTorso'),
        torsoLeg = document.querySelector('.torsoLeg'),
        legHead = document.querySelector('.legHead');

    var hit;
    if (head.checked) hit = 1;
    else if (chest.checked) hit = 2;
    else if (chest.checked) hit = 3;
    else hit = 4;

    var block = [];
    if (headChest.checked) block = [1,2];
    else if (cheastTorso.checked) block = [2,3];
    else if (torsoLeg.checked) block = [3,4];
    else block=[4,1];

    turn = JSON.stringify({"hit": hit, "blocks": block});

    apiRequest('login', {method: 'post', body: 'user_id=KUpXGc'}).then(text=>console.log(text));
    apiRequest('fight', {method: 'post', body: 'user_id=KUpXGc'}).then(text=>console.log(text));
    combatid = 'DplctY';
    //getCombatObject().combat_id
    sendMoveRequest('user_id=${getUser().token}&combat_id=${combatid}&turn=${turn}');
}



