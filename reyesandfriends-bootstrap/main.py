#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Aplicación principal GTK con arquitectura modular
Punto de entrada de la aplicación
"""

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

from views import MainWindow


def main():
    """Inicializar y ejecutar la aplicación"""
    window = MainWindow()
    window.connect("destroy", Gtk.main_quit)
    window.show_all()
    Gtk.main()


if __name__ == "__main__":
    main()
