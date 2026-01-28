type ApacheConfig = {
  dominios: string;
  http: boolean;
  https: boolean;
  path: string;
  ssl: "certbot" | "snakeoil" | "custom";
  sslCustomCert?: string;
  sslCustomKey?: string;
  sslCustom?: string;
  redirect: boolean;
  isProxy: boolean;
  proxyTarget: string;
};

function useApacheServerUtils() {
  function generateApacheConf(config: ApacheConfig): string {
    const dominios = config.dominios.split(",").map(d => d.trim()).filter(Boolean);
    const serverName = dominios[0] || "localhost";
    const serverAlias = dominios.slice(1).join(" ");
    const docRoot = config.path || "/var/www/html";
    const proxy = config.isProxy;
    const proxyTarget = config.proxyTarget;

    let conf = "";

    // HTTP
    if (config.http) {
      conf += `<VirtualHost *:80>
  ServerName ${serverName}
  ${serverAlias ? `ServerAlias ${serverAlias}` : ""}
  ${proxy
    ? `
  ProxyPreserveHost On
  ProxyPass / http://${proxyTarget}/
  ProxyPassReverse / http://${proxyTarget}/
  `
    : `
  DocumentRoot ${docRoot}
  <Directory ${docRoot}>
    AllowOverride All
    Require all granted
  </Directory>
  `}
  ${config.redirect && config.https ? `Redirect permanent / https://${serverName}/` : ""}
  ErrorLog \${APACHE_LOG_DIR}/${serverName}_error.log
  CustomLog \${APACHE_LOG_DIR}/${serverName}_access.log combined
</VirtualHost>

`;
    }

    // HTTPS
    if (config.https) {
      let sslCert = "";
      let sslKey = "";
      if (config.ssl === "certbot") {
        sslCert = `/etc/letsencrypt/live/${serverName}/fullchain.pem`;
        sslKey = `/etc/letsencrypt/live/${serverName}/privkey.pem`;
      } else if (config.ssl === "snakeoil") {
        sslCert = "/etc/ssl/certs/ssl-cert-snakeoil.pem";
        sslKey = "/etc/ssl/private/ssl-cert-snakeoil.key";
      } else if (config.ssl === "custom") {
        sslCert = config.sslCustomCert || "";
        sslKey = config.sslCustomKey || "";
      }
      conf += `<IfModule mod_ssl.c>
<VirtualHost *:443>
  ServerName ${serverName}
  ${serverAlias ? `ServerAlias ${serverAlias}` : ""}
  ${proxy
    ? `
  ProxyPreserveHost On
  ProxyPass / http://${proxyTarget}/
  ProxyPassReverse / http://${proxyTarget}/
  `
    : `
  DocumentRoot ${docRoot}
  <Directory ${docRoot}>
    AllowOverride All
    Require all granted
  </Directory>
  `}
  SSLEngine on
  SSLCertificateFile ${sslCert}
  SSLCertificateKeyFile ${sslKey}
  ErrorLog \${APACHE_LOG_DIR}/${serverName}_ssl_error.log
  CustomLog \${APACHE_LOG_DIR}/${serverName}_ssl_access.log combined
</VirtualHost>
</IfModule>
`;
    }

    return conf.trim();
  }

  return { generateApacheConf };
}

export default useApacheServerUtils;
