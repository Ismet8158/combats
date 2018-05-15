function getOnline() {
    return apiRequest('/online')
        .then(responseText => {
            const response = JSON.parse(responseText);
            return response.users.map(item => {
                return `<li><h3>${item.username}</h3></li>`;
            });
        })
        .catch(reason => {
            console.error(reason);
            return [];
        });

}

function addList(list) {
    var listElement = document.querySelector('.w3-ul');
    listElement.innerHTML += list.join('');
}

window.addEventListener('load', () => {
    getOnline()
        .then(addList);
})

function goFight() {
    var user_id = getUser().token;
    console.log('ID: ' + user_id);

    return apiRequest('/fight', {
            method: 'POST',
            body: `user_id=${user_id}`
        })
        .then(responseText => {
            console.log(responseText);
            setCombatObject(responseText);
            
            var fightButton = document.querySelectorAll('center')[0];
            fightButton.style.display = 'none';

            return waitForBattle();
        })
        .catch(reason => {
            console.error(reason);
        });
}

function waitForBattle() {
    var user_id = getUser().token;
    console.log('ID: ' + user_id);

    var combat = getCombatObject();
    var combat_id = combat.combat_id;
    console.log('COMBAT: ' + combat);
    console.log('CID: ' + combat_id);
    
    setTimeout(() => {
            return apiRequest(`/status?user_id=${user_id}&combat_id=${combat_id}`)
                .then(responseText => console.log(responseText))
                .catch(reason => console.error(reason))
    }, 1000);
}