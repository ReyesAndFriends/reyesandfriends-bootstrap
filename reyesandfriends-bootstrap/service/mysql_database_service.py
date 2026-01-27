import sqlite3
import secrets
import string
from config import DB_PATH, CONFIG_DIR
from cryptography.fernet import Fernet
import os

FERNET_KEY_PATH = os.path.join(CONFIG_DIR, "fernet.key")

def get_fernet():
    if not os.path.exists(FERNET_KEY_PATH):
        os.makedirs(CONFIG_DIR, exist_ok=True)
        key = Fernet.generate_key()
        with open(FERNET_KEY_PATH, "wb") as f:
            f.write(key)
    else:
        with open(FERNET_KEY_PATH, "rb") as f:
            key = f.read()
    return Fernet(key)

def encrypt_password(password):
    f = get_fernet()
    return f.encrypt(password.encode()).decode()

def decrypt_password(token):
    f = get_fernet()
    return f.decrypt(token.encode()).decode()

def ensure_mysql_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS mysql_databases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        db_name TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_password TEXT NOT NULL,
        privileges TEXT NOT NULL,
        host TEXT DEFAULT 'localhost',
        preset TEXT DEFAULT '',
        charset TEXT DEFAULT 'utf8mb4'
    )
    """)

    try:
        c.execute("ALTER TABLE mysql_databases ADD COLUMN host TEXT DEFAULT 'localhost'")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE mysql_databases ADD COLUMN preset TEXT DEFAULT ''")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE mysql_databases ADD COLUMN charset TEXT DEFAULT 'utf8mb4'")
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()

def generate_password(length=20):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_mysql_database(db_name, user_name, user_password, privileges, host='localhost', preset='', charset='utf8mb4'):
    ensure_mysql_db()
    enc_pass = encrypt_password(user_password)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO mysql_databases (db_name, user_name, user_password, privileges, host, preset, charset) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (db_name, user_name, enc_pass, privileges, host, preset, charset)
    )
    conn.commit()
    conn.close()

def list_mysql_databases():
    ensure_mysql_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, db_name, user_name, user_password, privileges, host, preset, charset FROM mysql_databases")
    rows = c.fetchall()
    conn.close()

    masked = []
    for row in rows:
        row = list(row)
        row[3] = "********"  
        masked.append(tuple(row))
    return masked

def update_mysql_database(id_, db_name, user_name, user_password, privileges, host='localhost', preset='', charset='utf8mb4'):
    ensure_mysql_db()
    enc_pass = encrypt_password(user_password)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "UPDATE mysql_databases SET db_name=?, user_name=?, user_password=?, privileges=?, host=?, preset=?, charset=? WHERE id=?",
        (db_name, user_name, enc_pass, privileges, host, preset, charset, id_)
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
    c.execute("SELECT id, db_name, user_name, user_password, privileges, host, preset, charset FROM mysql_databases WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    if row:
        row = list(row)
        # Descifra la password para mostrarla en el diálogo de edición
        try:
            row[3] = decrypt_password(row[3])
        except Exception:
            row[3] = ""
        return tuple(row)
    return row

# Presets de privilegios
MYSQL_PRIV_PRESETS = {
    "produccion": "SELECT,INSERT,UPDATE,DELETE,CREATE,INDEX,ALTER",
    "desarrollo": "ALL PRIVILEGES",
    "solo_lectura": "SELECT",
}

def get_privileges_for_preset(preset):
    return MYSQL_PRIV_PRESETS.get(preset, "")

def generate_mysql_sql(db_name, user_name, user_password, privileges, host='localhost', charset='utf8mb4'):
    # Incluye charset en la creación de la base de datos
    sql = f"""CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET {charset};

CREATE USER IF NOT EXISTS '{user_name}'@'{host}' IDENTIFIED BY '{user_password}';

GRANT {privileges} ON `{db_name}`.* TO '{user_name}'@'{host}';

FLUSH PRIVILEGES;
"""
    return sql