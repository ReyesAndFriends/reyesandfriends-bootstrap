import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GdkPixbuf
import os
from config import get_workdir
from service.mysql_database_service import (
    list_mysql_databases, create_mysql_database, update_mysql_database,
    delete_mysql_database, get_mysql_database, generate_password,
    get_privileges_for_preset, generate_mysql_sql
)

class MysqlView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        self.set_margin_top(32)
        self.set_margin_bottom(32)
        self.set_margin_start(32)
        self.set_margin_end(32)

        header_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=16)
        header_box.set_halign(Gtk.Align.FILL)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        mysql_icon_path = os.path.join(base_dir, "assets", "icons", "mysql.png")
        mysql_img = Gtk.Image()
        try:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(mysql_icon_path, 48, 48, True)
            mysql_img.set_from_pixbuf(pixbuf)
        except Exception:
            mysql_img = Gtk.Image.new_from_file(mysql_icon_path)
        header_box.pack_start(mysql_img, False, False, 0)
        title = Gtk.Label()
        title.set_markup("<span size='x-large' weight='bold'>Scripts MySQL</span>")
        title.set_halign(Gtk.Align.START)
        header_box.pack_start(title, False, False, 0)

        self.btn_abrir_directorio = Gtk.Button(label="Abrir Directorio")
        self.btn_abrir_directorio.set_halign(Gtk.Align.END)
        self.btn_abrir_directorio.connect("clicked", self._on_abrir_directorio_clicked)
        header_box.pack_end(self.btn_abrir_directorio, False, False, 0)

        self.pack_start(header_box, False, False, 0)

        crud_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=12)
        crud_box.set_margin_top(16)
        crud_box.set_margin_bottom(16)

        lbl_conf = Gtk.Label()
        lbl_conf.set_markup("<b>Configuraciones</b>")
        lbl_conf.set_halign(Gtk.Align.START)
        crud_box.pack_start(lbl_conf, False, False, 0)

        list_frame = Gtk.Frame()
        list_frame.set_shadow_type(Gtk.ShadowType.IN)
        self.liststore = Gtk.ListStore(int, str, str, str, str, str, str)
        self._refresh_liststore()
        self.treeview = Gtk.TreeView(model=self.liststore)
        renderer_text = Gtk.CellRendererText()

        cols = [
            ("Base de datos", 1),
            ("Usuario", 2),
            ("Host", 5),
            ("Privilegios", 4),
            ("Preset", 6),
        ]
        for col_name, idx in cols:
            col = Gtk.TreeViewColumn(col_name, renderer_text, text=idx)
            self.treeview.append_column(col)

        select = self.treeview.get_selection()
        select.connect("changed", self._on_selection_changed)
        list_box = Gtk.ScrolledWindow()
        list_box.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        list_box.set_size_request(-1, 220)
        list_box.add(self.treeview)
        list_frame.add(list_box)
        crud_box.pack_start(list_frame, False, False, 0)

        btns_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
        self.btn_nueva = Gtk.Button(label="Nueva")
        self.btn_editar = Gtk.Button(label="Editar")
        self.btn_eliminar = Gtk.Button(label="Eliminar")
        self.btn_generar = Gtk.Button(label="Generar .sql")
        self.btn_abrir_carpeta = Gtk.Button(label="Directorio del script")
        self.btn_editar.set_sensitive(False)
        self.btn_eliminar.set_sensitive(False)
        self.btn_generar.set_sensitive(False)
        self.btn_abrir_carpeta.set_sensitive(False)
        btns_box.pack_start(self.btn_nueva, False, False, 0)
        btns_box.pack_start(self.btn_editar, False, False, 0)
        btns_box.pack_start(self.btn_eliminar, False, False, 0)
        btns_box.pack_start(self.btn_abrir_carpeta, False, False, 0)
        btns_box.pack_end(self.btn_generar, False, False, 0)
        crud_box.pack_start(btns_box, False, False, 0)

        self.btn_nueva.connect("clicked", self._on_nueva_clicked)
        self.btn_editar.connect("clicked", self._on_editar_clicked)
        self.btn_eliminar.connect("clicked", self._on_eliminar_clicked)
        self.btn_generar.connect("clicked", self._on_generar_clicked)
        self.btn_abrir_carpeta.connect("clicked", self._on_abrir_carpeta_clicked)

        self.pack_start(crud_box, True, True, 0)

    def _refresh_liststore(self):
        self.liststore.clear()
        for row in list_mysql_databases():
            self.liststore.append(row)

    def _on_selection_changed(self, selection):
        model, treeiter = selection.get_selected()
        is_selected = treeiter is not None
        self.btn_editar.set_sensitive(is_selected)
        self.btn_eliminar.set_sensitive(is_selected)
        self.btn_generar.set_sensitive(is_selected)

        if is_selected:
            db_name = model[treeiter][1]
            workdir = get_workdir()
            sql_dir = os.path.join(workdir, "sql_scripts", "mysql", db_name)
            sql_file = f"{db_name}.sql"
            exists = False
            if os.path.isdir(sql_dir):
                # Comprobación robusta: busca el archivo exacto (case-insensitive, ignora espacios)
                for fname in os.listdir(sql_dir):
                    if fname.strip().lower() == sql_file.strip().lower() and os.path.isfile(os.path.join(sql_dir, fname)):
                        exists = True
                        break
            self.btn_abrir_carpeta.set_sensitive(exists)
        else:
            self.btn_abrir_carpeta.set_sensitive(False)

    def _on_abrir_directorio_clicked(self, *_):
        workdir = get_workdir()
        sql_dir = os.path.join(workdir, "sql_scripts", "mysql")
        os.makedirs(sql_dir, exist_ok=True)
        os.system(f'xdg-open "{sql_dir}"')

    def _on_abrir_carpeta_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            db_name = model[treeiter][1]
            workdir = get_workdir()
            sql_dir = os.path.join(workdir, "sql_scripts", "mysql", db_name)
            sql_file = f"{db_name}.sql"
            exists = False
            if os.path.isdir(sql_dir):
                for fname in os.listdir(sql_dir):
                    if fname.strip().lower() == sql_file.strip().lower() and os.path.isfile(os.path.join(sql_dir, fname)):
                        exists = True
                        break
            if exists:
                os.system(f'xdg-open "{sql_dir}"')
            else:
                self._show_notification("El archivo no existe. Primero genere el script .sql.")

    def _on_nueva_clicked(self, *_):
        dialog = MysqlConfigDialog(self.get_toplevel(), "Nueva base de datos")
        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            data = dialog.get_data()
            create_mysql_database(*data)
            self._refresh_liststore()
        dialog.destroy()

    def _on_editar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            id_ = model[treeiter][0]
            config = get_mysql_database(id_)
            old_db_name = config[1]
            workdir = get_workdir()
            old_sql_dir = os.path.join(workdir, "sql_scripts", "mysql", old_db_name)
            old_sql_path = os.path.join(old_sql_dir, f"{old_db_name}.sql")
            file_exists = os.path.isfile(old_sql_path)

            dialog = MysqlConfigDialog(self.get_toplevel(), "Editar base de datos", config)
            response = dialog.run()
            if response == Gtk.ResponseType.OK:
                data = dialog.get_data()
                new_db_name = data[0]
                new_sql_dir = os.path.join(workdir, "sql_scripts", "mysql", new_db_name)
                new_sql_path = os.path.join(new_sql_dir, f"{new_db_name}.sql")

                if file_exists and old_db_name != new_db_name:
                    dialog_conf = Gtk.MessageDialog(
                        transient_for=self.get_toplevel(),
                        flags=0,
                        message_type=Gtk.MessageType.QUESTION,
                        buttons=Gtk.ButtonsType.NONE,
                        text=f"El archivo SQL anterior existe:\n{old_sql_path}\n¿Qué desea hacer?"
                    )
                    btn_rename = dialog_conf.add_button("Renombrar", 1)
                    btn_ignore = dialog_conf.add_button("Ignorar", 2)
                    btn_delete = dialog_conf.add_button("Borrar", 3)
                    dialog_conf.set_default_response(2)
                    response_conf = dialog_conf.run()
                    dialog_conf.destroy()
                    if response_conf == 1:
                        try:
                            os.makedirs(new_sql_dir, exist_ok=True)
                            # Renombrar el archivo
                            if os.path.isfile(new_sql_path):
                                os.remove(new_sql_path)
                            os.rename(old_sql_path, new_sql_path)
                            self._show_notification(f"Archivo renombrado:\n{new_sql_path}")
                        except Exception as e:
                            self._show_notification(f"Error al renombrar archivo:\n{e}")
                    elif response_conf == 3:
                        try:
                            os.remove(old_sql_path)
                            self._show_notification("Archivo .sql anterior eliminado.")
                        except Exception as e:
                            self._show_notification(f"Error al eliminar archivo:\n{e}")
                    elif response_conf == 2:
                        self._show_notification("Se mantendrá el archivo anterior, el nuevo no será modificado.")

                update_mysql_database(id_, *data)
                self._refresh_liststore()
            dialog.destroy()

    def _on_eliminar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            id_ = model[treeiter][0]
            config = get_mysql_database(id_)
            db_name = config[1]
            workdir = get_workdir()
            sql_dir = os.path.join(workdir, "sql_scripts", "mysql", db_name)
            sql_file = f"{db_name}.sql"
            sql_path = os.path.join(sql_dir, sql_file)
            file_exists = os.path.isfile(sql_path)

            dialog = Gtk.MessageDialog(
                transient_for=self.get_toplevel(),
                flags=0,
                message_type=Gtk.MessageType.QUESTION,
                buttons=Gtk.ButtonsType.YES_NO,
                text="¿Está seguro que desea eliminar este registro de base de datos?"
            )
            response = dialog.run()
            dialog.destroy()
            if response == Gtk.ResponseType.YES:
                # Preguntar si también eliminar archivos .sql si existen
                if file_exists:
                    dialog2 = Gtk.MessageDialog(
                        transient_for=self.get_toplevel(),
                        flags=0,
                        message_type=Gtk.MessageType.QUESTION,
                        buttons=Gtk.ButtonsType.YES_NO,
                        text=f"También se encontró el archivo:\n{sql_path}\n¿Desea eliminarlo?"
                    )
                    response2 = dialog2.run()
                    dialog2.destroy()
                    if response2 == Gtk.ResponseType.YES:
                        try:
                            os.remove(sql_path)
                        except Exception as e:
                            self._show_notification(f"Error al eliminar archivo:\n{e}")
                delete_mysql_database(id_)
                self._refresh_liststore()
                self._show_notification("Registro eliminado correctamente.")

    def _on_generar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            row = self.liststore[treeiter]
            db_name, user_name, user_password, privileges, host = row[1], row[2], row[3], row[4], row[5]
            sql = generate_mysql_sql(db_name, user_name, user_password, privileges, host)
            suggested_filename = f"{db_name}.sql"
            preview_dialog = MysqlSQLPreviewDialog(self.get_toplevel(), sql, suggested_filename)
            response = preview_dialog.run()
            if response == Gtk.ResponseType.OK:
                save_option = preview_dialog.get_save_option()
                filename = preview_dialog.get_filename()
                if save_option == "workdir":
                    workdir = get_workdir()
                    sql_dir = os.path.join(workdir, "sql_scripts", "mysql", db_name)
                    os.makedirs(sql_dir, exist_ok=True)
                    filepath = os.path.join(sql_dir, filename)
                else:
                    filepath = preview_dialog.get_custom_path()
                    if not filepath:
                        preview_dialog.destroy()
                        return
                if os.path.isfile(filepath):
                    dialog_overwrite = Gtk.MessageDialog(
                        transient_for=self.get_toplevel(),
                        flags=0,
                        message_type=Gtk.MessageType.QUESTION,
                        buttons=Gtk.ButtonsType.YES_NO,
                        text=f"El archivo ya existe:\n{filepath}\n¿Desea sobreescribirlo?"
                    )
                    resp_overwrite = dialog_overwrite.run()
                    dialog_overwrite.destroy()
                    if resp_overwrite != Gtk.ResponseType.YES:
                        preview_dialog.destroy()
                        return
                try:
                    with open(filepath, "w") as f:
                        f.write(sql)
                    self._show_notification(f"Archivo guardado:\n{filepath}")
                except Exception as e:
                    self._show_notification(f"Error al guardar:\n{e}")
            preview_dialog.destroy()

    def _show_notification(self, message):
        dialog = Gtk.MessageDialog(
            transient_for=self.get_toplevel(),
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text=message
        )
        dialog.run()
        dialog.destroy()

class MysqlConfigDialog(Gtk.Dialog):
    def __init__(self, parent, title, config=None):
        super().__init__(title, parent, 0,
            (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
             Gtk.STOCK_OK, Gtk.ResponseType.OK)
        )
        self.set_default_size(400, 340)
        box = self.get_content_area()
        grid = Gtk.Grid(row_spacing=10, column_spacing=10, margin=10)
        box.add(grid)

        lbl_db = Gtk.Label(label="Nombre de la base de datos:")
        lbl_db.set_halign(Gtk.Align.END)
        self.entry_db = Gtk.Entry()
        grid.attach(lbl_db, 0, 0, 1, 1)
        grid.attach(self.entry_db, 1, 0, 2, 1)

        lbl_user = Gtk.Label(label="Usuario:")
        lbl_user.set_halign(Gtk.Align.END)
        self.entry_user = Gtk.Entry()
        grid.attach(lbl_user, 0, 1, 1, 1)
        grid.attach(self.entry_user, 1, 1, 2, 1)

        lbl_pass = Gtk.Label(label="Contraseña:")
        lbl_pass.set_halign(Gtk.Align.END)
        self.entry_pass = Gtk.Entry()
        self.entry_pass.set_visibility(False)
        grid.attach(lbl_pass, 0, 2, 1, 1)
        grid.attach(self.entry_pass, 1, 2, 1, 1)
        self.btn_gen_pass = Gtk.Button(label="Generar segura")
        self.btn_gen_pass.connect("clicked", self._on_gen_pass)
        grid.attach(self.btn_gen_pass, 2, 2, 1, 1)

        lbl_host = Gtk.Label(label="Host:")
        lbl_host.set_halign(Gtk.Align.END)
        self.combo_host = Gtk.ComboBoxText()
        self.combo_host.append_text("localhost")
        self.combo_host.append_text("todos los hosts (%)")
        self.combo_host.append_text("personalizado")
        self.combo_host.set_active(0)
        grid.attach(lbl_host, 0, 3, 1, 1)
        grid.attach(self.combo_host, 1, 3, 1, 1)
        self.entry_host = Gtk.Entry()
        self.entry_host.set_placeholder_text("Ej: 192.168.1.100")
        self.entry_host.set_sensitive(False)
        grid.attach(self.entry_host, 2, 3, 1, 1)

        def on_host_combo_changed(combo):
            idx = combo.get_active()
            if idx == 0:
                self.entry_host.set_sensitive(False)
                self.entry_host.set_text("localhost")
            elif idx == 1:
                self.entry_host.set_sensitive(False)
                self.entry_host.set_text("%")
            else:
                self.entry_host.set_sensitive(True)
                self.entry_host.set_text("")
            self._validate_fields()
        self.combo_host.connect("changed", on_host_combo_changed)

        lbl_priv = Gtk.Label(label="Privilegios:")
        lbl_priv.set_halign(Gtk.Align.END)
        self.entry_priv = Gtk.Entry()
        grid.attach(lbl_priv, 0, 4, 1, 1)
        grid.attach(self.entry_priv, 1, 4, 2, 1)

        lbl_preset = Gtk.Label(label="Preset:")
        lbl_preset.set_halign(Gtk.Align.END)
        self.combo_preset = Gtk.ComboBoxText()
        self.combo_preset.append_text("personalizado")
        self.combo_preset.append_text("produccion")
        self.combo_preset.append_text("desarrollo")
        self.combo_preset.append_text("solo_lectura")
        self.combo_preset.set_active(0)
        grid.attach(lbl_preset, 0, 5, 1, 1)
        grid.attach(self.combo_preset, 1, 5, 2, 1)

        def on_preset_changed(combo):
            preset = combo.get_active_text()
            if preset and preset != "personalizado":
                privs = get_privileges_for_preset(preset)
                self.entry_priv.set_text(privs)
            self._validate_fields()
        self.combo_preset.connect("changed", on_preset_changed)

        # Inicialización de valores
        if config:
            self.entry_db.set_text(config[1])
            self.entry_user.set_text(config[2])
            self.entry_pass.set_text(config[3])
            self.entry_priv.set_text(config[4])
            # Host
            host = config[5]
            if host == "localhost":
                self.combo_host.set_active(0)
                self.entry_host.set_text("localhost")
                self.entry_host.set_sensitive(False)
            elif host == "%":
                self.combo_host.set_active(1)
                self.entry_host.set_text("%")
                self.entry_host.set_sensitive(False)
            else:
                self.combo_host.set_active(2)
                self.entry_host.set_text(host)
                self.entry_host.set_sensitive(True)
            preset = config[6] or "personalizado"
            idx = {"personalizado":0, "produccion":1, "desarrollo":2, "solo_lectura":3}.get(preset, 0)
            self.combo_preset.set_active(idx)
        else:
            self.entry_db.set_text("")
            self.entry_user.set_text("")
            self.entry_pass.set_text("")
            self.entry_priv.set_text("")
            self.combo_host.set_active(0)
            self.entry_host.set_text("localhost")
            self.entry_host.set_sensitive(False)
            self.combo_preset.set_active(0)

        # --- Validación de campos para habilitar/deshabilitar el botón OK ---
        self.ok_button = self.get_widget_for_response(Gtk.ResponseType.OK)
        self.ok_button.set_sensitive(False)
        # Conectar señales de cambio en los campos relevantes
        self.entry_db.connect("changed", lambda *_: self._validate_fields())
        self.entry_user.connect("changed", lambda *_: self._validate_fields())
        self.entry_pass.connect("changed", lambda *_: self._validate_fields())
        self.entry_priv.connect("changed", lambda *_: self._validate_fields())
        self.entry_host.connect("changed", lambda *_: self._validate_fields())
        # Validar al mostrar el diálogo
        self._validate_fields()

        self.show_all()

    def _validate_fields(self):
        db = self.entry_db.get_text().strip()
        user = self.entry_user.get_text().strip()
        passwd = self.entry_pass.get_text().strip()
        priv = self.entry_priv.get_text().strip()
        host_idx = self.combo_host.get_active()
        if host_idx == 2:
            host = self.entry_host.get_text().strip()
        else:
            host = "localhost" if host_idx == 0 else "%"
        # Todos los campos deben estar llenos
        all_filled = all([db, user, passwd, priv, host])
        if hasattr(self, 'ok_button') and self.ok_button:
            self.ok_button.set_sensitive(all_filled)

    def _on_gen_pass(self, *_):
        self.entry_pass.set_text(generate_password())
        self._validate_fields()

    def get_data(self):
        db_name = self.entry_db.get_text().strip()
        user_name = self.entry_user.get_text().strip()
        user_password = self.entry_pass.get_text().strip()
        privileges = self.entry_priv.get_text().strip()
        host_idx = self.combo_host.get_active()
        if host_idx == 0:
            host = "localhost"
        elif host_idx == 1:
            host = "%"
        else:
            host = self.entry_host.get_text().strip() or "localhost"
        preset = self.combo_preset.get_active_text() or ""
        return db_name, user_name, user_password, privileges, host, preset

class MysqlSQLPreviewDialog(Gtk.Dialog):
    def __init__(self, parent, sql_text, suggested_filename="mysql.sql"):
        super().__init__("Vista previa y guardar .sql", parent, 0,
            (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
             Gtk.STOCK_SAVE, Gtk.ResponseType.OK)
        )
        self.set_default_size(500, 350)
        box = self.get_content_area()
        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10, margin=10)
        box.add(vbox)

        label = Gtk.Label(label="Vista previa del script SQL:")
        label.set_halign(Gtk.Align.START)
        vbox.pack_start(label, False, False, 0)

        scrolled = Gtk.ScrolledWindow()
        scrolled.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        self.textview = Gtk.TextView()
        self.textview.set_editable(False)
        self.textview.get_buffer().set_text(sql_text)
        scrolled.add(self.textview)
        scrolled.set_min_content_height(180)
        vbox.pack_start(scrolled, True, True, 0)

        self.save_option = "workdir"
        self.filename_entry = Gtk.Entry()
        self.filename_entry.set_text(suggested_filename)
        self.custom_path = None

        radio_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=6)
        workdir = get_workdir()
        self.radio_workdir = Gtk.RadioButton.new_with_label_from_widget(None, f"Guardar en sql_scripts/mysql/ dentro del directorio de trabajo ({workdir})")
        self.radio_custom = Gtk.RadioButton.new_with_label_from_widget(self.radio_workdir, "Elegir otro lugar...")
        self.radio_workdir.set_active(True)
        self.radio_workdir.connect("toggled", self._on_radio_toggled)
        radio_box.pack_start(self.radio_workdir, False, False, 0)
        radio_box.pack_start(self.radio_custom, False, False, 0)
        vbox.pack_start(radio_box, False, False, 0)

        filename_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=6)
        filename_box.pack_start(Gtk.Label(label="Nombre de archivo:"), False, False, 0)
        filename_box.pack_start(self.filename_entry, True, True, 0)
        vbox.pack_start(filename_box, False, False, 0)

        self.choose_btn = Gtk.Button(label="Seleccionar carpeta…")
        self.choose_btn.set_sensitive(False)
        self.choose_btn.connect("clicked", self._on_choose_folder)
        vbox.pack_start(self.choose_btn, False, False, 0)

        self.selected_path_label = Gtk.Label()
        self.selected_path_label.set_halign(Gtk.Align.START)
        vbox.pack_start(self.selected_path_label, False, False, 0)

        self.show_all()

    def _on_radio_toggled(self, btn):
        if self.radio_custom.get_active():
            self.choose_btn.set_sensitive(True)
            self.save_option = "custom"
        else:
            self.choose_btn.set_sensitive(False)
            self.save_option = "workdir"

    def _on_choose_folder(self, *_):
        dialog = Gtk.FileChooserDialog(
            title="Seleccionar carpeta",
            action=Gtk.FileChooserAction.SELECT_FOLDER,
            buttons=(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
                     "Seleccionar", Gtk.ResponseType.OK)
        )
        if dialog.run() == Gtk.ResponseType.OK:
            folder = dialog.get_filename()
            self.custom_path = folder
            self.selected_path_label.set_text(f"Carpeta seleccionada: {folder}")
        dialog.destroy()

    def get_save_option(self):
        return self.save_option

    def get_filename(self):
        return self.filename_entry.get_text().strip() or "mysql.sql"

    def get_custom_path(self):
        if self.custom_path:
            return os.path.join(self.custom_path, self.get_filename())
        return None
