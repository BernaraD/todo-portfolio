import React, { useState } from 'react';
import { useCookies } from "react-cookie";


function Modal({ mode, task, getData, setShowModal }) {
    const [cookies, setCookie, removeCookie] = useCookies(null);

    const editMode = mode === 'edit' ? true : false

    const [data, setData] = useState( {
        user_email: editMode ? task.user_email : cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 10,
        date: editMode ? task.date : new Date()
    } );

    const postData = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch( `/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( data )
            } )
            if (response.status === 200) {
                setShowModal( false );
                getData();
            }
        } catch ( error ) {
            console.log( error )
        }
    };

    const editData = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch( `/todos/${ task.id }`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( data )
            } )
            if (response.status === 200) {
                setShowModal( false );
                getData()
            }
        } catch ( err ) {
            console.error( err )
        }
    }


    const handleChange = (e) => {
        const {name, value} = e.target
        setData( data => ( {
            ...data,
            [name]: value
        } ) )
    }


    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Lets { mode } your task</h3>
                    <button onClick={ () => setShowModal( false ) }>Cancel</button>
                </div>

                <form>
                    <input
                        type="text"
                        placeholder="Your task goes here"
                        required
                        maxLength={ 30 }
                        name="title"
                        value={ data.title }
                        onChange={ handleChange }
                    />
                    <br/>

                    <label htmlFor="range">Drag to select your current progress</label>
                    <input
                        type="range"
                        name="progress"
                        id="range"
                        required
                        min="0" max="100"
                        value={ data.progress }
                        onChange={ handleChange }
                    />
                    <input
                        type="submit"
                        className={ mode }
                        onClick={ editMode ? editData : postData }
                    />

                </form>
            </div>
        </div>
    )
}

export default Modal;