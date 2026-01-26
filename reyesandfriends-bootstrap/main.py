import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

from views import MainWindow
from config import ensure_db

def main():
    ensure_db()
    window = MainWindow()
    window.connect("destroy", Gtk.main_quit)
    window.show_all()
    Gtk.main()

if __name__ == "__main__":
    main()
