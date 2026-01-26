import sqlite3
from config import DB_PATH

def ensure_apache_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Añadir columna docroot si no existe
    c.execute("""
        CREATE TABLE IF NOT EXISTS apache_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            server_names TEXT NOT NULL,
            port INTEGER NOT NULL,
            docroot TEXT DEFAULT '/var/www/html'
        )
    """)
    # Intentar agregar la columna docroot si no existe (para migraciones antiguas)
    try:
        c.execute("ALTER TABLE apache_configs ADD COLUMN docroot TEXT DEFAULT '/var/www/html'")
    except sqlite3.OperationalError:
        pass  # Ya existe
    conn.commit()
    conn.close()

def create_apache_config(server_names, port, docroot):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO apache_configs (server_names, port, docroot) VALUES (?, ?, ?)",
        (server_names, port, docroot)
    )
    conn.commit()
    conn.close()

def list_apache_configs():
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, server_names, port, docroot FROM apache_configs")
    rows = c.fetchall()
    conn.close()
    return rows

def update_apache_config(id_, server_names, port, docroot):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "UPDATE apache_configs SET server_names=?, port=?, docroot=? WHERE id=?",
        (server_names, port, docroot, id_)
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
    c.execute("SELECT id, server_names, port, docroot FROM apache_configs WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    return row
