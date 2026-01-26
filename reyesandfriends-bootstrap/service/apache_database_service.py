import sqlite3
from config import DB_PATH

def ensure_apache_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Crear tabla con los nuevos campos http_enabled y https_enabled
    c.execute("""
        CREATE TABLE IF NOT EXISTS apache_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            server_names TEXT NOT NULL,
            http_enabled INTEGER DEFAULT 1,
            https_enabled INTEGER DEFAULT 0,
            docroot TEXT DEFAULT '/var/www/html'
        )
    """)
    # Migración: agregar columnas si no existen
    try:
        c.execute("ALTER TABLE apache_configs ADD COLUMN http_enabled INTEGER DEFAULT 1")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE apache_configs ADD COLUMN https_enabled INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE apache_configs ADD COLUMN docroot TEXT DEFAULT '/var/www/html'")
    except sqlite3.OperationalError:
        pass
    # Eliminar columna port si existe (opcional, SQLite no soporta DROP COLUMN directamente)
    conn.commit()
    conn.close()

def create_apache_config(server_names, http_enabled, https_enabled, docroot):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO apache_configs (server_names, http_enabled, https_enabled, docroot) VALUES (?, ?, ?, ?)",
        (server_names, int(http_enabled), int(https_enabled), docroot)
    )
    conn.commit()
    conn.close()

def list_apache_configs():
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, server_names, http_enabled, https_enabled, docroot FROM apache_configs")
    rows = c.fetchall()
    conn.close()
    return rows

def update_apache_config(id_, server_names, http_enabled, https_enabled, docroot):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "UPDATE apache_configs SET server_names=?, http_enabled=?, https_enabled=?, docroot=? WHERE id=?",
        (server_names, int(http_enabled), int(https_enabled), docroot, id_)
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
    c.execute("SELECT id, server_names, http_enabled, https_enabled, docroot FROM apache_configs WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    return row
