const onLoad = () => {
    document.addEventListener("DOMContentLoaded", (event) => {
        console.log("mehh")
        addUserListener();
    })
}

const addUserListener = () => {
    console.log("ehh")
    const btn = document.getElementById("username-button");
    btn.addEventListener("click", logIn);
}

const logIn = (event) => {
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
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            })
            .then(json => loggedIn(json))
            .catch(error => {
                Swal.showValidationMessage(
                  "There was an error retrieving your username"
                )
            })
        }
    })
    // const username = document.getElementById("username").value;
    // if (username ===""){
    //     Swal.fire({
    //         type: 'error',
    //         title: 'Are You Dumb?',
    //         text: 'Type in a fucking username!',
    //     })
    // }
    // else{
    //     const reqObj = {
    //         method: "POST",
    //         headers: {
    //             "Content-type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             username: username
    //         })
    //     };
    //     fetch("http://localhost:3000/users", reqObj)
    //     .then(resp => resp.json())
    //     .then(json => console.log(json))
    // }
}

onLoad();