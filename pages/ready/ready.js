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
    //TODO: Сделать проверку на нужный возврат user здесь либо в common.js/getUser()
    var localUser = getUser();

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
    var buttonFight = document.querySelector('.btn-fight');
    var localUser = getUser();
    var combatObj = getCombatObject();
    if (combatObj.combat.id && localUser.token) {
        var combatId = combatObj.combat.id;
        var userId = localUser.token;
        timeout();
        function timeout(){
            setTimeout(() => {
                return apiRequest(`/status?user_id=${userId}&combat_id=${combatId}`)
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
    window.location = '/login/';
}
 
window.addEventListener('DOMContentLoaded', function() {
    whoAmI()
        .then(result => {
            console.log('logged in');
            // Костыль
            if(getCombatObject())
                waitForBattle();
        })
        .catch(reason => {
            console.log('No local user: ' + reason);
            alert('back');
            window.location = "/login/";
        })
     
        
});