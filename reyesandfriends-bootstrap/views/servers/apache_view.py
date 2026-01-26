import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

class ApacheView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        label = Gtk.Label(label="Menú Apache (CRUD de configuraciones)")
        label.set_margin_top(40)
        label.set_margin_bottom(40)
        label.set_halign(Gtk.Align.CENTER)
        self.pack_start(label, True, True, 0)
