import sqlite3
from config import DB_PATH

def ensure_nginx_db():
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute("""
		CREATE TABLE IF NOT EXISTS nginx_configs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			server_names TEXT NOT NULL,
			http_enabled INTEGER DEFAULT 1,
			https_enabled INTEGER DEFAULT 0,
			docroot TEXT DEFAULT '/var/www/html',
			ssl_preset TEXT DEFAULT 'certbot',
			ssl_cert TEXT DEFAULT '',
			redirect_http INTEGER DEFAULT 0,
			is_proxy INTEGER DEFAULT 0,
			proxy_target TEXT DEFAULT ''
		)
	""")
	# Migraciones para agregar columnas nuevas si no existen
	try: c.execute("ALTER TABLE nginx_configs ADD COLUMN ssl_preset TEXT DEFAULT 'certbot'")
	except sqlite3.OperationalError: pass
	try: c.execute("ALTER TABLE nginx_configs ADD COLUMN ssl_cert TEXT DEFAULT ''")
	except sqlite3.OperationalError: pass
	try: c.execute("ALTER TABLE nginx_configs ADD COLUMN redirect_http INTEGER DEFAULT 0")
	except sqlite3.OperationalError: pass
	try: c.execute("ALTER TABLE nginx_configs ADD COLUMN is_proxy INTEGER DEFAULT 0")
	except sqlite3.OperationalError: pass
	try: c.execute("ALTER TABLE nginx_configs ADD COLUMN proxy_target TEXT DEFAULT ''")
	except sqlite3.OperationalError: pass
	conn.commit()
	conn.close()

def create_nginx_config(server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target):
	ensure_nginx_db()
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute(
		"INSERT INTO nginx_configs (server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		(server_names, int(http_enabled), int(https_enabled), docroot, ssl_preset, ssl_cert, int(redirect_http), int(is_proxy), proxy_target)
	)
	conn.commit()
	conn.close()

def list_nginx_configs():
	ensure_nginx_db()
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute("SELECT id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target FROM nginx_configs")
	rows = c.fetchall()
	conn.close()
	return rows

def update_nginx_config(id_, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target):
	ensure_nginx_db()
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute(
		"UPDATE nginx_configs SET server_names=?, http_enabled=?, https_enabled=?, docroot=?, ssl_preset=?, ssl_cert=?, redirect_http=?, is_proxy=?, proxy_target=? WHERE id=?",
		(server_names, int(http_enabled), int(https_enabled), docroot, ssl_preset, ssl_cert, int(redirect_http), int(is_proxy), proxy_target, id_)
	)
	conn.commit()
	conn.close()

def delete_nginx_config(id_):
	ensure_nginx_db()
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute("DELETE FROM nginx_configs WHERE id=?", (id_,))
	conn.commit()
	conn.close()

def get_nginx_config(id_):
	ensure_nginx_db()
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute("SELECT id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target FROM nginx_configs WHERE id=?", (id_,))
	row = c.fetchone()
	conn.close()
	return row
