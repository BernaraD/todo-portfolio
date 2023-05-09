import ListHeader from "./components/ListHeader";
import { useEffect, useState } from "react";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
    const [cookies, setCookie, removeCookie] = useCookies( null )
    const authToken = cookies.AuthToken   // const authToken = false;
    const userEmail = cookies.Email;      // hard coded before cookies const userEmail = 'bernie@test.com';

    const [tasks, setTasks] = useState( null );

    const getData = async () => {
        try {
            const response = await fetch( `/todos/${ userEmail }` )
            const json = await response.json();
            setTasks( json )
        } catch ( err ) {
            console.log( err )
        }
    }

// If we are not logged in, nothing loads,
// If logged in - once data is received we want to call our getData function with useEffect
    useEffect( () => {
            if (authToken) {
                getData()
            }
        }
        , [] );

    //Sort by date
    const sortedTasks = tasks?.sort( (a, b) => new Date( a.date ) - new Date( b.date ) )


    return (
        <div className="app">
            { !authToken && <Auth/> }
            { authToken &&
                <>
                    <ListHeader
                        listName={ '📝 Task keeper' }
                        getData={ getData }
                    />
                    <p className="user-email">Welcome back {userEmail} </p>
                    { sortedTasks?.map( (task) =>
                        <ListItem key={ task.id }
                                  task={ task }
                                  getData={ getData }
                        /> ) }
                </>
            }
            <p className="copyright">©BM LLC</p>
        </div>
    );
}

export default App;
