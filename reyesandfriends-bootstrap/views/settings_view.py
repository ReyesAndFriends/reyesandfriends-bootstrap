import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

from config import get_workdir, set_workdir

class SettingsView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=16)
        self.set_border_width(24)

        label = Gtk.Label(label="Directorio de trabajo actual:")
        label.set_halign(Gtk.Align.START)
        self.pack_start(label, False, False, 0)

        self.entry = Gtk.Entry()
        self.entry.set_text(get_workdir())
        self.pack_start(self.entry, False, False, 0)

        btn_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
        self.save_btn = Gtk.Button(label="Guardar")
        self.save_btn.connect("clicked", self.on_save)
        btn_box.pack_start(self.save_btn, False, False, 0)

        self.folder_btn = Gtk.Button(label="Seleccionar carpeta…")
        self.folder_btn.connect("clicked", self.on_select_folder)
        btn_box.pack_start(self.folder_btn, False, False, 0)

        self.pack_start(btn_box, False, False, 0)

        self.status = Gtk.Label()
        self.pack_start(self.status, False, False, 0)

    def on_save(self, *_):
        path = self.entry.get_text()
        set_workdir(path)
        self.status.set_text("¡Guardado!")

    def on_select_folder(self, *_):
        dialog = Gtk.FileChooserDialog(
            title="Seleccionar carpeta",
            action=Gtk.FileChooserAction.SELECT_FOLDER,
            buttons=(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
                     "Seleccionar", Gtk.ResponseType.OK)
        )
        if dialog.run() == Gtk.ResponseType.OK:
            self.entry.set_text(dialog.get_filename())
        dialog.destroy()
