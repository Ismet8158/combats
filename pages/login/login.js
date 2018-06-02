function registerUser() {
    return new Promise((resolve, reject) => {
        var username = document.querySelector('.inp-username').value;
        var password = document.querySelector('.inp-password').value;
        apiRequest('/register', {
                method: 'POST',
                body: `username=${username}&password=${password}`
            })
            .then(apiAnswer => {
                var parsedAnswer = JSON.parse(apiAnswer);
                console.log('Reg:');console.log(parsedAnswer);
                if (parsedAnswer.status === 'ok') {
                    var userObj = parsedAnswer.user;
                    if(setUser(userObj)){
                        resolve(parsedAnswer);
                    }
                    else{
                        reject('Cant setUser(); ')
                    }
                }
                else{
                    reject('parsedAnswerRegister.status != OK; ');
                }
            })
            .catch(reason => {
                reject('RegisterAPI request error: ' + reason);
            });
    });
}

function loginUser() {
    return new Promise((resolve, reject) => {
        var username = document.querySelector('.inp-username').value;
        var password = document.querySelector('.inp-password').value;
        apiRequest('/login', {
                method: 'POST',
                body: `username=${username}&password=${password}`
            })
            .then(apiAnswer => {
                var parsedAnswer = JSON.parse(apiAnswer);
                console.log('login: ');console.log(parsedAnswer);
                if (parsedAnswer.status === 'ok') {
                    var userObj = parsedAnswer.user;
                    if(setUser(userObj)){
                        resolve(parsedAnswer);
                    }
                    else{
                        reject('Cant setUser(); ');
                    }
                }
                else{
                    reject('LoginAnswer.status != ok; ');
                }       
            })
            .catch(reason => reject('LoginAPI request error; ' + reason));
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-registr').addEventListener('click', () => {
        registerUser()
            .then(result => {
                loginUser()
                    .then(result => {alert('reg-login'); window.location = '/ready/';})
                    .catch(reason => console.log('onclick: ' + reason))
                }
            )
            .catch(reason => {
                console.log('onclick reg: ' + reason);
            })

    });

    document.querySelector('.btn-login').addEventListener('click', () => {
        loginUser()
            .then(() => {
                alert('login');
                window.location = '/ready/';
            })
            .catch(reason => console.log('onclick log: ' + reason))
    });
});


