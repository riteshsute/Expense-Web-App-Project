axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
? localStorage.getItem("token")
: "";
function forgetPassword(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const email = event.target.email.value;
    console.log(email)
    console.log(token)
    const obj = {
        email,
    };
    console.log(obj, " obj email")
    axios.post("http://34.204.101.224:7000/password/forgotpassword", obj,  {headers: { 'Authorization': token}})
    .then((response) => {
        console.log(response, "forgetpassword details")
        alert("link send to the Email");
        location.reload();
    })
    .catch((error) => {
        console.log(error)
        console.log(JSON.stringify(error));
    }); 
}