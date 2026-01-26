import sqlite3
from config import DB_PATH

def ensure_apache_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS apache_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            server_names TEXT NOT NULL,
            port INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def create_apache_config(server_names, port):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO apache_configs (server_names, port) VALUES (?, ?)", (server_names, port))
    conn.commit()
    conn.close()

def list_apache_configs():
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, server_names, port FROM apache_configs")
    rows = c.fetchall()
    conn.close()
    return rows

def update_apache_config(id_, server_names, port):
    ensure_apache_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE apache_configs SET server_names=?, port=? WHERE id=?", (server_names, port, id_))
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
    c.execute("SELECT id, server_names, port FROM apache_configs WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    return row
