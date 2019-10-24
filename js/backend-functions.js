let username = "";
let globalUserObj = {};

let userLikes = [];

let likesRestIds = [];

const onLoad = () => {
    document.addEventListener("DOMContentLoaded", (event) => {
        console.log("mehh")
        addUserListener();
    })
}

const addUserListener = () => {
    console.log("ehh")
    const btn = document.getElementById("username-button");
    btn.addEventListener("click", logInOrOut);
}

const logInOrOut = (event) => {
    const p = document.getElementById("show-user").children[0]
    if (event.target.textContent === "Log In"){
        Swal.fire({
            title: 'Enter Your Username',
            input: 'text',
            inputAttributes: {
            autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Log In',
            showLoaderOnConfirm: true,
            preConfirm: (username) => {
                return fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username
                    })
                })
                .then(response => {
                    return response.json()
                })
                .then(json => {
                    if (json.name === ""){
                        Swal.showValidationMessage(
                            "Please enter a username"
                        )
                    }
                    else{
                        loggedIn(json)
                    }
                })
                .catch(error => {
                    console.log(error)
                    Swal.showValidationMessage(
                    "There was an error retrieving your username"
                    )
                })
            }
        })
    }
    else {
        Swal.fire({
            type: 'success',
            title: 'You have successfully logged out!',
            showConfirmButton: false,
            timer: 1500
        })
        event.target.innerHTML = "Log In"
        username = "";
        userId = 0;
        console.log(p)
        p.innerText = "";
        p.parentNode.hidden = true;
    }
}


const loggedIn = (userObj) => {
    console.log(userObj)
    const p = document.getElementById("show-user").children[0];
    const button = document.getElementById("username-button");
    button.innerHTML = "LogOut";
    username = userObj.name;
    globalUserObj = userObj
    userLikes = userObj.likes
    likesRestIds = userLikes.map(like => like.restaurant_id);
    p.textContent = username;
    p.parentNode.hidden = false;
    console.log(username);
}
onLoad();