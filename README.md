# reyesandfriends-bootstrap

Aplicación de escritorio utilitaria para gestionar contraseñas, configuraciones de servidores HTTP, utilidades para producción.

## Requisitos previos (APT)

```sh
sudo apt update
sudo apt install -y \
  python3-gi \
  python3-gi-cairo \
  python3-dotenv \
  gir1.2-gtk-3.0 \
  gir1.2-appindicator3-0.1 \
  gir1.2-glib-2.0 \
  libcairo2-dev \
  libglib2.0-dev \
  pkg-config \
  python3-dev \
  libgirepository-2.0-dev \
  cmake
```

## Requisitos previos (pip)

```sh
pip install -r requirements.txt
```

## Ejecución

```sh
python3 main.py
```