#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GLib


class SqlScriptsView(Gtk.Box):
    """Vista para gestión y ejecución de scripts SQL (widget)"""
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=10)
        self.set_border_width(20)
        self.set_hexpand(True)
        self.set_vexpand(True)
        self._create_layout()
        
    def _create_layout(self):
        """Crear el layout de la vista"""
        vbox = self
        
        # Título
        title_label = Gtk.Label()
        title_label.set_markup("<big><b>Gestión de Scripts SQL</b></big>")
        title_label.set_margin_bottom(20)
        vbox.pack_start(title_label, False, False, 0)
        
        # Área de información
        info_label = Gtk.Label()
        info_label.set_text(
            "Módulo para ejecutar y gestionar scripts de bases de datos.\n\n"
            "Funcionalidades:\n"
            "• Ejecutar scripts SQL\n"
            "• Guardar y cargar scripts\n"
            "• Conectar a diferentes bases de datos\n"
            "• Ver resultados de consultas"
        )
        info_label.set_justify(Gtk.Justification.LEFT)
        info_label.set_line_wrap(True)
        vbox.pack_start(info_label, False, False, 0)
        
        # Configuración de conexión
        frame_connection = Gtk.Frame(label="Configuración de Conexión")
        frame_connection.set_margin_top(10)
        frame_connection.set_margin_bottom(10)
        
        grid = Gtk.Grid()
        grid.set_column_spacing(10)
        grid.set_row_spacing(10)
        grid.set_margin_start(10)
        grid.set_margin_end(10)
        grid.set_margin_top(10)
        grid.set_margin_bottom(10)
        
        # Tipo de base de datos
        db_type_label = Gtk.Label(label="Tipo BD:")
        db_type_label.set_halign(Gtk.Align.START)
        grid.attach(db_type_label, 0, 0, 1, 1)
        
        self.db_type_combo = Gtk.ComboBoxText()
        self.db_type_combo.append_text("MySQL")
        self.db_type_combo.append_text("PostgreSQL")
        self.db_type_combo.append_text("SQLite")
        self.db_type_combo.append_text("SQL Server")
        self.db_type_combo.set_active(0)
        grid.attach(self.db_type_combo, 1, 0, 1, 1)
        
        # Host
        host_label = Gtk.Label(label="Host:")
        host_label.set_halign(Gtk.Align.START)
        grid.attach(host_label, 0, 1, 1, 1)
        
        self.host_entry = Gtk.Entry()
        self.host_entry.set_text("localhost")
        grid.attach(self.host_entry, 1, 1, 1, 1)
        
        # Base de datos
        db_label = Gtk.Label(label="Base de datos:")
        db_label.set_halign(Gtk.Align.START)
        grid.attach(db_label, 0, 2, 1, 1)
        
        self.db_entry = Gtk.Entry()
        self.db_entry.set_placeholder_text("nombre_base_datos")
        grid.attach(self.db_entry, 1, 2, 1, 1)
        
        frame_connection.add(grid)
        vbox.pack_start(frame_connection, False, False, 0)
        
        # Editor de SQL
        frame_editor = Gtk.Frame(label="Editor SQL")
        
        scrolled_window = Gtk.ScrolledWindow()
        scrolled_window.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        scrolled_window.set_min_content_height(150)
        
        self.sql_textview = Gtk.TextView()
        self.sql_textview.set_wrap_mode(Gtk.WrapMode.WORD)
        buffer = self.sql_textview.get_buffer()
        buffer.set_text("SELECT * FROM tabla;\n\n-- Escribe tu consulta SQL aquí")
        scrolled_window.add(self.sql_textview)
        
        frame_editor.add(scrolled_window)
        vbox.pack_start(frame_editor, True, True, 0)
        
        # Botones de acción
        hbox_buttons = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        hbox_buttons.set_margin_top(10)
        
        btn_execute = Gtk.Button(label="Ejecutar")
        btn_execute.connect("clicked", self.on_execute_clicked)
        hbox_buttons.pack_start(btn_execute, True, True, 0)
        
        btn_load = Gtk.Button(label="Cargar Script")
        btn_load.connect("clicked", self.on_load_clicked)
        hbox_buttons.pack_start(btn_load, True, True, 0)
        
        btn_save = Gtk.Button(label="Guardar Script")
        btn_save.connect("clicked", self.on_save_clicked)
        hbox_buttons.pack_start(btn_save, True, True, 0)
        
        btn_clear = Gtk.Button(label="Limpiar")
        btn_clear.connect("clicked", self.on_clear_clicked)
        hbox_buttons.pack_start(btn_clear, True, True, 0)
        
        vbox.pack_start(hbox_buttons, False, False, 0)
        
        # Botón cerrar
        # El botón cerrar ya no es necesario en modo embebido
        # self.show_all() ya no es necesario
        
    def on_execute_clicked(self, widget):
        """Ejecutar script SQL"""
        buffer = self.sql_textview.get_buffer()
        start_iter = buffer.get_start_iter()
        end_iter = buffer.get_end_iter()
        sql_text = buffer.get_text(start_iter, end_iter, True)
        
        db_type = self.db_type_combo.get_active_text()
        host = self.host_entry.get_text()
        database = self.db_entry.get_text()
        
        dialog = Gtk.MessageDialog(
            transient_for=self,
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text="Ejecutar Script SQL"
        )
        dialog.format_secondary_text(
            f"Conexión: {db_type} @ {host}\n"
            f"Base de datos: {database}\n\n"
            f"Script:\n{sql_text[:100]}...\n\n"
            f"Funcionalidad en desarrollo..."
        )
        dialog.run()
        dialog.destroy()
        
    def on_load_clicked(self, widget):
        """Cargar script desde archivo"""
        dialog = Gtk.FileChooserDialog(
            title="Cargar Script SQL",
            parent=self,
            action=Gtk.FileChooserAction.OPEN
        )
        dialog.add_buttons(
            Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
            Gtk.STOCK_OPEN, Gtk.ResponseType.OK
        )
        
        # Filtro para archivos SQL
        filter_sql = Gtk.FileFilter()
        filter_sql.set_name("Archivos SQL")
        filter_sql.add_pattern("*.sql")
        dialog.add_filter(filter_sql)
        
        filter_all = Gtk.FileFilter()
        filter_all.set_name("Todos los archivos")
        filter_all.add_pattern("*")
        dialog.add_filter(filter_all)
        
        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            filename = dialog.get_filename()
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                    buffer = self.sql_textview.get_buffer()
                    buffer.set_text(content)
            except Exception as e:
                error_dialog = Gtk.MessageDialog(
                    transient_for=self,
                    flags=0,
                    message_type=Gtk.MessageType.ERROR,
                    buttons=Gtk.ButtonsType.OK,
                    text="Error al cargar archivo"
                )
                error_dialog.format_secondary_text(str(e))
                error_dialog.run()
                error_dialog.destroy()
        
        dialog.destroy()
        
    def on_save_clicked(self, widget):
        """Guardar script a archivo"""
        dialog = Gtk.FileChooserDialog(
            title="Guardar Script SQL",
            parent=self,
            action=Gtk.FileChooserAction.SAVE
        )
        dialog.add_buttons(
            Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
            Gtk.STOCK_SAVE, Gtk.ResponseType.OK
        )
        dialog.set_do_overwrite_confirmation(True)
        
        # Filtro para archivos SQL
        filter_sql = Gtk.FileFilter()
        filter_sql.set_name("Archivos SQL")
        filter_sql.add_pattern("*.sql")
        dialog.add_filter(filter_sql)
        
        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            filename = dialog.get_filename()
            if not filename.endswith('.sql'):
                filename += '.sql'
            
            try:
                buffer = self.sql_textview.get_buffer()
                start_iter = buffer.get_start_iter()
                end_iter = buffer.get_end_iter()
                content = buffer.get_text(start_iter, end_iter, True)
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
            except Exception as e:
                error_dialog = Gtk.MessageDialog(
                    transient_for=self,
                    flags=0,
                    message_type=Gtk.MessageType.ERROR,
                    buttons=Gtk.ButtonsType.OK,
                    text="Error al guardar archivo"
                )
                error_dialog.format_secondary_text(str(e))
                error_dialog.run()
                error_dialog.destroy()
        
        dialog.destroy()
        
    def on_clear_clicked(self, widget):
        """Limpiar el editor"""
        buffer = self.sql_textview.get_buffer()
        buffer.set_text("")
