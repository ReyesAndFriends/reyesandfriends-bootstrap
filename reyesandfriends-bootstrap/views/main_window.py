import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
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

        self._create_headerbar()
        self._create_layout()

    # ---------------- HEADERBAR ----------------

    def _create_headerbar(self):
        header = Gtk.HeaderBar()
        header.set_show_close_button(True)
        header.set_title("Reyes&Friends Bootstrap")
        self.set_titlebar(header)

    # ---------------- LAYOUT ----------------

    def _create_layout(self):
        root = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL)
        self.add(root)

        # -------- Sidebar --------
        sidebar_container = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        sidebar_container.set_size_request(220, -1)

        self.stack = Gtk.Stack(
            transition_type=Gtk.StackTransitionType.SLIDE_LEFT_RIGHT,
            transition_duration=250
        )

        # Sidebar usando ListBox
        self.sidebar_list = Gtk.ListBox()
        self.sidebar_list.set_selection_mode(Gtk.SelectionMode.SINGLE)
        self.sidebar_list.set_activate_on_single_click(True)
        self.sidebar_list.set_hexpand(False)
        self.sidebar_list.set_vexpand(True)
        self.sidebar_list.set_border_width(8)

        self.sidebar_items = [
            ("Inicio", "home"),
            ("Gestión de Contraseñas", "passwords"),
            ("Servidores HTTP", "http"),
            ("Scripts SQL", "sql"),
            ("Acerca de", "about"),
        ]
        for idx, (label, view_name) in enumerate(self.sidebar_items):
            row = Gtk.ListBoxRow()
            row.set_margin_top(3)
            row.set_margin_bottom(3)
            box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
            box.set_margin_start(24)
            box.set_halign(Gtk.Align.START) 
            icon = Gtk.Image.new_from_icon_name(self._get_icon_name(view_name), Gtk.IconSize.MENU)
            label_widget = Gtk.Label(label=label, xalign=0)
            label_widget.set_margin_top(6)
            label_widget.set_margin_bottom(6)
            box.pack_start(icon, False, False, 0)
            box.pack_start(label_widget, True, True, 0)
            row.add(box)
            row.view_name = view_name
            self.sidebar_list.add(row)
        self.sidebar_list.connect("row-selected", self._on_sidebar_row_selected)
        sidebar_container.pack_start(self.sidebar_list, True, True, 0)

        separator = Gtk.Separator(orientation=Gtk.Orientation.VERTICAL)

        # -------- Stack Views --------
        self._create_views()

        root.pack_start(sidebar_container, False, False, 0)
        root.pack_start(separator, False, False, 0)
        root.pack_start(self.stack, True, True, 0)

        self.stack.set_visible_child_name("home")
        self.sidebar_list.select_row(self.sidebar_list.get_row_at_index(0))

    # ---------------- VIEWS ----------------

    def _create_views(self):
        self.home_view = HomeView(on_navigate=self._navigate_to)
        self.passwords_view = PasswordsView()
        self.http_servers_view = HttpServersView()
        self.sql_scripts_view = SqlScriptsView()
        self.stack.add_titled(self.home_view, "home", "Inicio")
        self.stack.add_titled(self.passwords_view, "passwords", "Gestión de Contraseñas")
        self.stack.add_titled(self.http_servers_view, "http", "Servidores HTTP")
        self.stack.add_titled(self.sql_scripts_view, "sql", "Scripts SQL")
        about = AboutView()
        self.stack.add_titled(about, "about", "Acerca de")

    # ---------------- HELPERS ----------------

    def _navigate_to(self, view_name):
        self.stack.set_visible_child_name(view_name)
        # Selecciona el row correspondiente en el sidebar
        for idx, (_, name) in enumerate(self.sidebar_items):
            if name == view_name:
                self.sidebar_list.select_row(self.sidebar_list.get_row_at_index(idx))
                break

    def on_exit_clicked(self, *_):
        Gtk.main_quit()

    def _on_sidebar_row_selected(self, listbox, row):
        if row:
            self.stack.set_visible_child_name(row.view_name)

    def _get_icon_name(self, view_name):

        icons = {
            "home": "go-home-symbolic",
            "passwords": "dialog-password-symbolic",
            "http": "network-server-symbolic",
            "sql": "accessories-text-editor-symbolic",
            "about": "help-about-symbolic",
        }

        return icons.get(view_name, "applications-system-symbolic")
