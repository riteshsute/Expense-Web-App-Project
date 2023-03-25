function signUpUser(event) {
    event.preventDefault();
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const phonenumber = event.target.phonenumber.value;

    const obj = {
        name,
        email,
        password,
        phonenumber
    };
    console.log(obj);

    axios.post("http://34.204.101.224:7000/expense/signup", obj)
    .then((response) => {
        console.log(response, "in the singup")
        alert(response.data.message);
        window.location.href = '/Login/login.html'; 
        
    })
    .catch((error) => {
        console.log(error);
    });
}
