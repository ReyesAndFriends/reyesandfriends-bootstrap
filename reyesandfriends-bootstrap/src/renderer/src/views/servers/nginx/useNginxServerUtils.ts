type NginxConfig = {
	domains: string;
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

function useNginxServerUtils() {
	function generateNginxConf(config: NginxConfig): string {
		const domains = config.domains.split(",").map(d => d.trim()).filter(Boolean);
		const serverName = domains[0] || "localhost";
		const serverAlias = domains.slice(1).join(" ");
		const docRoot = config.path || "/var/www/html";
		const proxy = config.isProxy;
		const proxyTarget = config.proxyTarget;

		let conf = "";

		// HTTP server block
		if (config.http) {
			if (config.redirect && config.https) {
				conf += `server {
	listen 80;
	server_name ${serverName}${serverAlias ? " " + serverAlias : ""};
	return 301 https://${serverName}$request_uri;
	access_log /var/log/nginx/${serverName}_access.log;
	error_log /var/log/nginx/${serverName}_error.log;
}

`;
			} else {
				conf += `server {
	listen 80;
	server_name ${serverName}${serverAlias ? " " + serverAlias : ""};
	${proxy
			? `
	location / {
		proxy_pass http://${proxyTarget};
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
	`
			: `
	root ${docRoot};
	index index.html index.htm;
	location / {
		try_files $uri $uri/ =404;
	}
	`}
	access_log /var/log/nginx/${serverName}_access.log;
	error_log /var/log/nginx/${serverName}_error.log;
}

`;
			}
		}

		// HTTPS server block
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
			conf += `server {
	listen 443 ssl;
	server_name ${serverName}${serverAlias ? " " + serverAlias : ""};
	ssl_certificate ${sslCert};
	ssl_certificate_key ${sslKey};
	ssl_protocols TLSv1.2 TLSv1.3;
	ssl_ciphers HIGH:!aNULL:!MD5;
	${proxy
			? `
	location / {
		proxy_pass http://${proxyTarget};
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
	`
			: `
	root ${docRoot};
	index index.html index.htm;
	location / {
		try_files $uri $uri/ =404;
	}
	`}
	access_log /var/log/nginx/${serverName}_ssl_access.log;
	error_log /var/log/nginx/${serverName}_ssl_error.log;
}
`;
		}

		return conf.trim();
	}

	return { generateNginxConf };
}

export default useNginxServerUtils;
