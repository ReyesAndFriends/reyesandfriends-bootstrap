import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

from config import get_workdir, set_workdir, get_default_workdir

class SettingsView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=16)
        self.set_border_width(24)

        # Título
        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>Configuración</span>")
        title.set_justify(Gtk.Justification.CENTER)
        title.set_halign(Gtk.Align.CENTER)
        self.pack_start(title, False, False, 0)

        # Descripción
        desc = Gtk.Label(label="Gestiona el directorio de trabajo y otras opciones de la aplicación.")
        desc.set_justify(Gtk.Justification.CENTER)
        desc.set_halign(Gtk.Align.CENTER)
        desc.set_margin_bottom(24)
        self.pack_start(desc, False, False, 0)

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

        self.default_btn = Gtk.Button(label="Restaurar por defecto")
        self.default_btn.connect("clicked", self.on_restore_default)
        btn_box.pack_start(self.default_btn, False, False, 0)

        self.pack_start(btn_box, False, False, 0)

        self.status = Gtk.Label()
        self.pack_start(self.status, False, False, 0)

    def on_save(self, *_):
        path = self.entry.get_text()
        set_workdir(path)
        self._show_success("¡Directorio guardado!")

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

    def on_restore_default(self, *_):
        default_path = get_default_workdir()
        set_workdir(default_path)
        self.entry.set_text(default_path)
        self._show_success("¡Directorio restaurado al valor por defecto!")

    def _show_success(self, message):
        dialog = Gtk.MessageDialog(
            transient_for=self.get_toplevel(),
            flags=0,
            message_type=Gtk.MessageType.INFO,
            buttons=Gtk.ButtonsType.OK,
            text=message
        )
        dialog.run()
        dialog.destroy()
