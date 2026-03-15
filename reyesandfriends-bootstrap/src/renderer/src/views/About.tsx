import React from "react";
import { Link } from "react-router-dom";
import helpAboutIcon from "@renderer/icons/help-about.svg";
import electronIcon from "@renderer/icons/electron.svg";
import foundationIcon from "@renderer/icons/foundation-favicon.ico";
import reactIcon from "@renderer/icons/react.svg";

const About: React.FC = () => (
  <>
    <div className="callout" style={{ padding: 16 }}>
      <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={helpAboutIcon}
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
          <h4>Reyes & Friends - Bootstrap</h4>
            <small style={{ display: "block", marginBottom: 8, textAlign: "center" }}>Versión 1.0.0</small>
          <p>
            Aplicación desarrollada por <Link to="https://github.com/AstronautMarkus" target="_blank"><strong>AstronautMarkusDev (Marcos Reyes)</strong></Link> para <Link to="https://www.reyesandfriends.cl" target="_blank"><strong>Reyes&Friends</strong></Link> y la comunidad de usuarios.
          </p>
          <p>
            Esta aplicación está diseñada para facilitar la gestión de proyectos y configuraciones en un entorno de escritorio. Proporciona una interfaz sencilla y eficiente para usuarios que buscan una solución fácil de usar.
          </p>
        </div>
        <div className="callout">
          <h5>Licencia</h5>
          <p style={{ textAlign: "center", marginBottom: 16 }}>
            Esta aplicación está licenciada bajo la licencia MIT. Puedes copiar, modificar y distribuir el software como desees.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="button tiny warning"
              onClick={() =>
          window.open(
            "https://github.com/reyesandfriends/reyesandfriends-bootstrap/blob/main/LICENSE",
            "_blank"
          )
              }
            >
              MIT License
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <div className="callout success">
            <h5>Agradecimientos</h5>
            <ul style={{ marginBottom: 0 }}>
              <li>Colaboradores y usuarios de la comunidad</li>
              <li>Open Source contributors</li>
            </ul>
          </div>

          <div className="callout info">
            <h5>Términos y Condiciones</h5>
            <ul style={{ marginBottom: 0 }}>
              <li>Se pide explicitamente a los usuarios que lean los términos y condiciones antes de usar la aplicación.</li>
              <li>El uso de esta aplicación implica la aceptación de los términos y condiciones establecidos.</li>
              <li>Los términos y condiciones pueden ser actualizados periódicamente, por lo que se recomienda revisarlos regularmente.</li>
                <li style={{ textAlign: "center", marginTop: 16, listStyle: "none" }}>
                  <Link to="/terms-and-conditions" className="button info">Leer términos y condiciones</Link>
              </li>
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
                    <img src={electronIcon} alt="Electron" style={{ height: 40 }} />
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
                    <img src={foundationIcon} alt="Foundation CSS" style={{ height: 40 }} />
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
                    <img src={reactIcon} alt="React" style={{ height: 40 }} />
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
