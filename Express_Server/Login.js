let exp = require("express")
let mysql = require("mysql2")
let cors = require("cors")

let app = exp()


app.listen(3000, function () {
    console.log("Connected to Rest-API")
    console.log("http://localhost:3000")
})

app.use(exp.json())
app.use(cors())


let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "project_db",
});

conn.connect(function (err) {
    if (!err) {
        console.log("Connection established")
    }
    else {
        console.log("failed to Connect")
    }
})

app.get('/users', function (req, res) {
    let query = "select * from users"
    conn.query(query, function (err, result) {
        if (!err) {
            res.json(result);
        }
        else {
            res.send("Failed to fetch data")
        }
    })
}, [])


app.post('/login', function (req, res) {

    const query = "select * from users where username  = ? and password = ?";
    conn.query(query, [req.body.username, req.body.password], function (err, result) {
        if (!err) {
            if (result.length === 1) {
                res.status(200).json({ user: { userid: result[0], username: result[0].username, role: result[0].roleid }, token: "abc123" })
            }
            else {
                res.status(404).send("Login failed");
            }
        }
    })

})
app.post('/register', function (req, res) {
    const { username, password, firstname, lastname, roleid, email, contactnumber, building } = req.body;

    const query = "INSERT INTO users (username, password, firstname, lastname, roleid, email, contactnumber, building) VALUES (?,?,?,?,?,?,?,?)";
    conn.query(query, [username, password, firstname, lastname, roleid, email, contactnumber, building], function (err, result) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.status(201).json({ success: true, userid: result.insertId });
    });
});








