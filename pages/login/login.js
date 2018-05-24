//TODO: Убрать лишние промисы.
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
                    if(setUserId({
                        username: parsedAnswer.user.username,
                        token: parsedAnswer.user.id
                    })){
                        return whoAmI();
                    }
                    else{
                        reject('User registered, but cant set localUser rejecting ...')
                    }
                }
                else{
                    reject('parsedAnswer status is not OK rejecting ...');
                }
            })
            .then(result => {
                console.log('register done resolving ...');
                resolve(result);
            })
            .catch(reason => {
                reject('Caught reject in register API request: ' + reason);
            });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-login').addEventListener('click', () => {
        registerUser()
            .then(result => {
                alert('button -> redirect');
                window.location = '/ready/';
            })
            .catch(reason => {
                console.log('onclick - rejected on register: ' + reason);
            });
    });

     whoAmI()
        .then(result => {
            alert('load -> reditect');
            window.location = '/ready/';
        })
        .catch(reason => {
            console.log('No local user: ' + reason);
        })   
});


