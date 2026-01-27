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

def ensure_postgre_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS postgre_databases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        db_name TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_password TEXT NOT NULL,
        privileges TEXT NOT NULL,
        host TEXT DEFAULT 'localhost',
        preset TEXT DEFAULT '',
        encoding TEXT DEFAULT 'UTF8'
    )
    """)
    try:
        c.execute("ALTER TABLE postgre_databases ADD COLUMN host TEXT DEFAULT 'localhost'")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE postgre_databases ADD COLUMN preset TEXT DEFAULT ''")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE postgre_databases ADD COLUMN encoding TEXT DEFAULT 'UTF8'")
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()

def generate_password(length=20):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_postgre_database(db_name, user_name, user_password, privileges, host='localhost', preset='', encoding='UTF8'):
    ensure_postgre_db()
    enc_pass = encrypt_password(user_password)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO postgre_databases (db_name, user_name, user_password, privileges, host, preset, encoding) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (db_name, user_name, enc_pass, privileges, host, preset, encoding)
    )
    conn.commit()
    conn.close()

def list_postgre_databases():
    ensure_postgre_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, db_name, user_name, user_password, privileges, host, preset, encoding FROM postgre_databases")
    rows = c.fetchall()
    conn.close()

    masked = []
    for row in rows:
        row = list(row)
        row[3] = "********"
        masked.append(tuple(row))
    return masked

def update_postgre_database(id_, db_name, user_name, user_password, privileges, host='localhost', preset='', encoding='UTF8'):
    ensure_postgre_db()
    enc_pass = encrypt_password(user_password)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "UPDATE postgre_databases SET db_name=?, user_name=?, user_password=?, privileges=?, host=?, preset=?, encoding=? WHERE id=?",
        (db_name, user_name, enc_pass, privileges, host, preset, encoding, id_)
    )
    conn.commit()
    conn.close()

def delete_postgre_database(id_):
    ensure_postgre_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM postgre_databases WHERE id=?", (id_,))
    conn.commit()
    conn.close()

def get_postgre_database(id_):
    ensure_postgre_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, db_name, user_name, user_password, privileges, host, preset, encoding FROM postgre_databases WHERE id=?", (id_,))
    row = c.fetchone()
    conn.close()
    if row:
        row = list(row)
        try:
            row[3] = decrypt_password(row[3])
        except Exception:
            row[3] = ""
        return tuple(row)
    return row

# Presets de privilegios para PostgreSQL
POSTGRE_PRIV_PRESETS = {
    "produccion": "CONNECT,TEMPORARY,CREATE",
    "desarrollo": "ALL PRIVILEGES",
    "solo_lectura": "CONNECT",
}

def get_privileges_for_preset(preset):
    return POSTGRE_PRIV_PRESETS.get(preset, "")

def generate_postgre_sql(db_name, user_name, user_password, privileges, host='localhost', encoding='UTF8',
                         grant_tables=False, grant_sequences=False, grant_functions=False):
    # PostgreSQL: CREATE DATABASE, CREATE USER, GRANT
    sql = f"""CREATE DATABASE "{db_name}" ENCODING '{encoding}';

DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = '{user_name}'
   ) THEN
      CREATE ROLE "{user_name}" LOGIN PASSWORD '{user_password}';
   END IF;
END
$$;

GRANT {privileges} ON DATABASE "{db_name}" TO "{user_name}";

"""
    # Fases adicionales (comentadas por defecto)
    if grant_tables:
        sql += f"""-- Otorgar privilegios sobre todas las tablas del esquema público:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "{user_name}";
"""
    else:
        sql += f"""-- Para acceso a todas las tablas existentes y futuras en el esquema público, descomente la siguiente línea:
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "{user_name}";
"""

    if grant_sequences:
        sql += f"""-- Otorgar privilegios sobre todas las secuencias del esquema público:
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "{user_name}";
"""
    else:
        sql += f"""-- Para acceso a todas las secuencias existentes y futuras en el esquema público, descomente la siguiente línea:
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "{user_name}";
"""

    if grant_functions:
        sql += f"""-- Otorgar privilegios sobre todas las funciones del esquema público:
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "{user_name}";
"""
    else:
        sql += f"""-- Para acceso a todas las funciones existentes y futuras en el esquema público, descomente la siguiente línea:
-- GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "{user_name}";
"""

    return sql
