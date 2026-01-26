import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk


class PasswordsView(Gtk.Box):
    """Vista para gestión de contraseñas (widget)"""
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=10)
        self.set_margin_top(24)
        self.set_margin_bottom(24)
        self.set_margin_start(24)
        self.set_margin_end(24)
        self._create_layout()
        
    def _create_layout(self):
        """Crear el layout de la vista"""
        vbox = self
        
        # Título
        title_label = Gtk.Label()
        title_label.set_markup("<big><b>Gestión de Contraseñas</b></big>")
        title_label.set_margin_bottom(20)
        vbox.pack_start(title_label, False, False, 0)
        
        # Área de información
        info_label = Gtk.Label()
        info_label.set_text(
            "Aquí puedes almacenar y gestionar tus contraseñas de forma segura.\n\n"
            "Funcionalidades:\n"
            "• Agregar nuevas contraseñas\n"
            "• Editar contraseñas existentes\n"
            "• Eliminar contraseñas\n"
            "• Búsqueda y filtrado\n"
            "• Encriptación de datos"
        )
        info_label.set_justify(Gtk.Justification.LEFT)
        info_label.set_line_wrap(True)
        vbox.pack_start(info_label, True, True, 0)
        
        # Lista de ejemplo (TreeView)
        scrolled_window = Gtk.ScrolledWindow()
        scrolled_window.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        
        # Crear el modelo de datos
        liststore = Gtk.ListStore(str, str, str)
        liststore.append(["Ejemplo 1", "usuario1@example.com", "********"])
        liststore.append(["Ejemplo 2", "usuario2@example.com", "********"])
        
        # Crear el TreeView
        treeview = Gtk.TreeView(model=liststore)
        
        # Columnas
        renderer_text = Gtk.CellRendererText()
        column_service = Gtk.TreeViewColumn("Servicio", renderer_text, text=0)
        treeview.append_column(column_service)
        
        column_username = Gtk.TreeViewColumn("Usuario", renderer_text, text=1)
        treeview.append_column(column_username)
        
        column_password = Gtk.TreeViewColumn("Contraseña", renderer_text, text=2)
        treeview.append_column(column_password)
        
        scrolled_window.add(treeview)
        vbox.pack_start(scrolled_window, True, True, 0)
        
        # Botones de acción
        hbox_buttons = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        hbox_buttons.set_margin_top(10)
        
        btn_add = Gtk.Button(label="Agregar")
        btn_add.connect("clicked", self.on_add_clicked)
        hbox_buttons.pack_start(btn_add, True, True, 0)
        
        btn_edit = Gtk.Button(label="Editar")
        btn_edit.connect("clicked", self.on_edit_clicked)
        hbox_buttons.pack_start(btn_edit, True, True, 0)
        
        btn_delete = Gtk.Button(label="Eliminar")
        btn_delete.connect("clicked", self.on_delete_clicked)
        hbox_buttons.pack_start(btn_delete, True, True, 0)
        
        vbox.pack_start(hbox_buttons, False, False, 0)
        
        # Botón cerrar
        # El botón cerrar ya no es necesario en modo embebido
        # self.show_all() ya no es necesario
        
    def on_add_clicked(self, widget):
        """Agregar nueva contraseña"""
        dialog = Gtk.MessageDialog(
            transient_for=self,
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text="Agregar contraseña"
        )
        dialog.format_secondary_text("Funcionalidad en desarrollo...")
        dialog.run()
        dialog.destroy()
        
    def on_edit_clicked(self, widget):
        """Editar contraseña seleccionada"""
        dialog = Gtk.MessageDialog(
            transient_for=self,
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text="Editar contraseña"
        )
        dialog.format_secondary_text("Funcionalidad en desarrollo...")
        dialog.run()
        dialog.destroy()
        
    def on_delete_clicked(self, widget):
        """Eliminar contraseña seleccionada"""
        dialog = Gtk.MessageDialog(
            transient_for=self,
            flags=0,
            message_type=Gtk.MessageType.WARNING,
            buttons=Gtk.ButtonsType.YES_NO,
            text="Eliminar contraseña"
        )
        dialog.format_secondary_text("¿Estás seguro de que deseas eliminar esta contraseña?")
        response = dialog.run()
        dialog.destroy()
        
        if response == Gtk.ResponseType.YES:
            # Aquí iría la lógica de eliminación
            pass
