#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

from .passwords_view import PasswordsView
from .http_servers_view import HttpServersView
from .sql_scripts_view import SqlScriptsView


class MainWindow(Gtk.Window):
    """Ventana principal de la aplicación con menú de navegación"""
    
    def __init__(self):
        super().__init__(title="Menu Principal")
        self.set_border_width(20)
        self.set_default_size(400, 500)
        self.set_position(Gtk.WindowPosition.CENTER)
        
        # Crear el layout principal
        self._create_layout()
        
    def _create_layout(self):
        """Crear el layout de la ventana principal"""
        # Crear un box vertical para organizar los elementos
        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=15)
        self.add(vbox)
        
        # Título de la aplicación
        title_label = Gtk.Label()
        title_label.set_markup("<big><b>Menú Principal</b></big>")
        title_label.set_margin_bottom(20)
        vbox.pack_start(title_label, False, False, 0)
        
        # Botón Passwords
        btn_passwords = Gtk.Button(label="Passwords")
        btn_passwords.set_size_request(-1, 60)
        btn_passwords.connect("clicked", self.on_passwords_clicked)
        vbox.pack_start(btn_passwords, False, False, 0)
        
        # Botón HTTP Servers
        btn_http = Gtk.Button(label="HTTP Servers")
        btn_http.set_size_request(-1, 60)
        btn_http.connect("clicked", self.on_http_servers_clicked)
        vbox.pack_start(btn_http, False, False, 0)
        
        # Botón SQL Scripts
        btn_sql = Gtk.Button(label="SQL Scripts")
        btn_sql.set_size_request(-1, 60)
        btn_sql.connect("clicked", self.on_sql_scripts_clicked)
        vbox.pack_start(btn_sql, False, False, 0)
        
        # Botón About
        btn_about = Gtk.Button(label="About")
        btn_about.set_size_request(-1, 60)
        btn_about.connect("clicked", self.on_about_clicked)
        vbox.pack_start(btn_about, False, False, 0)
        
        # Separador
        separator = Gtk.Separator(orientation=Gtk.Orientation.HORIZONTAL)
        vbox.pack_start(separator, False, False, 10)
        
        # Botón Salir
        btn_exit = Gtk.Button(label="Salir")
        btn_exit.connect("clicked", self.on_exit_clicked)
        vbox.pack_start(btn_exit, False, False, 0)
        
    def on_passwords_clicked(self, widget):
        """Abrir ventana de gestión de contraseñas"""
        passwords_view = PasswordsView(self)
        passwords_view.show()
    
    def on_http_servers_clicked(self, widget):
        """Abrir ventana de servidores HTTP"""
        http_view = HttpServersView(self)
        http_view.show()
    
    def on_sql_scripts_clicked(self, widget):
        """Abrir ventana de scripts SQL"""
        sql_view = SqlScriptsView(self)
        sql_view.show()
    
    def on_about_clicked(self, widget):
        """Mostrar diálogo About"""
        about_dialog = Gtk.AboutDialog(transient_for=self, modal=True)
        about_dialog.set_program_name("Menu Principal GTK")
        about_dialog.set_version("1.0.0")
        about_dialog.set_authors(["Astronaut Markus"])
        about_dialog.set_comments("Aplicación de menú con GTK y Python")
        about_dialog.set_website("https://www.gtk.org")
        about_dialog.set_website_label("GTK Website")
        about_dialog.set_license_type(Gtk.License.MIT_X11)
        about_dialog.run()
        about_dialog.destroy()
    
    def on_exit_clicked(self, widget):
        """Salir de la aplicación"""
        Gtk.main_quit()
