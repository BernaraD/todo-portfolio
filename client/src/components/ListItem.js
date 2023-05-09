import React, { useState } from 'react';
import ProgressBar from "./ProgressBar";
import TickIcon from "./TickIcon";
import Modal from "./Modal";


function ListItem({ task, getData }) {

    const [showModal, setShowModal] = useState( false );

    const deleteItem = async () => {
        try {
            const response =await fetch(`/todos/${ task.id }`, {
                method: "DELETE",
            })
            if (response.status === 200) {
                console.log( 'Deleted' )
                getData()
            }
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <li className="list-item">

            <div className='info-container'>
                <TickIcon/>
                <p className="task-title">{ task.title }</p>
                <ProgressBar progress={task.progress}/>
            </div>

            <div className="button-container">
                <button className="edit" onClick={ () => setShowModal( true ) }>Edit</button>
                <button className="delete" onClick={ deleteItem }>Delete</button>

                { showModal &&
                    <Modal mode={ 'edit' }
                           setShowModal={ setShowModal }
                           task={ task }
                           getData={ getData }
                    /> }
            </div>
        </li>
    )
}

export default ListItem;