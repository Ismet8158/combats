(function () {
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
    }

    function getUser() {
        return {
            username: localStorage.getItem("username"),
            token: localStorage.getItem("usertoken")
        };
    }

    function setCombatObject(combat) {
        localStorage.setItem('combat', JSON.stringify(combat));
        //localStorage.setItem('combat_id', combat.combat_id);
    }

    function getCombatObject() {
        //return combatObj = localStorage.getItem('combat_id');
        var combatObj = localStorage.getItem('combat');
        if (combatObj)
            return JSON.parse(JSON.parse(combatObj));
        else
            return null;

    }

    function removeUserId() {
        localStorage.removeItem('user');
    }

    window.apiRequest = apiRequest;
    window.setUserId = setUserId;
    window.getUser = getUser;
    window.setCombatObject = setCombatObject;
    window.getCombatObject = getCombatObject;
})();