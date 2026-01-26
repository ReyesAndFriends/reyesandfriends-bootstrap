import os
import sqlite3
from appdirs import user_config_dir

APP_NAME = "reyesandfriends-bootstrap"
CONFIG_DIR = user_config_dir(APP_NAME)
DB_PATH = os.path.join(CONFIG_DIR, "config.db")

def ensure_db():

    os.makedirs(CONFIG_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    conn.commit()
    conn.close()

def set_config(key, value):
    ensure_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("REPLACE INTO config (key, value) VALUES (?, ?)", (key, value))
    conn.commit()
    conn.close()
    # Si cambiamos el directorio de trabajo, crearlo si no existe
    if key == "workdir":
        os.makedirs(value, exist_ok=True)

def get_config(key, default=None):
    ensure_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT value FROM config WHERE key=?", (key,))
    row = c.fetchone()
    conn.close()
    if row:
        return row[0]
    return default

def get_default_workdir():
    return os.path.expanduser(f"~/.{APP_NAME}")

def get_workdir():
    path = get_config("workdir", get_default_workdir())

    os.makedirs(path, exist_ok=True)
    return path

def set_workdir(path):
    set_config("workdir", path)
