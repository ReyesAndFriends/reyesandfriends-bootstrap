# Menu Principal GTK

Aplicación Python con interfaz GTK que proporciona un menú principal con acceso a diferentes módulos.

## Características

- **Passwords**: Módulo de gestión de contraseñas
- **HTTP Servers**: Módulo de servidores HTTP
- **SQL Scripts**: Módulo de scripts SQL
- **About**: Información sobre la aplicación

## Requisitos

- Python 3.7 o superior
- GTK 3
- PyGObject

### En Windows

**Opción A: MSYS2 (Recomendado - Más fácil)**

1. Instalar MSYS2 desde https://www.msys2.org/
2. Abrir **MSYS2 MinGW 64-bit** y ejecutar:
```bash
pacman -S mingw-w64-x86_64-gtk3 mingw-w64-x86_64-python3 mingw-w64-x86_64-python3-gobject
```
3. Ejecutar la aplicación desde MSYS2:
```bash
python main.py
```

**Opción B: Python nativo de Windows**

1. Instalar Python desde https://www.python.org/
2. Descargar e instalar GTK3 Runtime desde:
   - https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases
3. Instalar PyGObject:
```powershell
pip install PyGObject
```
4. Ejecutar desde PowerShell o CMD:
```powershell
python main.py
```

### En Linux (Ubuntu/Debian)

```bash
sudo apt-get install python3-gi python3-gi-cairo gir1.2-gtk-3.0
```

### En macOS

```bash
brew install pygobject3 gtk+3
```

## Instalación

1. Clonar o descargar el repositorio
2. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

## Uso

Ejecutar la aplicación:

```bash
python main.py
```

## Estructura

```
.
├── main.py           # Archivo principal de la aplicación
├── requirements.txt  # Dependencias de Python
└── README.md        # Este archivo
```

## Desarrollo Futuro

- Implementar funcionalidad completa para el módulo de Passwords
- Agregar servidor HTTP funcional
- Implementar ejecutor de scripts SQL
- Mejorar la interfaz visual con CSS
- Agregar iconos a los botones

## Licencia

MIT
