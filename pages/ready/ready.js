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

window.addEventListener('load', function () {
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
            setCombatObject(responseText);
            
            //var fightButton = document.querySelector('btn-fight');
            //fightButton.innerHTML = "SEARCHING...";

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
    if (combatObj && localUser) {
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
                    .catch(reason => console.error(reason))
            }, 1000);  
        };
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
