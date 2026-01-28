import React from "react";

const About: React.FC = () => (
  <div className="grid-container">
    <div className="grid-x grid-padding-x align-center">
      <div className="cell medium-8">
        <h1 className="text-center">Acerca de la aplicación</h1>
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
            MIT License. Puedes usar, modificar y distribuir este software libremente.
          </p>
        </div>
        <div className="text-center">
          <small>© {new Date().getFullYear()} Reyes&Friends</small>
        </div>
      </div>
    </div>
  </div>
);

export default About;
