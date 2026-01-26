import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk

from .passwords_view import PasswordsView
from .http_servers_view import HttpServersView
from .sql_scripts_view import SqlScriptsView
from .home_view import HomeView
from .about_view import AboutView 


class MainWindow(Gtk.Window):
    def __init__(self):
        super().__init__(title="Inicio - Reyes&Friends Bootstrap")
        self.set_default_size(900, 600)
        self.set_position(Gtk.WindowPosition.CENTER)

        self._load_css()
        self._create_headerbar()
        self._create_layout()

    # ---------------- HEADERBAR ----------------

    def _create_headerbar(self):
        header = Gtk.HeaderBar()
        header.set_show_close_button(True)
        header.set_title("Reyes&Friends Bootstrap")
        header.get_style_context().add_class("header")
        self.set_titlebar(header)

    # ---------------- LAYOUT ----------------

    def _create_layout(self):
        root = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL)
        self.add(root)

        # -------- Sidebar --------
        sidebar_container = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        sidebar_container.set_size_request(200, -1)
        sidebar_container.get_style_context().add_class("sidebar")

        self.stack = Gtk.Stack(
            transition_type=Gtk.StackTransitionType.SLIDE_LEFT_RIGHT,
            transition_duration=250
        )

        sidebar = Gtk.StackSidebar()
        sidebar.set_stack(self.stack)
        sidebar.set_vexpand(True)
        sidebar.get_style_context().add_class("sidebar-nav")

        sidebar_container.pack_start(sidebar, True, True, 0)

        separator = Gtk.Separator(orientation=Gtk.Orientation.VERTICAL)

        # -------- Stack Views --------
        self._create_views()

        root.pack_start(sidebar_container, False, False, 0)
        root.pack_start(separator, False, False, 0)
        root.pack_start(self.stack, True, True, 0)

        self.stack.set_visible_child_name("home")

    # ---------------- VIEWS ----------------

    def _create_views(self):
        self.home_view = HomeView(on_navigate=self._navigate_to)
        self.passwords_view = PasswordsView()
        self.http_servers_view = HttpServersView()
        self.sql_scripts_view = SqlScriptsView()

        self.stack.add_titled(self.home_view, "home", "Inicio")
        self.stack.add_titled(self.passwords_view, "passwords", "Contraseñas")
        self.stack.add_titled(self.http_servers_view, "http", "HTTP Servers")
        self.stack.add_titled(self.sql_scripts_view, "sql", "SQL Scripts")

        about = AboutView()  # <-- Usa la nueva vista
        self.stack.add_titled(about, "about", "Acerca de")

    # ---------------- HELPERS ----------------

    def _navigate_to(self, view_name):
        self.stack.set_visible_child_name(view_name)

    def on_exit_clicked(self, *_):
        Gtk.main_quit()

    def _load_css(self):
        css = b"""
        .sidebar {
            padding: 10px;
        }

        .sidebar-nav row {
            padding: 10px;
        }

        .sidebar-nav row:selected {
            color: white;
        }

        .header {
            background: #2a2a2a;
        }
        """

        provider = Gtk.CssProvider()
        provider.load_from_data(css)
        Gtk.StyleContext.add_provider_for_screen(
            Gdk.Screen.get_default(),
            provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )
