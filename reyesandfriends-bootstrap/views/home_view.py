import gi
from gi.repository import Gtk, Gdk
from datetime import date
import os
from gi.repository import GdkPixbuf

class HomeView(Gtk.Box):

    def __init__(self, on_navigate=None):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        self.set_margin_top(32)
        self.set_margin_bottom(32)
        self.set_margin_start(32)
        self.set_margin_end(32)

        # Cambiar Grid por Box horizontal para mejor alineación vertical
        header_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=20)
        header_box.set_name("custom-header")
        header_box.set_valign(Gtk.Align.CENTER) 
        icon_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "assets", "icons", "app_icon.png"
        )

        pixbuf = GdkPixbuf.Pixbuf.new_from_file(icon_path)
        pixbuf = pixbuf.scale_simple(96, 96, GdkPixbuf.InterpType.BILINEAR)
        icon = Gtk.Image.new_from_pixbuf(pixbuf)
        icon.set_halign(Gtk.Align.CENTER)
        icon.set_valign(Gtk.Align.CENTER)

        icon_box = Gtk.EventBox()
        icon_box.add(icon)
        icon_box.set_valign(Gtk.Align.CENTER)

        text_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=6)
        text_box.set_valign(Gtk.Align.CENTER)
        label_title = Gtk.Label()
        label_title.set_markup('<span size="xx-large" weight="bold">Reyes&amp;Friends Bootstrap</span>')
        label_title.set_xalign(0)
        label_desc = Gtk.Label(label="Un gestor de utilidades para desarrolladores y administradores de sistemas para una puesta a producción rápida.")
        label_desc.set_xalign(0)
        label_desc.set_justify(Gtk.Justification.LEFT)
        text_box.pack_start(label_title, False, False, 0)
        text_box.pack_start(label_desc, False, False, 0)
        text_box.set_hexpand(True)

        header_box.pack_start(icon_box, False, False, 0)
        header_box.pack_start(text_box, True, True, 0)

        self.pack_start(header_box, False, False, 0)

        css = b"""
        #custom-header {
            background-image: linear-gradient(90deg,rgba(128, 27, 27, 1) 0%, rgba(166, 28, 28, 1) 50%, rgba(128, 24, 24, 1) 100%);
            border-radius: 12px;
            padding: 40px 32px;
        }
        #custom-header label {
            color: #fff;
        }
        """
        style_provider = Gtk.CssProvider()
        style_provider.load_from_data(css)
        Gtk.StyleContext.add_provider_for_screen(
            Gdk.Screen.get_default(),
            style_provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

        # Título
        title = Gtk.Label()
        title.set_markup("<big><b>Te damos la bienvenida</b></big>")
        title.set_justify(Gtk.Justification.CENTER)
        title.set_margin_top(10)
        title.set_margin_bottom(10)
        self.pack_start(title, False, False, 0)

        # Info
        info = Gtk.Label(label="Selecciona una de las siguientes opciones para comenzar:")
        info.set_justify(Gtk.Justification.CENTER)
        self.pack_start(info, False, False, 0)

        btns_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=16)
        btns_box.set_halign(Gtk.Align.CENTER)
        btns_box.set_valign(Gtk.Align.CENTER)
        btns_box.set_margin_top(16)
        btns_box.set_margin_bottom(16)

        # Contraseñas
        btn_passwords_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        icon_passwords = Gtk.Image.new_from_icon_name("dialog-password", Gtk.IconSize.DIALOG)
        text_passwords_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        label_passwords_title = Gtk.Label()
        label_passwords_title.set_markup("<b>Gestión de Contraseñas</b>")
        label_passwords_title.set_xalign(0)
        label_passwords_desc = Gtk.Label(label="Guarda y consulta tus contraseñas de forma segura.")
        label_passwords_desc.set_xalign(0)
        label_passwords_desc.set_justify(Gtk.Justification.LEFT)
        label_passwords_desc.set_margin_top(2)
        text_passwords_box.pack_start(label_passwords_title, False, False, 0)
        text_passwords_box.pack_start(label_passwords_desc, False, False, 0)
        btn_passwords_box.pack_start(icon_passwords, False, False, 0)
        btn_passwords_box.pack_start(text_passwords_box, True, True, 0)
        btn_passwords = Gtk.Button()
        btn_passwords.add(btn_passwords_box)
        btn_passwords.connect("clicked", lambda w: on_navigate and on_navigate("passwords"))
        btns_box.pack_start(btn_passwords, False, False, 0)

        # Servidores HTTP
        btn_http_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        icon_http = Gtk.Image.new_from_icon_name("network-server", Gtk.IconSize.DIALOG)
        text_http_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        label_http_title = Gtk.Label()
        label_http_title.set_markup("<b>Servidores HTTP</b>")
        label_http_title.set_xalign(0)
        label_http_desc = Gtk.Label(label="Configura y genera configuraciones para servidores HTTP como Apache o Nginx.")
        label_http_desc.set_xalign(0)
        label_http_desc.set_justify(Gtk.Justification.LEFT)
        label_http_desc.set_margin_top(2)
        text_http_box.pack_start(label_http_title, False, False, 0)
        text_http_box.pack_start(label_http_desc, False, False, 0)
        btn_http_box.pack_start(icon_http, False, False, 0)
        btn_http_box.pack_start(text_http_box, True, True, 0)
        btn_http = Gtk.Button()
        btn_http.add(btn_http_box)
        btn_http.connect("clicked", lambda w: on_navigate and on_navigate("http"))
        btns_box.pack_start(btn_http, False, False, 0)

        # Scripts SQL
        btn_sql_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        icon_sql = Gtk.Image.new_from_icon_name("x-office-spreadsheet", Gtk.IconSize.DIALOG)
        text_sql_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        label_sql_title = Gtk.Label()
        label_sql_title.set_markup("<b>Scripts SQL</b>")
        label_sql_title.set_xalign(0)
        label_sql_desc = Gtk.Label(label="Crea scripts SQL personalizados para la creación de bases de datos, usuarios y permisos.")
        label_sql_desc.set_xalign(0)
        label_sql_desc.set_justify(Gtk.Justification.LEFT)
        label_sql_desc.set_margin_top(2)
        text_sql_box.pack_start(label_sql_title, False, False, 0)
        text_sql_box.pack_start(label_sql_desc, False, False, 0)
        btn_sql_box.pack_start(icon_sql, False, False, 0)
        btn_sql_box.pack_start(text_sql_box, True, True, 0)
        btn_sql = Gtk.Button()
        btn_sql.add(btn_sql_box)
        btn_sql.connect("clicked", lambda w: on_navigate and on_navigate("sql"))
        btns_box.pack_start(btn_sql, False, False, 0)

        self.pack_start(btns_box, False, False, 0)

        current_year = date.today().year

        footer = Gtk.Label(label=f"Creado por Reyes&Friends · {current_year}")
        footer.set_margin_top(40)
        footer.set_justify(Gtk.Justification.CENTER)
        self.pack_end(footer, False, False, 0)
