import React, { useState } from "react";

const Preferences: React.FC = () => {
  const [workPath, setWorkPath] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se manejará el path en el futuro (integración con Electron)
    alert(`Path de trabajo guardado: ${workPath}`);
  };

  return (
    <div className="grid-container">
      <div className="grid-x grid-padding-x align-center">
        <div className="cell medium-6">
          <h2 className="text-center">Preferencias</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Path de trabajo
              <input
                type="text"
                placeholder="Ejemplo: /home/usuario/proyectos"
                value={workPath}
                onChange={e => setWorkPath(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="button primary expanded">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
