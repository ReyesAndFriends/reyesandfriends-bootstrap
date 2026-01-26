import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GdkPixbuf
import os

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
        list_box = Gtk.Box()
        list_frame.add(list_box)
        crud_box.pack_start(list_frame, True, True, 0)

        btns_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
        btn_nueva = Gtk.Button(label="Nueva")
        btn_editar = Gtk.Button(label="Editar")
        btn_eliminar = Gtk.Button(label="Eliminar")
        btn_generar = Gtk.Button(label="Generar .conf")
        btn_editar.set_sensitive(False)
        btn_eliminar.set_sensitive(False)
        btns_box.pack_start(btn_nueva, False, False, 0)
        btns_box.pack_start(btn_editar, False, False, 0)
        btns_box.pack_start(btn_eliminar, False, False, 0)
        btns_box.pack_end(btn_generar, False, False, 0)
        crud_box.pack_start(btns_box, False, False, 0)

        self.pack_start(crud_box, True, True, 0)
