const path = require("path"); // native Node js will let us work with directory paths
const { v4: uuidv4 } = require( 'uuid' );
const cors = require( 'cors' );
const express = require( "express" );
const pool = require( "./db" );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' )


const PORT = process.env.PORT ?? 9000;
const app = express();
app.use( cors() );
app.use( express.json() );

if (process.env.NODE_ENV === 'production') {
    //serve static content
    app.use( express.static(path.join(__dirname, "client/build")) )
}
console.log(__dirname)
console.log(path.join(__dirname, "client/build"))

//get all todos
app.get( '/todos/:userEmail', async (req, res) => {

    const { userEmail } = req.params
    console.log( 'User email from params: ' + userEmail )
    try {
        const todos = await pool.query( 'SELECT * FROM todos WHERE user_email = $1', [userEmail] )
        res.json( todos.rows )
    } catch ( err ) {
        console.log( err )
    }
} )

//create a new task
app.post( '/todos', async (req, res) => {
    const { user_email, title, progress, date } = req.body
    const id = uuidv4()
    try {
        const newTask = await pool.query(
            `INSERT INTO todos (id, user_email, title, progress, date)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, user_email, title, progress, date] )
        res.json( newTask );

    } catch ( error ) {
        console.log( error )
    }
} )

//edit todo by id
app.put( '/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body
    try {
        const editTodoById = await pool.query(
            'UPDATE todos SET user_email = $1, title =$2, progress = $3, date = $4 WHERE id = $5;',
            [user_email, title, progress, date, id] )
        res.json( editTodoById );
    } catch ( error ) {
        console.log( error )
    }

} )

//delete a todo by id
app.delete( '/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await pool.query( 'DELETE FROM todos WHERE id = $1;', [id] )
        res.json( deletedTodo )
    } catch ( err ) {
        console.error( err )
    }
} )

//sign up
app.post( '/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync( 10 )
    const hashedPassword = bcrypt.hashSync( password, salt )

    console.log( hashedPassword )

    try {
        const signUp = await pool.query( `INSERT INTO users (email, hashed_password)
                                          VALUES ($1, $2)`,
            [email, hashedPassword] )

        const token = jwt.sign( { email }, 'secret', { expiresIn: '1hr' } )
        console.log( token )
        res.json( { email, token } )
    } catch ( err ) {
        console.error( err )
        if (err) {
            res.json( { detail: err.detail } )
        }
    }
} )

//login
app.post( '/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await pool.query( 'SELECT * FROM users WHERE email = $1', [email] )

        //if user is not found
        if (!users.rows.length) return res.json( { detail: "User doesn't exist!" } )

        // otherwise
        //if passwords match, send response - email get the first item with fresh token
        const success = await bcrypt.compare( password, users.rows[0].hashed_password )
        const token = jwt.sign( { email }, 'secret', { expiresIn: '1hr' } )

        if (success) {
            res.json( { 'email': users.rows[0].email, token } )
        } else {
            res.json( { detail: "Login failed" } )
        }

    } catch ( err ) {
        console.error( err )
    }
} )

//Any other routes. Wildcard
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
})

app.listen( PORT, () => console.log( `Server is running on port ${ PORT }` ) );