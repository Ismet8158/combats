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
                    setUserId({
                        username: parsedAnswer.user.username,
                        token: parsedAnswer.user.id
                    })
                    whoAmI()
                        .then(result => {
                            console.log('register done resolving ...');
                            resolve(result);
                        })
                        .catch(reason => {
                            console.log('Caught reject in registers whoami: ' + reason);
                        })
                }else{
                    reject('parsedAnswer status is not OK rejecting ...')
                }
            })
            .catch(reason => {
                reject('Caught reject in register API request: ' + reason);
            });
    });
}

window.addEventListener('DOMContentLoaded', function() {
        whoAmI()
            .then(result => {
                alert('load -> reditect');
                window.location = "/ready/";
            })
            .catch(reason => {
                console.log('No local user: ' + reason);
            })   
});

document.querySelector('.btn-login').addEventListener('click', function() {
    registerUser()
        .then(result => {
            alert('button -> redirect');
            window.location = "/ready/";
        })
        .catch(reason => {
            console.log('onclick - rejected on register: ' + reason);
        });
});
