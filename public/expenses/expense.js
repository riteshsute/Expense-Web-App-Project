axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
? localStorage.getItem("token")
: "";
function addExpense(event) {
    event.preventDefault();
    console.log('submit envoked')
    const token = localStorage.getItem('token');
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category =  event.target.category.value;

    const obj = {
       amount,
       description,
       category
    };

    // http://34.204.101.224:7000/expense/addExpense",

    axios.post("http://34.204.101.224:7000/expense/addExpense", obj,  {headers: { 'Authorization': token}} )
    .then((response) => {
            addNewExpense(response.data.showNewExpenseDetail)
            // alert(response.data.message);
            location.reload();
    })
    .catch(err => console.log(err, 'happend in frontend'));
}

function premiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML =  "YOU ARE A PREMIUM USER"
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async() => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    const isPremiumUser = decodeToken.ispremiumuser
    if(isPremiumUser) {
        premiumUserMessage();
        showLeaderboard();
    } 
    try {
        const res = await axios.get("http://34.204.101.224:7000/expense/userExpenses", {headers: { 'Authorization': token}})

        const expenseData = res.data.allExpenses
        for(var i=0; i< expenseData.length; i++){
            addNewExpense(expenseData[i])
    } 
    } catch (error) {
        console.log(error, 'in error field')
    } 
})

function addNewExpense(expense){
const parentNode = document.getElementById('listOfUsers');


const childHTML = `<li id=${expense.id}> ${expense.amount} - ${expense.description} - ${expense.category}            
                    <button onclick=deleteUser('${expense.id}')> Delete User </button>
                    <button onclick=editUser('${expense.amount}','${expense.description}','${expense.category}','${expense.id}')> Edit User </button>  
                    </li>`

parentNode.innerHTML = parentNode.innerHTML + childHTML;

} 

async function editUser(amount, description, category, expenseId) {

        document.getElementById('amount').value = amount;
        document.getElementById('description').value = description;
        document.getElementById('category').value = category;

        deleteUser(expenseId)
}



async function deleteUser(expenseId){
    try {
        const token = localStorage.getItem('token');
        const resdelete = await axios.delete(`http://34.204.101.224:7000/expense/deleteExpense/${expenseId}`, { headers: {"Authorization" : token} })
        
        removeUserFromScreen(expenseId)
        } 
        catch(error) {
            console.log(error, 'is in the deleteUserr')
        }
    }

function showLeaderboard(){
    const inputElem = document.createElement('input');
    inputElem.type = "button";
    inputElem.value = "Show Leaderboard";
    inputElem.onclick = async() => {
        const token = localStorage.getItem('token')
        const leaderboardArray = await axios.get("http://34.204.101.224:7000/expense/showLeaderBoard", {headers: {'Authorization': token }});

        

        var leaderBoardElem = document.getElementById("leaderboard");
        leaderBoardElem.innerHTML += `<h1> Leader Board </h1>`

        leaderboardArray.data.forEach((userDetails) => {
            leaderBoardElem.innerHTML += `<li> Name - ${userDetails.name} Total Expenses ${userDetails.total_expense}</li>`
        })
    }
    document.getElementById('message').appendChild(inputElem);
}

 function removeUserFromScreen(expenseId){
        const parentNode = document.getElementById('listOfUsers');
        const childNodeToBeDeleted = document.getElementById(expenseId);
        if(childNodeToBeDeleted) {
            parentNode.removeChild(childNodeToBeDeleted)
        }
    }

function download(page = 1, limit = localStorage.getItem('limit') || linksPerPage.value) {
    const token = localStorage.getItem('token');

axios.get(`http://34.204.101.224:7000/expense/download?page=${page}&limit=${limit}`, { headers: {"Authorization" : token} })
.then((response) => {
    if(response.status === 201){
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();

        const filesDownloaded = response.data.DownloadedFilesUrl;
        const filesList = document.getElementById('files-list');
        filesList.innerHTML = '';

        
            filesDownloaded.filesDb.forEach((file) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = file.fileURL;
            link.textContent = `Downloaded on ${new Date(file.createdAt).toLocaleString()}`;

            listItem.appendChild(link);
            filesList.appendChild(listItem);
        });


        const pagination =  document.getElementById('pagination');
        pagination.innerHTML = '';

        console.log(filesDownloaded.totalPages, '{{{{{{{{{{}}}}}}}}}}')
        for(let i = 1; i <= filesDownloaded.totalPages; i++) {
            const link = document.createElement('a');
            link.href = `#`;
            link.textContent = i;
            
            if(i === filesDownloaded.currentPage) {
                link.classList.add('active');
            }

            link.addEventListener('click', (event) => {
                event.preventDefault();
                download(i, limit);
            });

            pagination.appendChild(link);
        }

        localStorage.setItem('limit', limit);

        } else {
            throw new Error(response.data.message)
        }
    })
    .catch((err) => {
        console.log(err)
    });
}

    document.getElementById('rzp-button1').onclick = async function (event) {
        const token = localStorage.getItem('token');
        console.log(token, "in button function")
        const response = await axios.get('http://34.204.101.224:7000/expense/buypremium', { headers: { 'Authorization': token }});
        console.log(response, "response of premium")

        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            
            "handler": async function (response) {
            await axios.post('http://34.204.101.224:7000/expense/updatestatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                ispremiumuser: true
            }, { headers: {"Authorization": token }}).then((res) => {
            alert("you are a premium user now")
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML =  "YOU ARE A PREMIUM USER"
            localStorage.setItem('token', res.data.token)

            showLeaderboard();
        }).catch((err) => {
            console.log(err)
        })
            },
        };
        const razorpayObj = new Razorpay(options);
        razorpayObj.open();
        event.preventDefault();

        razorpayObj.on('payment.failed', function (response) {
            console.log(response,"<<<<<<<<<");
            axios.post('http://34.204.101.224:7000/expense/updatestatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                ispremiumuser: false
            }, { headers: {"Authorization": token }}).then((res) => {
                alert("Payment Failed");
                // document.getElementById('rzp-button1').style.visibility = "visible"
            }).catch((err) => {
                console.log(err)
            })
        })
    } 

