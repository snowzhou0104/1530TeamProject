function login() {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email == null || email === '') {
        alert("Email can't be empty");
        return;
    }
    if (password == null || password === '') {
        alert("Password can't be empty");
        return;
    }
    var param = {
        'email': email,
        'password': password
    };
    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(param),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            if (data.code == 0) {
                document.cookie = "email=" + data.data.email + "; path=/";
                window.location.href = "index.html";
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function register() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var gender = document.getElementById("gender").value;
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;
    if (email == null || email === '') {
        alert("Email can't be empty");
        return;
    }
    if (password == null || password === '') {
        alert("Password can't be empty");
        return;
    }
    if (name == null || name === '') {
        alert("name can't be empty");
        return;
    }
    var param = {
        'email': email,
        'password': password,
        'name': name,
        'gender': gender,
        'age': age,
    };
    fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(param),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            if (data.code == 0) {
                window.location.href = "login.html"
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
var rates = [];

function getRates() {
    var token = getCookie("email");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    fetch('rates.json')
        .then(response => response.json())
        .then(list => {
            var rateList = document.getElementById("rate");
            rates = list;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var optionElement = document.createElement('option');
                optionElement.value = item.id;
                optionElement.textContent = item.area + ', ' + item.rate + '%';
                rateList.appendChild(optionElement);
            }
        })
        .catch(error => {
            console.error('Error fetching rates:', error);
        });

}

function selectRate(){
    var selectElement = document.getElementById('rate');  
    var selectedOption = selectElement.options[selectElement.selectedIndex];  
    var id = selectedOption.value;  

    for (let i = 0; i < rates.length; i++) {
        if (rates[i].id == id) {
            console.log(rates[i].deduction)
            document.getElementById("deduction").value = rates[i].deduction;
        }
    }
}
function calcRate(){
    var income = document.getElementById("income").value;
    var selectElement = document.getElementById('rate');  
    var selectedOption = selectElement.options[selectElement.selectedIndex];  
    var id = selectedOption.value;  
    if (income == '') {
        alert("Please input income");
        return;
    }
    if (id == -1) {
        alert("Please select a rate");
        return;
    }
    for (let i = 0; i < rates.length; i++) {
        if (rates[i].id == id) {
            document.getElementById("deduction").value = rates[i].deduction;
            var rate = rates[i].rate * Number(income) / 100;
            var all = rate-rates[i].deduction;
            var result = "Your tax bill is $" + rate.toFixed(2) + ".";
            if (all <= 0) {
                result = result + " You don't need to pay taxes";
            }
            document.getElementById("result").innerText = result;
            break;
        }
    }
    
}

function loadUser(){
    var email = getCookie("email");
    if (!email) {
        window.location.href = "login.html";
        return;
    }
    var param = {"email": email};
    fetch('/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(param),
        })
        .then(response => response.json())
        .then(data => {
            var user = data.data;
            document.getElementById("email").value= user.email;
            document.getElementById("gender").value= user.gender;
            document.getElementById("name").value= user.name;
            document.getElementById("age").value= user.age;

        })
        .catch((error) => {
            console.error('Error:', error);
        });


}


function saveUser(){
    var email = document.getElementById("email").value;
    var gender = document.getElementById("gender").value;
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;
    if (email == null || email === '') {
        alert("Email can't be empty");
        return;
    }
    if (name == null || name === '') {
        alert("name can't be empty");
        return;
    }
    var param = {
        'email': email,
        'name': name,
        'gender': gender,
        'age': age,
    };
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.msg);
        if (data.code == 0) {
            window.location.reload(true);
        }

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}