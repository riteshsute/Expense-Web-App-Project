function loginUser(event) {
    event.preventDefault();
    // location.reload();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const obj = {
        email,
        password
    };
    console.log(obj)

    axios.post("http://34.204.101.224:7000/expense/login", obj)
    .then((response) => {
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        alert(response.data.message);
        window.location.href = "/expenses/expense.html" 
        
    })
    .catch((error) => {
        alert('Password is Incorrect');
        console.log(JSON.stringify(error));
        // alert('User Not Found')
    }); 
}