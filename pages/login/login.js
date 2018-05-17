function whoAmI() {
    return new Promise((resolve, reject) => {
        var localUser = getUser();
        // typeof null -----> "object"
        if (localUser.token != null && localUser.username != null) {
            apiRequest(`/whoami?user_id=${localUser.token}`)
                .then(apiAnswer => {
                    parsedAnswer = JSON.parse(apiAnswer);
                    if (parsedAnswer.status === 'ok') {
                        console.log('whoami done resolving ...');
                        resolve(parsedAnswer);
                    } else {
                        reject('status is not ok rejecting ...');
                    }
                })  
                .catch(reason => {
                    console.log('Caught error in whoaimi: ' + reason);
                });
        }
    });
}

function registerUser() {
    return new Promise((resolve, reject) => {
        var username = document.querySelector('.inp-username').value;
        apiRequest('/register', {
                method: 'POST',
                body: `username=${username}`
            })
            .then(apiAnswer => {
                var parsedAnswer = JSON.parse(apiAnswer);
                if (parsedAnswer.status === 'ok') {
                    // TODO1: проверку на успешность фукнции SetUserId;
                    setUserId({
                        username: parsedAnswer.user.username,
                        token: parsedAnswer.user.id
                    })
                    whoAmI().then(result => {
                        console.log('register done resolving ...');
                        resolve(result);
                    })
                    // TODO1: Иначе reject;
                }
            })
            .catch(reason => {
                console.log('Caught error in register: ' + reason);
            })
    });
}

window.addEventListener("load", function() {
    whoAmI()
        .then(result => {
            alert('load -> reditect');
            window.location = "/ready/";
        })
        .catch(reason => {
            console.log('onload - rejected on whoaim: ' + reason);
        })
});

document.querySelector('.btn-login').onclick = function() {
    registerUser()
        .then(result => {
            alert('button -> redirect');
            window.location = "/ready/";
        })
        .catch(reason => {
            console.log('onclick - rejected on register: ' + reason);
        });
};