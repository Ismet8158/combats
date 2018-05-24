(function() {
    function apiRequest(request, {
        method,
        body
    } = {}) {
        return fetch(`http://localhost:3333${request}`, {
            method,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body
        }).then(response => response.text());
    }

    function setUserId(val) {
        localStorage.setItem('username', val.username);
        localStorage.setItem('usertoken', val.token);
        
        var localUser = getUser();
        if (localUser.username === val.username && localUser.token === val.token)
            return true;
        else
            return false;
    }

    function getUser() {
        return {
            username: localStorage.getItem('username'),
            token: localStorage.getItem('usertoken')
        };
    }

    function setCombatObject(combat) {
        localStorage.setItem('combat', combat);
        return true;
    }

    function getCombatObject() {
        var combatObj = localStorage.getItem('combat');
        if (combatObj)
            return JSON.parse(combatObj);
        else
            return null;
    }

    function removeUserId() {
        localStorage.removeItem('user');
    }

    //TODO: Убрать лишние промисы.
    function whoAmI() {
        return new Promise((resolve, reject) => {
            var localUser = getUser();
            if (localUser.token !== null && localUser.username !== null) {
                apiRequest(`/whoami?user_id=${localUser.token}`)
                    .then(apiAnswer => {
                        parsedAnswer = JSON.parse(apiAnswer);
                        if (parsedAnswer.status === 'ok') {
                            console.log('whoami done resolving ...');
                            resolve(parsedAnswer);
                        } else {
                            reject('API response status is not ok rejecting ...');
                        }
                    })  
                    .catch(reason => {
                        reject('Caught error in whoaimi APIrequest: ' + reason);
                    });
            }
            else{
                reject('cant get local user rejecting ...');
            }
        });
    }

    window.apiRequest = apiRequest;
    window.setUserId = setUserId;
    window.getUser = getUser;
    window.setCombatObject = setCombatObject;
    window.getCombatObject = getCombatObject;
    window.whoAmI = whoAmI;
})();
