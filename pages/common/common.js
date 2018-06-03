(function() {
    function apiRequest(request, {method, body} = {}) {
        return fetch(`http://localhost:3333${request}`, {
            method,
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body
        })
        .then(response => response.text());
    }

    function setUser(userObj) {
        localStorage.setItem('user', JSON.stringify(userObj))
        return true;
    }

    function getUser() {
        var userObj = localStorage.getItem('user');
        if (userObj)
            return JSON.parse(userObj);
        else
            return null;
    }

    function setCombatObject(combatJSON) {
        localStorage.setItem('combat', combatJSON);
        return true;
    }

    function getCombatObject() {
        var combatObj = localStorage.getItem('combat');
        if (combatObj)
            return JSON.parse(combatObj);
        else
            return null;
    }

    function clearLocalStorage() {
        localStorage.removeItem('user');
        localStorage.removeItem('combat');
        return true;
    }

    function whoAmI() {
        return new Promise((resolve, reject) => {
            var localUser;
            if (localUser = getUser()) {
                apiRequest(`/whoami?token=${localUser.token}`)
                    .then(apiAnswer => {
                        parsedAnswer = JSON.parse(apiAnswer);
                        if (parsedAnswer.status === 'ok') {
                            console.log('WhoAmIed(); ');
                            resolve(parsedAnswer);
                        } else {
                            reject('WhoAmi.status != OK; ');
                        }
                    })  
                    .catch(reason => {
                        reject('whoAmiAPI req error; ' + reason);
                    });
            }
            else{
                reject('Cant getUser(); ');
            }
        });
    }

    
function getUserInfo(event){
    const user_id = event.target.dataset.user;
    var localUser = getUser();
    console.log("user_id: " + user_id);
    return new Promise((resolve, reject) => {
        apiRequest(`/info?token=${localUser.token}&user_id=${user_id}`)
            .then(apiAnswer => {
                parsedAnswer = JSON.parse(apiAnswer);
                if (parsedAnswer.status === 'ok' && parsedAnswer.user) {
                    console.log('remoteUserGot');
                    resolve(showProfile(parsedAnswer.user, parsedAnswer.combats));
                } else {
                    reject('getUserInfo.status != OK; ');
                }
            })  
            .catch(reason => {
                reject('/Info req error; ' + reason);
            });
    });
}

function showProfile(user, combats) {
    document.getElementsByClassName("user_name")[0].innerHTML = user.username;
    document.getElementsByClassName("user_id")[0].innerHTML = user.id;
    document.getElementsByClassName("parange")[0].style.display = 'block';
}

function hideUserProfile() {
    document.getElementsByClassName("parange")[0].style.display = 'none';
}

    window.hideUserProfile = hideUserProfile;
    window.apiRequest = apiRequest;
    window.setUser = setUser;
    window.getUser = getUser;
    window.setCombatObject = setCombatObject;
    window.getCombatObject = getCombatObject;
    window.whoAmI = whoAmI;
    window.clearLocalStorage = clearLocalStorage;
    window.showProfile = showProfile;
    window.getUserInfo = getUserInfo;
})();