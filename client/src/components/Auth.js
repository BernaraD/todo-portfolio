import { useState } from 'react';
import { useCookies } from 'react-cookie';

function Auth() {
    const [cookies, setCookie, removeCookie] = useCookies( null );
    const [isLogin, setIsLogin] = useState( true );
    const [email, setEmail] = useState( null );
    const [password, setPassword] = useState( null );
    const [confirmPassword, setConfirmPassword] = useState( null )
    const [error, setError] = useState( null );

    // console.log( email, password, confirmPassword );
    // console.log( 'cookies', cookies );


    const viewLogin = (status) => {
        setIsLogin( status )
        setError( null )
    }


    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()
        if (!isLogin && password !== confirmPassword) {
            setError( "Make sure passwords match!" )
            return
        }
        //Sending data to the server, either login or signup - conditionally
        const response = await fetch( `/${ endpoint }`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { email, password } )
        } )

        //wait for the data we receive back from server and assign it to const data
        const data = await response.json()

        if (data.detail) {
            setError( data.detail )
            // console.log(data)
        } else {
            // if logged in successfully, set the Cookies and refresh the page:
            setCookie('Email', data.email)
            setCookie('AuthToken', data.token)

            //refresh the page with all the content that user's todos
            window.location.reload()
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>{ isLogin ? "Please log in " : "Please sign up" }</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        onChange={ (e) => setEmail( e.target.value ) }
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={ (e) => setPassword( e.target.value ) }
                    />

                    {/*Only see if you are signing up*/ }
                    { !isLogin && <input
                        type="password"
                        placeholder="Confirm password"
                        onChange={ (e) => setConfirmPassword( e.target.value ) }
                    /> }

                    <input
                        type="submit"
                        className="create"
                        onClick={ (e) =>
                            handleSubmit( e, isLogin ? 'login' : 'signup' ) }/>

                    { error && <p>{ error }</p> }
                </form>

                <div className="auth-options">
                    <button
                        onClick={ () => viewLogin( false ) }
                        style={ { backgroundColor: !isLogin ? 'rgb(255, 255, 255' : 'rgb(188, 188, 188)' } }
                    >Sign Up
                    </button>

                    <button
                        onClick={ () => viewLogin( true ) }
                        style={ { backgroundColor: isLogin ? 'rgb(255, 255, 255' : 'rgb(188, 188, 188)' } }
                    >Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Auth;