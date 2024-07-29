import React from 'react';
import './Informacion.css';
function Informacion(props) {
return (
    <div className="WRAPPERtodo">
      
      <img src="" alt="logo" />
        <p>{props.content}</p>
      
        <footer className="App-footer">
        <p>Footer content</p>
        </footer>

    </div>
  );}

  export default Informacion