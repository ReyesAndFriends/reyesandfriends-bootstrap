import React from "react";

const TermsAndConditions: React.FC = () => (
    <>
        <div className="callout" style={{ padding: 16 }}>
            <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src="/icons/help-about.svg"
                    alt="Acerca de"
                    style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
                />
                <div>
                    <h2 style={{ fontSize: 20, margin: 0 }}><strong>Términos y Condiciones</strong></h2>
                    <p className="lead" style={{ fontSize: 14, margin: 0 }}>
                        <span><strong>Última actualización:</strong> 17 de febrero de 2026.</span>
                    </p>
                </div>
            </div>
        </div>

        <div className="row align-center" style={{ marginTop: 40 }}>
            <div
                className="small-12 medium-10 columns"
                style={{
                    maxWidth: 800,
                    margin: '0 auto',
                    paddingLeft: 0,
                    paddingRight: 0
                }}
            >
                <div className="callout">
                    <h3><strong>1. Aceptación de Términos</strong></h3>
                    <p>
                        <span>El usuario acepta cumplir con estos términos y condiciones al utilizar la aplicación <strong>Reyes&Friends</strong>. Si no está de acuerdo con alguno de estos términos, por favor, no utilice la aplicación.</span>
                    </p>
                </div>


                <div className="callout">
                    <h3><strong>2. Uso Aceptable</strong></h3>
                    <p>
                        <span>La aplicación debe ser utilizada de manera responsable y respetuosa, principalmente porque es una herramienta simple pero útil para el despliegue a producción y desarrollo local.</span>
                    </p>
                    <p>
                        <span><strong>Reyes&Friends</strong> no se hace responsable por el uso indebido de la aplicación, incluyendo, pero no limitado a, la violación de leyes locales, nacionales o internacionales.</span>
                    </p>
                    <p>
                        <span>El origen de esta aplicación es la facilitación de generar archivos de configuración para despliegues a producción y desarrollo local, pero nunca para reemplazar la modificación manual de los archivos de configuración, por lo que se recomienda siempre revisar los archivos generados antes de su uso en entornos <strong>críticos</strong>.</span>
                    </p>
                    <p>

                    </p>
                </div>

                <div className="callout warning">
                    <h3><strong>3. Limitación de Responsabilidades</strong></h3>
                    <p>
                        <span>El usuario, ya sea desarrollador o administrador de sistemas, reconoce que el uso de <strong>Reyes&Friends Bootstrap</strong> es bajo su propio riesgo. La aplicación se proporciona <strong>"tal cual"</strong>, sin garantías de ningún tipo, ya sean expresas o implícitas. En ningún caso <strong>Reyes&Friends</strong> será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar la aplicación.</span>
                    </p>
                    <p>
                        <span>Si bien <strong>Reyes&Friends</strong> se esfuerza por mantener la aplicación libre de errores, no garantiza que la aplicación esté libre de defectos o que su funcionamiento sea ininterrumpido. El usuario es responsable de realizar copias de seguridad de sus datos y de tomar las precauciones necesarias para proteger su sistema.</span>
                    </p>
                    <p>
                        <span>En ningún caso <strong>Reyes&Friends</strong> será responsable por cualquier daño o pérdida de datos, interrupción del negocio, pérdida de ingresos o cualquier otro daño que surja del uso o la imposibilidad de usar la aplicación, incluso si <strong>Reyes&Friends</strong> ha sido advertido de la posibilidad de tales daños.</span>
                    </p>
                    <p>
                        <span>En caso de cualquier incidente dentro de un entorno de producción, <strong>Reyes&Friends</strong> no se hace responsable por la pérdida de datos, interrupción del servicio o cualquier otro daño que pueda resultar. El usuario es responsable de implementar medidas de seguridad adecuadas y de seguir las mejores prácticas para minimizar los riesgos asociados con el uso de la aplicación en entornos críticos.</span>
                    </p>
                </div>

                <div className="callout success">
                    <h3><strong>4. Cambios en los Términos</strong></h3>
                    <p>
                        <span>Los términos y condiciones pueden ser actualizados periódicamente. Se recomienda revisar esta página regularmente para estar al tanto de cualquier cambio. El uso continuado de la aplicación después de la publicación de cambios en los términos constituye la aceptación de dichos cambios.</span>
                    </p>
                </div>

                <div className="callout">
                    <h3><strong>5. Contacto</strong></h3>
                    <p>
                        <span>Para cualquier pregunta o inquietud sobre estos términos y condiciones, puede contactarnos por alguna de las siguientes vías:</span>
                    </p>
                </div>

                <div className="callout primary">
                    <h3><strong>Detalles de Contacto</strong></h3>
                    <div className="row">
                        <div className="small-12 medium-6 columns" style={{ marginBottom: 16 }}>
                            <p style={{ marginBottom: 8 }}>
                                <span><strong>Email:</strong></span>
                            </p>
                            <a href="mailto:support@reyesandfriends.com"><span>support@reyesandfriends.com</span></a>
                        </div>
                        <div className="small-12 medium-6 columns" style={{ marginBottom: 16 }}>
                            <p style={{ marginBottom: 8 }}>
                                <span><strong>Sitio Web:</strong></span>
                            </p>
                            <a href="https://www.reyesandfriends.cl" target="_blank" rel="noopener noreferrer">
                                <span>www.reyesandfriends.cl</span>
                            </a>
                        </div>
                        <div className="small-12 medium-6 columns" style={{ marginBottom: 16 }}>
                            <p style={{ marginBottom: 8 }}>
                                <span><strong>GitHub:</strong></span>
                            </p>
                            <a href="https://github.com/reyesandfriends" target="_blank" rel="noopener noreferrer">
                                <span>github.com/reyesandfriends</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default TermsAndConditions;
