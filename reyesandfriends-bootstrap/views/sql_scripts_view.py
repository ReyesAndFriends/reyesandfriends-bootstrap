import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GdkPixbuf
import os


class SqlScriptsView(Gtk.Box):
    """Vista de selección de tipo de base de datos (MySQL/PostgreSQL)"""
    def __init__(self, on_navigate=None):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=24)
        self.set_margin_top(48)
        self.set_margin_bottom(48)
        self.set_margin_start(48)
        self.set_margin_end(48)

        # Título
        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>Scripts SQL</span>")
        title.set_justify(Gtk.Justification.CENTER)
        title.set_halign(Gtk.Align.CENTER)
        self.pack_start(title, False, False, 0)

        # Descripción
        desc = Gtk.Label(label="Selecciona el motor de base de datos para gestionar y ejecutar scripts SQL.")
        desc.set_justify(Gtk.Justification.CENTER)
        desc.set_halign(Gtk.Align.CENTER)
        desc.set_margin_bottom(24)
        self.pack_start(desc, False, False, 0)

        btns_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=24)
        btns_box.set_halign(Gtk.Align.CENTER)
        btns_box.set_valign(Gtk.Align.CENTER)

        base_dir = os.path.dirname(os.path.dirname(__file__))
        mysql_icon_path = os.path.join(base_dir, "assets", "icons", "mysql.png")
        postgre_icon_path = os.path.join(base_dir, "assets", "icons", "postgre.png")

        # MySQL
        mysql_img = Gtk.Image()
        try:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(mysql_icon_path, 100, 100, True)
            mysql_img.set_from_pixbuf(pixbuf)
        except Exception:
            mysql_img = Gtk.Image.new_from_file(mysql_icon_path)
        btn_mysql = Gtk.Button()
        btn_mysql.set_size_request(400, 120)
        btn_mysql_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=24)
        btn_mysql_box.set_halign(Gtk.Align.CENTER)
        btn_mysql_box.set_valign(Gtk.Align.CENTER)
        btn_mysql_box.pack_start(mysql_img, False, False, 0)
        text_mysql_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        lbl_mysql = Gtk.Label()
        lbl_mysql.set_markup("<b>MySQL</b>")
        lbl_mysql.set_xalign(0)
        desc_mysql = Gtk.Label(label="Gestión y ejecución de scripts SQL para bases de datos MySQL.")
        desc_mysql.set_justify(Gtk.Justification.LEFT)
        desc_mysql.set_xalign(0)
        desc_mysql.set_margin_bottom(2)
        text_mysql_box.pack_start(lbl_mysql, False, False, 0)
        text_mysql_box.pack_start(desc_mysql, False, False, 0)
        btn_mysql_box.pack_start(text_mysql_box, True, True, 0)
        btn_mysql.add(btn_mysql_box)
        btn_mysql.connect("clicked", lambda w: on_navigate and on_navigate("mysql"))

        # PostgreSQL
        postgre_img = Gtk.Image()
        try:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(postgre_icon_path, 100, 100, True)
            postgre_img.set_from_pixbuf(pixbuf)
        except Exception:
            postgre_img = Gtk.Image.new_from_file(postgre_icon_path)
        btn_postgre = Gtk.Button()
        btn_postgre.set_size_request(400, 120)
        btn_postgre_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=24)
        btn_postgre_box.set_halign(Gtk.Align.CENTER)
        btn_postgre_box.set_valign(Gtk.Align.CENTER)
        btn_postgre_box.pack_start(postgre_img, False, False, 0)
        text_postgre_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        lbl_postgre = Gtk.Label()
        lbl_postgre.set_markup("<b>PostgreSQL</b>")
        lbl_postgre.set_xalign(0)
        desc_postgre = Gtk.Label(label="Gestión y ejecución de scripts SQL para bases de datos PostgreSQL.")
        desc_postgre.set_justify(Gtk.Justification.LEFT)
        desc_postgre.set_xalign(0)
        desc_postgre.set_margin_bottom(2)
        text_postgre_box.pack_start(lbl_postgre, False, False, 0)
        text_postgre_box.pack_start(desc_postgre, False, False, 0)
        btn_postgre_box.pack_start(text_postgre_box, True, True, 0)
        btn_postgre.add(btn_postgre_box)
        btn_postgre.connect("clicked", lambda w: on_navigate and on_navigate("postgre"))

        btns_box.pack_start(btn_mysql, False, False, 0)
        btns_box.pack_start(btn_postgre, False, False, 0)

        self.pack_start(btns_box, False, False, 0)
