import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

class MysqlView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=24)
        self.set_margin_top(48)
        self.set_margin_bottom(48)
        self.set_margin_start(48)
        self.set_margin_end(48)

        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>MySQL</span>")
        title.set_justify(Gtk.Justification.CENTER)
        title.set_halign(Gtk.Align.CENTER)
        self.pack_start(title, False, False, 0)

        desc = Gtk.Label(label="Aquí podrás gestionar y ejecutar scripts SQL para bases de datos MySQL.")
        desc.set_justify(Gtk.Justification.CENTER)
        desc.set_halign(Gtk.Align.CENTER)
        self.pack_start(desc, False, False, 0)
