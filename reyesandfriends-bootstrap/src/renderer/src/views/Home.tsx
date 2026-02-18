import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div
        className="callout"
        style={{
          background: 'linear-gradient(180deg, #8B0000 0%, #961832 25%, #9d2c2c 50%, #8B0000 75%, #660000 100%)',
          color: 'white',
          padding: 12
        }}
      >
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
        src="/icons/app_icon.png"
        alt="Icono"
        style={{ width: 80, height: "auto", marginRight: 16, background: 'transparent' }}
          />
          <div>
        <h2 style={{ color: 'white', fontSize: 22, margin: 0 }}>Reyes&Friends - Bootstrap</h2>
        <p className="lead" style={{ color: 'white', fontSize: 16, margin: 0 }}>
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

          <Link to="/secret-keys" className="callout" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <img
              src="/icons/lock.svg"
              alt="Claves secretas"
              style={{ width: 40, height: 40, marginRight: 20 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>Claves secretas</div>
              <div style={{ color: '#555', fontSize: 14 }}>Gestiona y genera claves secretas para tus aplicaciones.</div>
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

      <div
        className="callout warning"
        style={{
          marginTop: 60,
          marginBottom: 20,
          fontSize: 16,
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <strong>Nota importante:</strong> Esta aplicación es una herramienta de apoyo para desarrolladores y administradores de sistemas, puede contener errores o generar configuraciones que requieran ajustes adicionales.
        Nunca dependas completamente de las configuraciones generadas sin revisarlas cuidadosamente. 
        <br /><br /> Siempre verifica y ajusta las configuraciones según las necesidades específicas
        de tu entorno antes de implementarlas en producción!
        <br /><br />
        Se recomienda leer los <Link to="/terms-and-conditions"><strong>Términos y Condiciones</strong></Link> antes de utilizar la aplicación. Se considera que al utilizar la aplicación, el usuario acepta los términos y condiciones establecidos en dicho documento.
      </div>

    </>
  );
}

export default Home;