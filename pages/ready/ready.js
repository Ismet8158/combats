function getOnline() {
    return apiRequest('/online')
        .then(responseText => {
            const response = JSON.parse(responseText);
            return response.users.map(item => {
                return `<li>${item.username}</li>`;
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

function goFight() {
    var localUser;
    if(localUser = getUser()){
        return apiRequest('/fight', {
                method: 'POST',
                body: `token=${localUser.token}`
            })
            .then(responseText => {
                console.log(responseText);
                parsedAnswer = JSON.parse(responseText);
                
                if(parsedAnswer.status && parsedAnswer.combat){
                    setCombatObject(responseText);
                    return waitForBattle();
                }
                else
                    // TODO: fix API
                    return;
            })
            .catch(reason => {
                console.error('FightAPI req error: ' + reason);
            });
    }
    else{
        console.log('Cant getUser();')
    }
}

function waitForBattle() {
    var buttonFight = document.querySelector('.btn-fight');
    var localUser;
    var combatObj;
    if ((combatObj = getCombatObject()) && (localUser = getUser())) {
        var combatId = combatObj.combat.id;
        var userToken = localUser.token;
        timeout();
        function timeout(){
            setTimeout(() => {
                return apiRequest(`/status?token=${userToken}&combat_id=${combatId}`)
                    .then(responseText => {
                        parsedResponse = JSON.parse(responseText);
                        console.log(parsedResponse.combat.status);
                        buttonFight.textContent = parsedResponse.combat.status;
                        if(parsedResponse.combat.status === 'progress')
                        {
                            console.log(parsedResponse.combat);
                            buttonFight.innerHTML = "<a href='/fight'>next</a>"
                            buttonFight.onclick = function(){console.log('re')};
                        }
                        else
                            timeout();
                    })
                    .catch(reason => {
                        console.error('WaitForBattle.timeout.ApiRequest() error:: ' + reason);
                        //TODO: Добавить логику на сломанный apiRequest();
                    })
            }, 1000);  
        };
    }
    else{
        console.log('Cant getUser() || getCombat();');
        return;
    }
}

function logOut(){
    if(clearLocalStorage())
        window.location = '/login/';
}
 
window.addEventListener('DOMContentLoaded', function() {
    getOnline()
        .then(addList);

    whoAmI()
        .then(result => {
            // Костыль?
            if(getCombatObject())
                waitForBattle();
        })
        .catch(reason => {
            console.log('No local user: ' + reason);
            alert('back');
            window.location = "/login/";
        })   
});