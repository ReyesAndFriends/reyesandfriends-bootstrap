import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div
        className="callout"
        style={{
          background: 'linear-gradient(135deg, #7d0e0e 0%, rgb(132, 17, 17) 100%)',
          color: 'white'
        }}
      >
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/icons/app_icon.png"
            alt="Icono"
            style={{ width: 64, height: 64, marginRight: 24, background: 'transparent' }}
          />
          <div>
            <h2 style={{ color: 'white' }}>Simplifica tus tareas repetitivas</h2>
            <p className="lead" style={{ color: 'white' }}>
              Un gestor de utilidades para desarrolladores y administradores de sistemas para una puesta a producción rápida.
            </p>
          </div>
        </div>
      </div>

      <div className="callout" style={{ padding: 16 }}>
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/icons/folder.svg"
            alt="Inicio"
            style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
          />
          <div>
            <h2 style={{ fontSize: 20, margin: 0 }}>Te damos la bienvenida</h2>
            <p className="lead" style={{ fontSize: 14, margin: 0 }}>
              Selecciona una de las categorías a continuación para comenzar a generar configuraciones y gestionar tus herramientas.
            </p>
          </div>
        </div>
      </div>

      <div className="row align-center" style={{ marginTop: 40 }}>
        <div
          className="small-12 columns"
          style={{
            maxWidth: 500,
            margin: '0 auto',
            paddingLeft: 0,
            paddingRight: 0
          }}
        >

          <Link to="/http-servers" className="callout" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <img
              src="/icons/network-server.svg"
              alt="Servidor"
              style={{ width: 40, height: 40, marginRight: 20 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>Servidores HTTP</div>
              <div style={{ color: '#555', fontSize: 14 }}>Genera configuraciones para servidores HTTP como Apache o Nginx.</div>
            </div>
          </Link>

          <Link to="/databases" className="callout" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <img
              src="/icons/sqlitebrowser.svg"
              alt="Base de datos"
              style={{ width: 40, height: 40, marginRight: 20 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>Bases de datos</div>
              <div style={{ color: '#555', fontSize: 14 }}>Herramientas para gestión y migración de bases de datos.</div>
            </div>
          </Link>

          <Link to="/preferences" className="callout" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/icons/preferences-desktop-icons.svg"
              alt="Herramientas"
              style={{ width: 40, height: 40, marginRight: 20 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>Preferencias</div>
              <div style={{ color: '#555', fontSize: 14 }}>Gestiona las configuraciones de la aplicación.</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;