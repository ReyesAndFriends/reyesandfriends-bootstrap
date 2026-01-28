import React from "react";

const About: React.FC = () => (
  <>
    <div className="callout" style={{ padding: 16 }}>
      <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/icons/help-about.svg"
          alt="Acerca de"
          style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
        />
        <div>
          <h2 style={{ fontSize: 20, margin: 0 }}>Acerca de la aplicación</h2>
          <p className="lead" style={{ fontSize: 14, margin: 0 }}>
            Información sobre el proyecto y su licencia.
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
        <div className="callout primary">
          <h4>Reyes & Friends Bootstrap</h4>
          <p>
            Aplicación desarrollada por <strong>Marcos Reyes</strong> y colaboradores.
          </p>
          <p>
            Esta aplicación está diseñada para facilitar la gestión de proyectos y configuraciones en un entorno de escritorio.
          </p>
        </div>
        <div className="callout">
          <h5>Licencia</h5>
          <p>
            <button
              className="button tiny secondary"
              style={{ marginBottom: 8 }}
              onClick={() =>
                window.open(
                  "https://github.com/reyesandfriends/reyesandfriends-bootstrap/blob/main/LICENSE",
                  "_blank"
                )
              }
            >
              MIT License
            </button>
            <br />
            Puedes usar, modificar y distribuir este software libremente.
          </p>
        </div>
        <div className="text-center">
          <small>© {new Date().getFullYear()} Reyes&Friends</small>
        </div>
        <div style={{ marginTop: 40 }}>
          <div className="callout success">
            <h5>Agradecimientos</h5>
            <ul style={{ marginBottom: 0 }}>
              <li>Colaboradores y usuarios de la comunidad</li>
              <li>Open Source contributors</li>
            </ul>
          </div>
          <div className="callout warning">
            <h5>Tecnologías utilizadas</h5>
            <div className="grid-x grid-margin-x align-center-middle" style={{ marginTop: 16 }}>

              <div className="cell small-6 medium-3" style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  padding: 16,
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{ height: 40, marginBottom: 8 }}>
                    <img src="/icons/electron.svg" alt="Electron" style={{ height: 40 }} />
                  </div>
                  <strong>Electron</strong>
                </div>
              </div>

              <div className="cell small-6 medium-3" style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  padding: 16,
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{ height: 40, marginBottom: 8 }}>
                    <img src="/icons/foundation-favicon.ico" alt="Foundation CSS" style={{ height: 40 }} />
                  </div>
                  <strong>Foundation</strong>
                </div>
              </div>

              <div className="cell small-6 medium-3" style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  padding: 16,
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{ height: 40, marginBottom: 8 }}>
                    <img src="/icons/react.svg" alt="React" style={{ height: 40 }} />
                  </div>
                  <strong>React</strong>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default About;
