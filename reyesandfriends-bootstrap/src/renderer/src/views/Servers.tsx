import { Link } from "react-router-dom";

function Servers() {
  return (
    <>
      <div className="callout" style={{ padding: 16 }}>
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
        src="/icons/network-server.svg"
        alt="Servidor HTTP"
        style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
          />
          <div>
        <h2 style={{ fontSize: 20, margin: 0 }}>Servidores HTTP</h2>
        <p className="lead" style={{ fontSize: 14, margin: 0 }}>
          Genera configuraciones para servidores HTTP como Apache o Nginx
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
          <Link
            to="/http-servers/apache"
            className="callout"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
              padding: '28px 28px',
              minHeight: 80
            }}
          >
            <img
              src="/icons/http-servers/apache.svg"
              alt="Apache"
              style={{ width: 56, height: 56, marginRight: 28 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>Apache</div>
              <div style={{ color: '#555', fontSize: 16 }}>Genera y personaliza configuraciones para Apache HTTP Server.</div>
            </div>
          </Link>

          <Link
            to="/http-servers/nginx"
            className="callout"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '28px 28px',
              minHeight: 80
            }}
          >
            <img
              src="/icons/http-servers/nginx.svg"
              alt="Nginx"
              style={{ width: 56, height: 56, marginRight: 28 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>Nginx</div>
              <div style={{ color: '#555', fontSize: 16 }}>Crea archivos de configuración para Nginx de forma sencilla.</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Servers;