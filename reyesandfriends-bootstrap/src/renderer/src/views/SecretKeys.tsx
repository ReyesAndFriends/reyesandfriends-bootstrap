import { Link } from "react-router-dom";

function SecretKeys() {
  return (
    <>
      <div className="callout" style={{ padding: 16 }}>
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/icons/lock.svg"
            alt="Claves secretas"
            style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
          />
          <div>
            <h2 style={{ fontSize: 20, margin: 0 }}>Claves Secretas</h2>
            <p className="lead" style={{ fontSize: 14, margin: 0 }}>
              Gestiona y genera claves secretas para tus proyectos de desarrollo y producción.
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
            to="/secret-keys/flask"
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
              src="/icons/secret-keys/flask.svg"
              alt="Flask"
              style={{ width: 56, height: 56, marginRight: 28 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>Flask</div>
              <div style={{ color: '#555', fontSize: 16 }}>Genera claves secretas para tus proyectos de desarrollo y producción.</div>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}

export default SecretKeys;