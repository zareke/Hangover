function Navbar() {
   
    return (
      
        <div>
        <header className="header">
          <h1>hansover</h1>
          <nav>
            <ul>
              <li>
                <a href="#Sobre mí">Explorar</a>
              </li>
                
                <div className="busqueda">
                    <form>
                        <input type="search" id="gsearch" name="gsearch"></input>
                    </form>
                </div>


              <li>
                <a href="#Conocimientos">Información</a>
              </li>
              <li>
                <a href="#Experiencia">Nuevo diseño</a>
              </li>
              <li>
                <a href="#Educación">Perfil</a>
              </li>
              <li>
                <a href="#Certificaciones">Garage</a>
              </li>
              <li>
                <a href="#Contacto">Bolsa</a>
              </li>
              <li>
                <a href="#Contacto">Iniciar sesión</a>
              </li>
            </ul>
          </nav>
        </header>
        </div>
    );
  }
  
  export default Navbar;