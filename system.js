const express = require('express');
const app = express();
const users = require('./public/users.json');
const rates = require('./public/rates.json');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function result(code,data,msg){
    return {"code":code,"msg":msg,"data":data};
}
function result_ok(data,msg){
    return result(0,data,msg);
}
function result_fail(data,msg){
    return result(-1,data,msg);
}



app.get('/rates', (req, res) => {
    res.json(rates);
});

app.post('/register', (req, res) => {
    var user = req.body;
    fs.readFile('./public/users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(200).json(result_fail(null,'Error reading users data'));
            return;
        }
        const list = JSON.parse(data);
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.email == user.email) {
                res.status(200).json(result_fail(null,'Email has been registered'));
                return;
            }
        }
        list.push(user);
        fs.writeFile('./public/users.json', JSON.stringify(list, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(200).json(result_fail(null,'Error write users data'));
              return;
            }
            res.status(201).send(result_ok(null,'Register successfully'));
          });

    });
});
app.post('/login', (req, res) => {
    var user = req.body;
    fs.readFile('./public/users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(200).json(result_fail(null,'Error reading users data'));
            return;
        }
        const list = JSON.parse(data);
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.email == user.email) {
                if(element.password == user.password) {
                    user.password = null;
                    res.status(200).json(result_ok(user,'Login successful'));
                }else{
                    res.status(200).json(result_fail(null,'Password is wrong'));
                }
                return;
            }
        }
        res.status(200).json(result_fail(null,'Email is not exist'));
    });
});

app.post('/getUser', (req, res) => {
    var user = req.body;
    fs.readFile('./public/users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(200).json(result_fail(null,'Error reading users data'));
            return;
        }
        const list = JSON.parse(data);
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.email == user.email) {
                delete element.password;
                res.status(200).json(result_ok(element,'Get user'));
                return;
            }
        }
        res.status(200).json(result_fail(null,'Email is not exist'));
    });
});

app.post('/update', (req, res) => {
    var user = req.body;
    fs.readFile('./public/users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(200).json(result_fail(null,'Error reading users data'));
            return;
        }
        const list = JSON.parse(data);
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.email == user.email) {
                element.name = user.name;        
                element.age = user.age;        
                element.gender = user.gender;               
                break;
            }
        }
        
        fs.writeFile('./public/users.json', JSON.stringify(list, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(200).json(result_fail(null,'Error write users data'));
              return;
            }
            res.status(200).send(result_ok(null,'Save successfully'));
          });

    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;