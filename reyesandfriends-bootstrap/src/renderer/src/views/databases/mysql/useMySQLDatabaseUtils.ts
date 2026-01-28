

export function generateMySQLScript(config) {
	// config: { dbName, userName, userPassword, privileges, host, charset }
	const db = config.dbName;
	const user = config.userName;
	const pass = config.userPassword;
	const privs = config.privileges;
	const host = config.host || "localhost";
	const charset = config.charset || "utf8mb4";
	let sql = `CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET ${charset};\n`;
	sql += `CREATE USER IF NOT EXISTS '${user}'@'${host}' IDENTIFIED BY '${pass}';\n`;
	sql += `GRANT ${privs} ON \`${db}\`.* TO '${user}'@'${host}';\n`;
	sql += `FLUSH PRIVILEGES;\n`;
	return sql;
}

export function useMySQLDatabaseUtils() {
	return { generateMySQLScript };
}
