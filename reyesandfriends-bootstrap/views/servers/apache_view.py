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
        self.liststore = Gtk.ListStore(int, str, int, int, str, str, str, int)  # id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http
        self._refresh_liststore()
        self.treeview = Gtk.TreeView(model=self.liststore)

        renderer_text = Gtk.CellRendererText()
        renderer_bool = Gtk.CellRendererText()

        col1 = Gtk.TreeViewColumn("Dominios", renderer_text, text=1)
        col2 = Gtk.TreeViewColumn("HTTP", renderer_bool)
        col2.set_cell_data_func(renderer_bool, lambda col, cell, model, iter, data: cell.set_property("text", "Sí" if model[iter][2] else "No"))
        col3 = Gtk.TreeViewColumn("HTTPS", renderer_bool)
        col3.set_cell_data_func(renderer_bool, lambda col, cell, model, iter, data: cell.set_property("text", "Sí" if model[iter][3] else "No"))
        col4 = Gtk.TreeViewColumn("Path", renderer_text, text=4)
        col5 = Gtk.TreeViewColumn("SSL", renderer_text, text=5)
        col6 = Gtk.TreeViewColumn("Redirect", renderer_bool)
        col6.set_cell_data_func(renderer_bool, lambda col, cell, model, iter, data: cell.set_property("text", "Sí" if model[iter][7] else "No"))

        self.treeview.append_column(col1)
        self.treeview.append_column(col2)
        self.treeview.append_column(col3)
        self.treeview.append_column(col4)
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
            # row: (id, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http)
            row = list(row)
            # Compatibilidad hacia atrás
            while len(row) < 8:
                if len(row) == 5:
                    row.append("certbot")  # ssl_preset
                elif len(row) == 6:
                    row.append("")         # ssl_cert
                elif len(row) == 7:
                    row.append(0)          # redirect_http
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
            delete_apache_config(id_)
            self._refresh_liststore()

    def _on_generar_clicked(self, *_):
        selection = self.treeview.get_selection()
        model, treeiter = selection.get_selected()
        if treeiter:
            id_ = model[treeiter][0]
            config = get_apache_config(id_)
            if config:
                server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http = config[1], config[2], config[3], config[4], config[5], config[6], config[7]
                conf_text = self._generate_apache_conf(server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http)
                preview_dialog = ApacheConfPreviewDialog(self.get_toplevel(), conf_text)
                response = preview_dialog.run()
                if response == Gtk.ResponseType.OK:
                    save_option = preview_dialog.get_save_option()
                    filename = preview_dialog.get_filename()
                    if save_option == "workdir":
                        workdir = get_workdir()
                        filepath = os.path.join(workdir, filename)
                    else:
                        filepath = preview_dialog.get_custom_path()
                        if not filepath:
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

    def _generate_apache_conf(self, server_names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http):
        names = " ".join([n.strip() for n in server_names.split(",") if n.strip()])
        blocks = []
        certfile = ""
        keyfile = ""
        if ssl_preset == "certbot":
            certfile = f"/etc/letsencrypt/live/{names.split()[0]}/fullchain.pem"
            keyfile = f"/etc/letsencrypt/live/{names.split()[0]}/privkey.pem"
        elif ssl_preset == "snakeoil":
            certfile = "/etc/ssl/certs/ssl-cert-snakeoil.pem"
            keyfile = "/etc/ssl/private/ssl-cert-snakeoil.key"
        elif ssl_preset == "custom":
            certfile, keyfile = (ssl_cert or "").split("::") if "::" in (ssl_cert or "") else ("", "")

        if http_enabled:
            if https_enabled and redirect_http:
                blocks.append(f"""<VirtualHost *:80>
    ServerName {names.split()[0]}
    ServerAlias {' '.join(names.split()[1:]) if len(names.split()) > 1 else ''}
    Redirect permanent / https://{names.split()[0]}/
</VirtualHost>""")
            else:
                blocks.append(f"""<VirtualHost *:80>
    ServerName {names.split()[0]}
    ServerAlias {' '.join(names.split()[1:]) if len(names.split()) > 1 else ''}
    DocumentRoot {docroot}
    ErrorLog ${{APACHE_LOG_DIR}}/error.log
    CustomLog ${{APACHE_LOG_DIR}}/access.log combined
</VirtualHost>""")
        if https_enabled:
            blocks.append(f"""<VirtualHost *:443>
    ServerName {names.split()[0]}
    ServerAlias {' '.join(names.split()[1:]) if len(names.split()) > 1 else ''}
    DocumentRoot {docroot}
    SSLEngine on
    SSLCertificateFile {certfile}
    SSLCertificateKeyFile {keyfile}
    ErrorLog ${{APACHE_LOG_DIR}}/error.log
    CustomLog ${{APACHE_LOG_DIR}}/access.log combined
</VirtualHost>""")
        return "\n\n".join(blocks)

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

        # Mostrar/ocultar campos según selección
        def on_https_toggled(btn):
            self.combo_ssl.set_sensitive(btn.get_active())
            self.check_redirect.set_sensitive(btn.get_active())
            if not btn.get_active():
                self.combo_ssl.set_active(-1)
                self.check_redirect.set_active(False)
            # Ocultar campo custom si no hay https
            self.entry_ssl_custom.set_sensitive(False)
            lbl_ssl_custom.set_sensitive(False)
        self.check_https.connect("toggled", on_https_toggled)

        def on_ssl_combo_changed(combo):
            is_custom = combo.get_active_id() == "custom"
            self.entry_ssl_custom.set_sensitive(is_custom)
            lbl_ssl_custom.set_sensitive(is_custom)
        self.combo_ssl.connect("changed", on_ssl_combo_changed)

        # Inicialización de valores
        if config:
            self.entry_names.set_text(config[1])
            self.check_http.set_active(bool(config[2]))
            self.check_https.set_active(bool(config[3]))
            self.entry_docroot.set_text(config[4])
            self.combo_ssl.set_active_id(config[5] or "certbot")
            self.entry_ssl_custom.set_text(config[6] or "")
            self.check_redirect.set_active(bool(config[7]))
        else:
            self.check_http.set_active(True)
            self.check_https.set_active(False)
            self.entry_docroot.set_text("/var/www/html")
            self.combo_ssl.set_active_id("certbot")
            self.entry_ssl_custom.set_text("")
            self.check_redirect.set_active(False)

        # Estado inicial de widgets
        self.combo_ssl.set_sensitive(self.check_https.get_active())
        self.check_redirect.set_sensitive(self.check_https.get_active())
        is_custom = self.combo_ssl.get_active_id() == "custom" and self.check_https.get_active()
        self.entry_ssl_custom.set_sensitive(is_custom)
        lbl_ssl_custom.set_sensitive(is_custom)

        self.show_all()

    def get_data(self):
        names = self.entry_names.get_text().strip()
        http_enabled = self.check_http.get_active()
        https_enabled = self.check_https.get_active()
        docroot = self.entry_docroot.get_text().strip()
        ssl_preset = self.combo_ssl.get_active_id() or "certbot"
        ssl_cert = self.entry_ssl_custom.get_text().strip() if ssl_preset == "custom" else ""
        redirect_http = self.check_redirect.get_active()
        return names, http_enabled, https_enabled, docroot, ssl_preset, ssl_cert, redirect_http

class ApacheConfPreviewDialog(Gtk.Dialog):
    def __init__(self, parent, conf_text):
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
        self.filename_entry.set_text("vhost.conf")
        self.custom_path = None

        radio_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=6)
        self.radio_workdir = Gtk.RadioButton.new_with_label_from_widget(None, f"Guardar en directorio de trabajo ({get_workdir()})")
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
        return self.filename_entry.get_text().strip() or "vhost.conf"

    def get_custom_path(self):
        if self.custom_path:
            return os.path.join(self.custom_path, self.get_filename())
        return None
