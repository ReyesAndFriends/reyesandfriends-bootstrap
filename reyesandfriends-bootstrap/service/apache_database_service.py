import sqlite3
from config import DB_PATH

def ensure_apache_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS apache_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            server_names TEXT NOT NULL,
            http_enabled INTEGER DEFAULT 1,
            https_enabled INTEGER DEFAULT 0,
            docroot TEXT DEFAULT '/var/www/html',
            ssl_preset TEXT DEFAULT 'certbot',
            ssl_cert TEXT DEFAULT '',
            redirect_http INTEGER DEFAULT 0
        )
    """)
    # Migraciones para agregar columnas nuevas si no existen
    try: c.execute("ALTER TABLE apache_configs ADD COLUMN ssl_preset TEXT DEFAULT 'certbot'")
    except sqlite3.OperationalError: pass
    try: c.execute("ALTER TABLE apache_configs ADD COLUMN ssl_cert TEXT DEFAULT ''")
    except sqlite3.OperationalError: pass
    try: c.execute("ALTER TABLE apache_configs ADD COLUMN redirect_http INTEGER DEFAULT 0")
    except sqlite3.OperationalError: pass
    conn.commit()
    conn.close()

def create_apache_config(server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO apache_configs (server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (server_names, int(http_enabled), int(https_enabled), docroot, ssl_preset, ssl_cert, int(redirect_http))
    )
    conn.commit()
    conn.close()

def list_apache_configs():
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http FROM apache_configs")
    rows = c.fetchall()
    conn.close()
    return rows

def update_apache_config(id_, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "UPDATE apache_configs SET server_names=?, http_enabled=?, https_enabled=?, docroot=?, ssl_preset=?, ssl_cert=?, redirect_http=? WHERE id=?",
        (server_names, int(http_enabled), int(https_enabled), docroot, ssl_preset, ssl_cert, int(redirect_http), id_)
    )
    conn.commit()
    conn.close()

def delete_apache_config(id_):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM apache_configs WHERE id=?", (id_,))
    conn.commit()
    conn.close()

def get_apache_config(id_):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http FROM apache_configs WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    return row
