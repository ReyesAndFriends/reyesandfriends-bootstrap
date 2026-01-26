import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GdkPixbuf
import os
from config import get_workdir

from service.apache_database_service import (
    list_apache_configs, create_apache_config, update_apache_config,
    delete_apache_config, get_apache_config
)

class ApacheView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        self.set_margin_top(32)
        self.set_margin_bottom(32)
        self.set_margin_start(32)
        self.set_margin_end(32)

        header_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=16)
        header_box.set_halign(Gtk.Align.START)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        apache_icon_path = os.path.join(base_dir, "assets", "icons", "apache.svg")
        apache_img = Gtk.Image()
        try:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(apache_icon_path, 48, 48, True)
            apache_img.set_from_pixbuf(pixbuf)
        except Exception:
            apache_img = Gtk.Image.new_from_file(apache_icon_path)
        header_box.pack_start(apache_img, False, False, 0)
        title = Gtk.Label()
        title.set_markup("<span size='x-large' weight='bold'>Configuraciones Apache</span>")
        title.set_halign(Gtk.Align.START)
        header_box.pack_start(title, False, False, 0)
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
        list_frame.set_size_request(-1, 180)
        self.liststore = Gtk.ListStore(int, str, int, int, str, str, str, int, int, str)  
        # id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target
        self._refresh_liststore()
        self.treeview = Gtk.TreeView(model=self.liststore)

        renderer_text = Gtk.CellRendererText()
        renderer_bool = Gtk.CellRendererText()

        col1 = Gtk.TreeViewColumn("Dominios", renderer_text, text=1)
        col2 = Gtk.TreeViewColumn("HTTP", renderer_bool)
        col2.set_cell_data_func(renderer_bool, lambda col, cell, model, iter, data: cell.set_property("text", "Sí" if model[iter][2] else "No"))
        col3 = Gtk.TreeViewColumn("HTTPS", renderer_bool)
        col3.set_cell_data_func(renderer_bool, lambda col, cell, model, iter, data: cell.set_property("text", "Sí" if model[iter][3] else "No"))
        col4 = Gtk.TreeViewColumn("Path", renderer_text)
        col4.set_cell_data_func(renderer_text, lambda col, cell, model, iter, data:
            cell.set_property("text", model[iter][4] if not model[iter][8] else "No aplica"))
        col_proxy = Gtk.TreeViewColumn("Proxy", renderer_text)
        col_proxy.set_cell_data_func(renderer_text, lambda col, cell, model, iter, data:
            cell.set_property("text", model[iter][9] if model[iter][8] else "No aplica"))
        col5 = Gtk.TreeViewColumn("SSL", renderer_text, text=5)
        col6 = Gtk.TreeViewColumn("Redirect", renderer_bool)
        col6.set_cell_data_func(renderer_bool, lambda col, cell, model, iter, data: cell.set_property("text", "Sí" if model[iter][7] else "No"))

        self.treeview.append_column(col1)
        self.treeview.append_column(col2)
        self.treeview.append_column(col3)
        self.treeview.append_column(col4)
        self.treeview.append_column(col_proxy)
        self.treeview.append_column(col5)
        self.treeview.append_column(col6)
        select = self.treeview.get_selection()
        select.connect("changed", self._on_selection_changed)
        list_box = Gtk.ScrolledWindow()
        list_box.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        list_box.add(self.treeview)
        list_frame.add(list_box)
        crud_box.pack_start(list_frame, True, True, 0)

        btns_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
        self.btn_nueva = Gtk.Button(label="Nueva")
        self.btn_editar = Gtk.Button(label="Editar")
        self.btn_eliminar = Gtk.Button(label="Eliminar")
        self.btn_generar = Gtk.Button(label="Generar .conf")
        self.btn_editar.set_sensitive(False)
        self.btn_eliminar.set_sensitive(False)
        self.btn_generar.set_sensitive(False)
        btns_box.pack_start(self.btn_nueva, False, False, 0)
        btns_box.pack_start(self.btn_editar, False, False, 0)
        btns_box.pack_start(self.btn_eliminar, False, False, 0)
        btns_box.pack_end(self.btn_generar, False, False, 0)
        crud_box.pack_start(btns_box, False, False, 0)

        self.btn_nueva.connect("clicked", self._on_nueva_clicked)
        self.btn_editar.connect("clicked", self._on_editar_clicked)
        self.btn_eliminar.connect("clicked", self._on_eliminar_clicked)
        self.btn_generar.connect("clicked", self._on_generar_clicked)

        self.pack_start(crud_box, True, True, 0)

    def _refresh_liststore(self):
        self.liststore.clear()
        for row in list_apache_configs():
            # row: (id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target)
            row = list(row)
            # Compatibilidad hacia atrás
            while len(row) < 10:
                if len(row) == 8:
                    row.append(0)      # is_proxy
                elif len(row) == 9:
                    row.append("")     # proxy_target
            self.liststore.append(row)

    def _on_selection_changed(self, selection):
        model, treeiter = selection.get_selected()
        is_selected = treeiter is not None
        self.btn_editar.set_sensitive(is_selected)
        self.btn_eliminar.set_sensitive(is_selected)
        self.btn_generar.set_sensitive(is_selected)

    def _on_nueva_clicked(self, *_):
        dialog = ApacheConfigDialog(self.get_toplevel(), "Nueva configuración")
        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            data = dialog.get_data()
            create_apache_config(*data)
            self._refresh_liststore()
        dialog.destroy()

    def _on_editar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            id_ = model[treeiter][0]
            config = get_apache_config(id_)
            dialog = ApacheConfigDialog(self.get_toplevel(), "Editar configuración", config)
            response = dialog.run()
            if response == Gtk.ResponseType.OK:
                data = dialog.get_data()
                update_apache_config(id_, *data)
                self._refresh_liststore()
            dialog.destroy()

    def _on_eliminar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            id_ = model[treeiter][0]
            config = get_apache_config(id_)
            # Confirmación antes de eliminar
            dialog = Gtk.MessageDialog(
                transient_for=self.get_toplevel(),
                flags=0,
                message_type=Gtk.MessageType.QUESTION,
                buttons=Gtk.ButtonsType.YES_NO,
                text="¿Está seguro que desea eliminar esta configuración?"
            )
            response = dialog.run()
            dialog.destroy()
            if response == Gtk.ResponseType.YES:
                # Buscar archivo .conf asociado
                server_names = config[1]
                main_name = [n.strip() for n in server_names.split(",") if n.strip()][0] if server_names else None
                conf_filename = f"{main_name}.conf" if main_name else None
                workdir = get_workdir()
                apache_dir = os.path.join(workdir, "http-configs", "apache")
                conf_path = os.path.join(apache_dir, conf_filename) if conf_filename else None
                file_exists = conf_path and os.path.isfile(conf_path)
                # Si existe el archivo, preguntar si también eliminarlo
                if file_exists:
                    dialog2 = Gtk.MessageDialog(
                        transient_for=self.get_toplevel(),
                        flags=0,
                        message_type=Gtk.MessageType.QUESTION,
                        buttons=Gtk.ButtonsType.YES_NO,
                        text=f"También se encontró el archivo:\n{conf_path}\n¿Desea eliminarlo?"
                    )
                    response2 = dialog2.run()
                    dialog2.destroy()
                    if response2 == Gtk.ResponseType.YES:
                        try:
                            os.remove(conf_path)
                        except Exception as e:
                            self._show_notification(f"Error al eliminar archivo:\n{e}")
                delete_apache_config(id_)
                self._refresh_liststore()
                self._show_notification("Configuración eliminada correctamente.")

    def _on_generar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            id_ = model[treeiter][0]
            config = get_apache_config(id_)
            if config:
                # Desempaquetar nuevos campos
                (server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target) = (
                    config[1], config[2], config[3], config[4], config[5], config[6], config[7], config[8], config[9]
                )
                conf_text = self._generate_apache_conf(server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target)
                # Obtener el dominio principal para sugerir el nombre de archivo
                main_name = [n.strip() for n in server_names.split(",") if n.strip()][0] if server_names else "apache-website"
                suggested_filename = f"{main_name}.conf"
                preview_dialog = ApacheConfPreviewDialog(self.get_toplevel(), conf_text, suggested_filename)
                response = preview_dialog.run()
                if response == Gtk.ResponseType.OK:
                    save_option = preview_dialog.get_save_option()
                    filename = preview_dialog.get_filename()
                    if save_option == "workdir":
                        workdir = get_workdir()
                        apache_dir = os.path.join(workdir, "http-configs", "apache")
                        os.makedirs(apache_dir, exist_ok=True)
                        filepath = os.path.join(apache_dir, filename)
                    else:
                        filepath = preview_dialog.get_custom_path()
                        if not filepath:
                            preview_dialog.destroy()
                            return
                    # Verificar si el archivo ya existe y pedir confirmación para sobreescribir
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
                            f.write(conf_text)
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

    def _generate_apache_conf(self, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target):
        def indent(text, spaces=4):
            pad = " " * spaces
            return "\n".join(pad + line if line.strip() else "" for line in text.splitlines())

        names = [n.strip() for n in server_names.split(",") if n.strip()]
        main_name = names[0] if names else ""
        aliases = names[1:] if len(names) > 1 else []
        blocks = []
        certfile = ""
        keyfile = ""
        if ssl_preset == "certbot":
            certfile = f"/etc/letsencrypt/live/{main_name}/fullchain.pem"
            keyfile = f"/etc/letsencrypt/live/{main_name}/privkey.pem"
        elif ssl_preset == "snakeoil":
            certfile = "/etc/ssl/certs/ssl-cert-snakeoil.pem"
            keyfile = "/etc/ssl/private/ssl-cert-snakeoil.key"
        elif ssl_preset == "custom":
            certfile, keyfile = (ssl_cert or "").split("::") if "::" in (ssl_cert or "") else ("", "")

        if is_proxy:
            proxy_block = f"""
ProxyPreserveHost On
ProxyPass / http://{proxy_target}/
ProxyPassReverse / http://{proxy_target}/
"""
            formatted_proxy_block = indent(proxy_block, 4)
        else:
            directory_block = f"""<Directory {docroot}>
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>"""
            formatted_directory_block = indent(directory_block, 4)

        def server_alias_line():
            return indent(f"ServerAlias {' '.join(aliases)}") if aliases else ""

        if http_enabled:
            if https_enabled and redirect_http:
                # Solo redirección, sin proxy ni directory
                blocks.append(
                    "<VirtualHost *:80>\n"
                    f"{indent(f'ServerName {main_name}')}\n"
                    f"{server_alias_line()}\n"
                    f"{indent(f'Redirect permanent / https://{main_name}/')}\n"
                    "</VirtualHost>\n"
                )
            else:
                blocks.append(
                    "<VirtualHost *:80>\n"
                    f"{indent(f'ServerName {main_name}')}\n"
                    f"{server_alias_line()}\n"
                    f"{indent(f'DocumentRoot {docroot}') if not is_proxy else ''}\n"
                    f"{indent('ErrorLog ${APACHE_LOG_DIR}/error.log')}\n"
                    f"{indent('CustomLog ${APACHE_LOG_DIR}/access.log combined')}\n"
                    f"{formatted_proxy_block if is_proxy else formatted_directory_block}\n"
                    "</VirtualHost>\n"
                )
        if https_enabled:
            blocks.append(
                "<VirtualHost *:443>\n"
                f"{indent(f'ServerName {main_name}')}\n"
                f"{server_alias_line()}\n"
                f"{indent(f'DocumentRoot {docroot}') if not is_proxy else ''}\n"
                f"{indent('SSLEngine on')}\n"
                f"{indent(f'SSLCertificateFile {certfile}')}\n"
                f"{indent(f'SSLCertificateKeyFile {keyfile}')}\n"
                f"{indent('ErrorLog ${APACHE_LOG_DIR}/error.log')}\n"
                f"{indent('CustomLog ${APACHE_LOG_DIR}/access.log combined')}\n"
                f"{formatted_proxy_block if is_proxy else formatted_directory_block}\n"
                "</VirtualHost>\n"
            )
        return "\n".join(blocks)

class ApacheConfigDialog(Gtk.Dialog):
    def __init__(self, parent, title, config=None):
        super().__init__(title, parent, 0,
            (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
             Gtk.STOCK_OK, Gtk.ResponseType.OK)
        )
        self.set_default_size(400, 320)
        box = self.get_content_area()
        grid = Gtk.Grid(row_spacing=10, column_spacing=10, margin=10)
        box.add(grid)

        lbl_names = Gtk.Label(label="Dominios (separados por coma):")
        lbl_names.set_halign(Gtk.Align.END)
        self.entry_names = Gtk.Entry()
        grid.attach(lbl_names, 0, 0, 1, 1)
        grid.attach(self.entry_names, 1, 0, 2, 1)

        lbl_http = Gtk.Label(label="Habilitar HTTP (80):")
        lbl_http.set_halign(Gtk.Align.END)
        self.check_http = Gtk.CheckButton()
        grid.attach(lbl_http, 0, 1, 1, 1)
        grid.attach(self.check_http, 1, 1, 2, 1)

        lbl_https = Gtk.Label(label="Habilitar HTTPS (443):")
        lbl_https.set_halign(Gtk.Align.END)
        self.check_https = Gtk.CheckButton()
        grid.attach(lbl_https, 0, 2, 1, 1)
        grid.attach(self.check_https, 1, 2, 2, 1)

        lbl_docroot = Gtk.Label(label="Path del sitio (DocumentRoot):")
        lbl_docroot.set_halign(Gtk.Align.END)
        self.entry_docroot = Gtk.Entry()
        grid.attach(lbl_docroot, 0, 3, 1, 1)
        grid.attach(self.entry_docroot, 1, 3, 2, 1)

        lbl_ssl = Gtk.Label(label="Certificado SSL:")
        lbl_ssl.set_halign(Gtk.Align.END)
        self.combo_ssl = Gtk.ComboBoxText()
        self.combo_ssl.append("certbot", "Certbot (Let's Encrypt)")
        self.combo_ssl.append("snakeoil", "Snakeoil (por defecto)")
        self.combo_ssl.append("custom", "Personalizado")
        grid.attach(lbl_ssl, 0, 4, 1, 1)
        grid.attach(self.combo_ssl, 1, 4, 2, 1)

        lbl_ssl_custom = Gtk.Label(label="Ruta cert y key (custom):")
        lbl_ssl_custom.set_halign(Gtk.Align.END)
        self.entry_ssl_custom = Gtk.Entry()
        self.entry_ssl_custom.set_placeholder_text("/ruta/cert.pem::/ruta/key.pem")
        grid.attach(lbl_ssl_custom, 0, 5, 1, 1)
        grid.attach(self.entry_ssl_custom, 1, 5, 2, 1)

        self.check_redirect = Gtk.CheckButton(label="Redirigir HTTP a HTTPS")
        grid.attach(self.check_redirect, 1, 6, 2, 1)

        # Opción para proxy inverso
        self.radio_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        self.radio_docroot = Gtk.RadioButton.new_with_label_from_widget(None, "Usar DocumentRoot")
        self.radio_proxy = Gtk.RadioButton.new_with_label_from_widget(self.radio_docroot, "Usar Proxy Inverso")
        self.radio_box.pack_start(self.radio_docroot, False, False, 0)
        self.radio_box.pack_start(self.radio_proxy, False, False, 0)
        grid.attach(self.radio_box, 1, 7, 2, 1)

        lbl_proxy = Gtk.Label(label="Proxy destino (IP:PUERTO):")
        lbl_proxy.set_halign(Gtk.Align.END)
        self.entry_proxy = Gtk.Entry()
        self.entry_proxy.set_placeholder_text("127.0.0.1:3000")
        grid.attach(lbl_proxy, 0, 8, 1, 1)
        grid.attach(self.entry_proxy, 1, 8, 2, 1)

        # Mostrar/ocultar campos según selección
        def update_ssl_widgets():
            https_active = self.check_https.get_active()
            self.combo_ssl.set_sensitive(https_active)
            self.check_redirect.set_sensitive(https_active)
            is_custom = self.combo_ssl.get_active_id() == "custom" and https_active
            self.entry_ssl_custom.set_sensitive(is_custom)
            lbl_ssl_custom.set_sensitive(is_custom)

        def on_https_toggled(btn):
            update_ssl_widgets()
        self.check_https.connect("toggled", on_https_toggled)

        def on_ssl_combo_changed(combo):
            update_ssl_widgets()
        self.combo_ssl.connect("changed", on_ssl_combo_changed)

        def on_proxy_toggled(btn):
            is_proxy = self.radio_proxy.get_active()
            self.entry_docroot.set_sensitive(not is_proxy)
            lbl_docroot.set_sensitive(not is_proxy)
            self.entry_proxy.set_sensitive(is_proxy)
            lbl_proxy.set_sensitive(is_proxy)

        self.radio_docroot.connect("toggled", on_proxy_toggled)
        self.radio_proxy.connect("toggled", on_proxy_toggled)

        # Inicialización de valores
        if config:
            self.entry_names.set_text(config[1])
            self.check_http.set_active(bool(config[2]))
            self.check_https.set_active(bool(config[3]))
            self.entry_docroot.set_text(config[4])
            self.combo_ssl.set_active_id(config[5] or "certbot")
            self.entry_ssl_custom.set_text(config[6] or "")
            self.check_redirect.set_active(bool(config[7]))
            if len(config) > 8 and config[8]:
                self.radio_proxy.set_active(True)
            else:
                self.radio_docroot.set_active(True)
            if len(config) > 9:
                self.entry_proxy.set_text(config[9] or "")
            else:
                self.entry_proxy.set_text("")
        else:
            self.check_http.set_active(True)
            self.check_https.set_active(False)
            self.entry_docroot.set_text("/var/www/html")
            self.combo_ssl.set_active_id("certbot")
            self.entry_ssl_custom.set_text("")
            self.check_redirect.set_active(False)
            self.radio_docroot.set_active(True)
            self.entry_proxy.set_text("")

        # Estado inicial de widgets
        update_ssl_widgets()
        on_proxy_toggled(None)

        self.show_all()

    def get_data(self):
        names = self.entry_names.get_text().strip()
        http_enabled = self.check_http.get_active()
        https_enabled = self.check_https.get_active()
        docroot = self.entry_docroot.get_text().strip()
        ssl_preset = self.combo_ssl.get_active_id() or "certbot"
        ssl_cert = self.entry_ssl_custom.get_text().strip() if ssl_preset == "custom" else ""
        redirect_http = self.check_redirect.get_active()
        is_proxy = int(self.radio_proxy.get_active())
        proxy_target = self.entry_proxy.get_text().strip() if is_proxy else ""
        return names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http, is_proxy, proxy_target

class ApacheConfPreviewDialog(Gtk.Dialog):
    def __init__(self, parent, conf_text, suggested_filename="apache-website.conf"):
        super().__init__("Preview y Guardar .conf", parent, 0,
            (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
             Gtk.STOCK_SAVE, Gtk.ResponseType.OK)
        )
        self.set_default_size(500, 350)
        box = self.get_content_area()
        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10, margin=10)
        box.add(vbox)

        label = Gtk.Label(label="Vista previa del archivo .conf:")
        label.set_halign(Gtk.Align.START)
        vbox.pack_start(label, False, False, 0)

        scrolled = Gtk.ScrolledWindow()
        scrolled.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        self.textview = Gtk.TextView()
        self.textview.set_editable(False)
        self.textview.get_buffer().set_text(conf_text)
        scrolled.add(self.textview)
        scrolled.set_min_content_height(180)
        vbox.pack_start(scrolled, True, True, 0)

        self.save_option = "workdir"
        self.filename_entry = Gtk.Entry()
        self.filename_entry.set_text(suggested_filename)
        self.custom_path = None

        radio_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=6)
        self.radio_workdir = Gtk.RadioButton.new_with_label_from_widget(None, f"Guardar en http-configs/apache/ dentro del directorio de trabajo ({get_workdir()})")
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
        return self.filename_entry.get_text().strip() or "apache-website.conf"

    def get_custom_path(self):
        if self.custom_path:
            return os.path.join(self.custom_path, self.get_filename())
        return None
