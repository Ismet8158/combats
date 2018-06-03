(function() {
    function handleErrors(response) {
        if (response.status === 403) {
            window.location = '/login/';
        }
        if (response.status >= 400)
            return Promise.reject(response);
        else return response;
    }

    function apiRequest(request, {method, body} = {}) {
        return fetch(`http://localhost:3333${request}`, {
            method,
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body
        })
        .then(handleErrors)
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
    
    function showMessage(message) {

        var newDiv = document.createElement("P");
        var newContent;
        if (message.status && message.statusText) newContent = document.createTextNode("status: " + message.status + message.statusText);
        else newContent = document.createTextNode(message);
        newDiv.setAttribute("class", "messageDialog showMessage");
        newDiv.appendChild(newContent);
        document.body.appendChild(newDiv);
    }

    window.apiRequest = apiRequest;
    window.setUser = setUser;
    window.getUser = getUser;
    window.setCombatObject = setCombatObject;
    window.getCombatObject = getCombatObject;
    window.whoAmI = whoAmI;
    window.clearLocalStorage = clearLocalStorage;
    window.showMessage = showMessage;
})();
