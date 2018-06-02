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

    window.apiRequest = apiRequest;
    window.setUser = setUser;
    window.getUser = getUser;
    window.setCombatObject = setCombatObject;
    window.getCombatObject = getCombatObject;
    window.whoAmI = whoAmI;
    window.clearLocalStorage = clearLocalStorage;
})();
