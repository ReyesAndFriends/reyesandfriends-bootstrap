import { Link } from "react-router-dom";
import sqliteBrowserIcon from "@renderer/icons/sqlitebrowser.svg";
import mysqlIcon from "@renderer/icons/databases/mysql.svg";
import postgresqlIcon from "@renderer/icons/databases/postgresql.svg";

function Databases() {
  return (
    <>
      <div className="callout" style={{ padding: 16 }}>
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={sqliteBrowserIcon}
            alt="Base de datos"
            style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
          />
          <div>
            <h2 style={{ fontSize: 20, margin: 0 }}>Bases de Datos</h2>
            <p className="lead" style={{ fontSize: 14, margin: 0 }}>
              Genera configuraciones para bases de datos como MySQL o PostgreSQL
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
            to="/databases/mysql"
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
              src={mysqlIcon}
              alt="MySQL"
              style={{ width: 56, height: 56, marginRight: 28 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>MySQL</div>
              <div style={{ color: '#555', fontSize: 16 }}>Genera scripts .sql para MySQL para desarrollo o producción.</div>
            </div>
          </Link>

          <Link
            to="/databases/postgresql"
            className="callout"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '28px 28px',
              minHeight: 80
            }}
          >
            <img
              src={postgresqlIcon}
              alt="PostgreSQL"
              style={{ width: 56, height: 56, marginRight: 28 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>PostgreSQL</div>
              <div style={{ color: '#555', fontSize: 16 }}>Crea archivos .sql compatibles con PostgreSQL para tus proyectos.</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Databases;