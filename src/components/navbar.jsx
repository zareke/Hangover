function Navbar({inicioSesion}, {user}) {
    return (
      
        <div>
        <header className="header">
          <h1>hansover</h1>
          <nav>
            <ul className="botonesNavbar">
              <li>
                <a href="#Explorar">Explorar</a>
              </li>
                
                <div className="busqueda">
                    <form>
                      <input type="search" id="gsearch" name="gsearch" style={{ width: '300px' }}></input>
                    </form>
                </div>


              <li>
                <a href="#Info">Información</a>
              </li>
              <li>
                <a href="#NewDesign">Nuevo diseño</a>
              </li>
              <li>
                <a href="#Perfil">Perfil</a>
              </li>
              <li>
                <a href="#Biblioteca">Biblioteca</a>
              </li>
              <li>
                <a href="#Bolsa">Bolsa</a>
              </li>
              <li>
                {inicioSesion ? (
                  <a href="#IniciarSesion">Iniciar sesión</a>
                ) : 
                
                <a href="#Perfil">{user}</a>}
              </li>

            </ul>
          </nav>
        </header>
        </div>
    );
  }
  
  export default Navbar;