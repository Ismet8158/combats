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

window.addEventListener('load', () => {
    getOnline()
        .then(addList);
})

function goFight() {
    var localUser = getUser();
    console.log('ID: ' + localUser.token);

    return apiRequest('/fight', {
            method: 'POST',
            body: `user_id=${localUser.token}`
        })
        .then(responseText => {
            console.log(responseText);
            // TODO: при повторном нажатии ВБОЙ если битва с вами уже ищется или в прогрессе
            // делать проверку на ответ вида {status:'ok'} где нет объекта combat;
            // Если ответ - упрощенный status:ok -> вызвать функцию продолжения боя или поиска.
            setCombatObject(responseText);

            return waitForBattle();
        })
        .catch(reason => {
            console.error(reason);
        });
}

function waitForBattle() {
    var localUser = getUser();
    console.log('ID: ' + localUser.token);

    var combatObj = getCombatObject();
    if (combatObj.combat.id && localUser.token) {
        var combatId = combatObj.combat.id;
        var userId = localUser.token;
        console.log('COMBAT: ' + combatObj);
        console.log('COMBAT_ID: ' + combatId);
        timeout();
        function timeout(){
            setTimeout(() => {
                return apiRequest(`/status?user_id=${userId}&combat_id=${combatId}`)
                    .then(responseText => {
                        parsedResponse = JSON.parse(responseText);
                        console.log(parsedResponse.combat.status);
                        if(parsedResponse.combat.status === 'progress')
                        {
                            console.log(parsedResponse.combat);
                        }
                        else
                            timeout();
                    })
                    .catch(reason => {
                        console.error('Something wrong in waitForBattle.timeout.ApiRequest()::' + reason);
                        //TODO: Добавить логику на сломанный apiRequest();
                    })
            }, 1000);  
        };
    }
    else{
        console.log('Not filled fields in Combat&User');
        return;
    }
}

function logOut()
{
    localStorage.clear();
    alert('logging out ...  ');
    window.location = '/login/';
}
 
window.addEventListener('DOMContentLoaded', function() {
    whoAmI()
        .then(result => {
            console.log('logged in');
        })
        .catch(reason => {
            console.log('No local user: ' + reason);
            alert('back');
            window.location = "/login/";
        })
       
});
