import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GdkPixbuf
import os

class HttpServersView(Gtk.Box):
    def __init__(self, on_navigate=None):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=24)
        self.set_margin_top(48)
        self.set_margin_bottom(48)
        self.set_margin_start(48)
        self.set_margin_end(48)

        # Título
        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>Servidores HTTP</span>")
        title.set_justify(Gtk.Justification.CENTER)
        title.set_halign(Gtk.Align.CENTER)
        self.pack_start(title, False, False, 0)

        # Descripción
        desc = Gtk.Label(label="Configura y genera configuraciones para servidores HTTP como Apache o Nginx.")
        desc.set_justify(Gtk.Justification.CENTER)
        desc.set_halign(Gtk.Align.CENTER)
        desc.set_margin_bottom(24)
        self.pack_start(desc, False, False, 0)

        btns_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=24)
        btns_box.set_halign(Gtk.Align.CENTER)
        btns_box.set_valign(Gtk.Align.CENTER)

        base_dir = os.path.dirname(os.path.dirname(__file__))
        apache_icon_path = os.path.join(base_dir, "assets", "icons", "apache.svg")
        nginx_icon_path = os.path.join(base_dir, "assets", "icons", "nginx.png")

        # Apache
        apache_img = Gtk.Image()
        try:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(apache_icon_path, 160, 80, True)
            apache_img.set_from_pixbuf(pixbuf)
        except Exception:
            apache_img = Gtk.Image.new_from_file(apache_icon_path)
        btn_apache = Gtk.Button()
        btn_apache.set_size_request(400, 120)
        btn_apache_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=24)
        btn_apache_box.set_halign(Gtk.Align.CENTER)
        btn_apache_box.set_valign(Gtk.Align.CENTER)
        btn_apache_box.pack_start(apache_img, False, False, 0)
        text_apache_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        lbl_apache = Gtk.Label()
        lbl_apache.set_markup("<b>Apache</b>")
        lbl_apache.set_xalign(0)
        desc_apache = Gtk.Label(label="Servidor HTTTP robusto y ampliamente utilizado. Ideal para aplicaciones empresariales y sitios web complejos.")
        desc_apache.set_justify(Gtk.Justification.LEFT)
        desc_apache.set_xalign(0)
        desc_apache.set_margin_bottom(2)
        text_apache_box.pack_start(lbl_apache, False, False, 0)
        text_apache_box.pack_start(desc_apache, False, False, 0)
        btn_apache_box.pack_start(text_apache_box, True, True, 0)
        btn_apache.add(btn_apache_box)
        btn_apache.connect("clicked", lambda w: on_navigate and on_navigate("apache"))

        # Nginx
        nginx_img = Gtk.Image()
        try:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(nginx_icon_path, 100, 100, True)
            nginx_img.set_from_pixbuf(pixbuf)
        except Exception:
            nginx_img = Gtk.Image.new_from_file(nginx_icon_path)
        btn_nginx = Gtk.Button()
        btn_nginx.set_size_request(400, 120)
        btn_nginx_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=24)
        btn_nginx_box.set_halign(Gtk.Align.CENTER)
        btn_nginx_box.set_valign(Gtk.Align.CENTER)
        btn_nginx_box.pack_start(nginx_img, False, False, 0)
        text_nginx_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        lbl_nginx = Gtk.Label()
        lbl_nginx.set_markup("<b>Nginx</b>")
        lbl_nginx.set_xalign(0)
        desc_nginx = Gtk.Label(label="Servidor HTTP ligero y de alto rendimiento. Ideal para proxy inverso, balanceo de carga y sitios web estáticos.")
        desc_nginx.set_justify(Gtk.Justification.LEFT)
        desc_nginx.set_xalign(0)
        desc_nginx.set_margin_bottom(2)
        text_nginx_box.pack_start(lbl_nginx, False, False, 0)
        text_nginx_box.pack_start(desc_nginx, False, False, 0)
        btn_nginx_box.pack_start(text_nginx_box, True, True, 0)
        btn_nginx.add(btn_nginx_box)
        btn_nginx.connect("clicked", lambda w: on_navigate and on_navigate("nginx"))

        btns_box.pack_start(btn_apache, False, False, 0)
        btns_box.pack_start(btn_nginx, False, False, 0)

        self.pack_start(btns_box, False, False, 0)
