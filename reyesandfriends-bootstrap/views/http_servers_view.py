#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk


class HttpServersView(Gtk.Window):
    """Vista para gestión de servidores HTTP"""
    
    def __init__(self, parent):
        super().__init__(title="HTTP Servers")
        self.set_transient_for(parent)
        self.set_modal(True)
        self.set_default_size(600, 400)
        self.set_border_width(20)
        self.set_position(Gtk.WindowPosition.CENTER_ON_PARENT)
        
        # Estado del servidor
        self.server_running = False
        
        # Crear el layout
        self._create_layout()
        
    def _create_layout(self):
        """Crear el layout de la vista"""
        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10)
        self.add(vbox)
        
        # Título
        title_label = Gtk.Label()
        title_label.set_markup("<big><b>Gestión de Servidores HTTP</b></big>")
        title_label.set_margin_bottom(20)
        vbox.pack_start(title_label, False, False, 0)
        
        # Área de información
        info_label = Gtk.Label()
        info_label.set_text(
            "Módulo para iniciar y gestionar servidores HTTP locales.\n\n"
            "Funcionalidades:\n"
            "• Iniciar servidor HTTP simple\n"
            "• Configurar puerto y directorio raíz\n"
            "• Ver logs del servidor\n"
            "• Detener servidor activo"
        )
        info_label.set_justify(Gtk.Justification.LEFT)
        info_label.set_line_wrap(True)
        vbox.pack_start(info_label, False, False, 0)
        
        # Configuración del servidor
        grid = Gtk.Grid()
        grid.set_column_spacing(10)
        grid.set_row_spacing(10)
        grid.set_margin_top(20)
        grid.set_margin_bottom(20)
        
        # Puerto
        port_label = Gtk.Label(label="Puerto:")
        port_label.set_halign(Gtk.Align.START)
        grid.attach(port_label, 0, 0, 1, 1)
        
        self.port_entry = Gtk.Entry()
        self.port_entry.set_text("8000")
        self.port_entry.set_max_length(5)
        grid.attach(self.port_entry, 1, 0, 1, 1)
        
        # Directorio
        dir_label = Gtk.Label(label="Directorio:")
        dir_label.set_halign(Gtk.Align.START)
        grid.attach(dir_label, 0, 1, 1, 1)
        
        self.dir_entry = Gtk.Entry()
        self.dir_entry.set_text(".")
        grid.attach(self.dir_entry, 1, 1, 1, 1)
        
        btn_browse = Gtk.Button(label="Buscar...")
        btn_browse.connect("clicked", self.on_browse_clicked)
        grid.attach(btn_browse, 2, 1, 1, 1)
        
        vbox.pack_start(grid, False, False, 0)
        
        # Estado del servidor
        self.status_label = Gtk.Label()
        self.status_label.set_markup("<b>Estado:</b> Detenido")
        vbox.pack_start(self.status_label, False, False, 0)
        
        # Botones de control
        hbox_buttons = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        hbox_buttons.set_margin_top(20)
        
        self.btn_start = Gtk.Button(label="Iniciar Servidor")
        self.btn_start.connect("clicked", self.on_start_clicked)
        hbox_buttons.pack_start(self.btn_start, True, True, 0)
        
        self.btn_stop = Gtk.Button(label="Detener Servidor")
        self.btn_stop.connect("clicked", self.on_stop_clicked)
        self.btn_stop.set_sensitive(False)
        hbox_buttons.pack_start(self.btn_stop, True, True, 0)
        
        vbox.pack_start(hbox_buttons, False, False, 0)
        
        # Botón cerrar
        btn_close = Gtk.Button(label="Cerrar")
        btn_close.connect("clicked", lambda w: self.destroy())
        vbox.pack_start(btn_close, False, False, 0)
        
        self.show_all()
        
    def on_browse_clicked(self, widget):
        """Seleccionar directorio"""
        dialog = Gtk.FileChooserDialog(
            title="Seleccionar directorio",
            parent=self,
            action=Gtk.FileChooserAction.SELECT_FOLDER
        )
        dialog.add_buttons(
            Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
            Gtk.STOCK_OPEN, Gtk.ResponseType.OK
        )
        
        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            self.dir_entry.set_text(dialog.get_filename())
        
        dialog.destroy()
        
    def on_start_clicked(self, widget):
        """Iniciar servidor HTTP"""
        port = self.port_entry.get_text()
        directory = self.dir_entry.get_text()
        
        # Aquí iría la lógica real para iniciar el servidor
        self.server_running = True
        self.status_label.set_markup(f"<b>Estado:</b> Activo en puerto {port}")
        self.btn_start.set_sensitive(False)
        self.btn_stop.set_sensitive(True)
        
        dialog = Gtk.MessageDialog(
            transient_for=self,
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text="Servidor iniciado"
        )
        dialog.format_secondary_text(
            f"Servidor HTTP ejecutándose en:\n"
            f"Puerto: {port}\n"
            f"Directorio: {directory}"
        )
        dialog.run()
        dialog.destroy()
        
    def on_stop_clicked(self, widget):
        """Detener servidor HTTP"""
        # Aquí iría la lógica real para detener el servidor
        self.server_running = False
        self.status_label.set_markup("<b>Estado:</b> Detenido")
        self.btn_start.set_sensitive(True)
        self.btn_stop.set_sensitive(False)
        
        dialog = Gtk.MessageDialog(
            transient_for=self,
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text="Servidor detenido"
        )
        dialog.run()
        dialog.destroy()
