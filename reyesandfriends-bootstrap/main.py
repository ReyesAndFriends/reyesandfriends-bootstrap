import gi
gi.require_version('Gtk', '3.0')
gi.require_version('Gdk', '3.0')
from gi.repository import Gtk, Gdk

from views import MainWindow


def main():
    """Inicializar y ejecutar la aplicación"""
    window = MainWindow()

    display = Gdk.Display.get_default()
    monitor = display.get_primary_monitor()
    geometry = monitor.get_geometry()
    max_width = int(geometry.width * 0.8)
    max_height = int(geometry.height * 0.8)
    window.set_default_size(max_width, max_height)
    window.set_size_request(600, 400)  

    window.connect("destroy", Gtk.main_quit)
    window.show_all()
    Gtk.main()


if __name__ == "__main__":
    main()
