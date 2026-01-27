import sqlite3
import secrets
import string
from config import DB_PATH

def ensure_mysql_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS mysql_databases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        db_name TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_password TEXT NOT NULL,
        privileges TEXT NOT NULL, -- Coma separada: SELECT,INSERT,...
        host TEXT DEFAULT 'localhost',
        preset TEXT DEFAULT ''
    )
    """)
    conn.commit()
    conn.close()

def generate_password(length=20):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_mysql_database(db_name, user_name, user_password, privileges, host='localhost', preset=''):
    ensure_mysql_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO mysql_databases (db_name, user_name, user_password, privileges, host, preset) VALUES (?, ?, ?, ?, ?, ?)",
        (db_name, user_name, user_password, privileges, host, preset)
    )
    conn.commit()
    conn.close()

def list_mysql_databases():
    ensure_mysql_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, db_name, user_name, user_password, privileges, host, preset FROM mysql_databases")
    rows = c.fetchall()
    conn.close()
    return rows

def update_mysql_database(id_, db_name, user_name, user_password, privileges, host='localhost', preset=''):
    ensure_mysql_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "UPDATE mysql_databases SET db_name=?, user_name=?, user_password=?, privileges=?, host=?, preset=? WHERE id=?",
        (db_name, user_name, user_password, privileges, host, preset, id_)
    )
    conn.commit()
    conn.close()

def delete_mysql_database(id_):
    ensure_mysql_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM mysql_databases WHERE id=?", (id_,))
    conn.commit()
    conn.close()

def get_mysql_database(id_):
    ensure_mysql_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, db_name, user_name, user_password, privileges, host, preset FROM mysql_databases WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    return row

# Presets de privilegios
MYSQL_PRIV_PRESETS = {
    "produccion": "SELECT,INSERT,UPDATE,DELETE,CREATE,INDEX,ALTER",
    "desarrollo": "ALL PRIVILEGES",
    "solo_lectura": "SELECT",
}

def get_privileges_for_preset(preset):
    return MYSQL_PRIV_PRESETS.get(preset, "")

def generate_mysql_sql(db_name, user_name, user_password, privileges, host='localhost'):
    # Genera un script SQL para crear la base de datos, usuario y asignar privilegios
    sql = f"""CREATE DATABASE IF NOT EXISTS `{db_name}`;

CREATE USER IF NOT EXISTS '{user_name}'@'{host}' IDENTIFIED BY '{user_password}';

GRANT {privileges} ON `{db_name}`.* TO '{user_name}'@'{host}';

FLUSH PRIVILEGES;
"""
    return sql