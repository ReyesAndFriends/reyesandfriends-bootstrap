import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk
import os
from gi.repository import GdkPixbuf

class AboutView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        self.set_margin_top(32)
        self.set_margin_bottom(32)
        self.set_margin_start(32)
        self.set_margin_end(32)

        self._load_css()

        # ===== Header =====
        header = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=16)
        header.get_style_context().add_class("about-header")

        # Usar el logo de la app (settings.png) y escalarlo
        icon_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "assets", "icons", "settings.png"
        )
        pixbuf = GdkPixbuf.Pixbuf.new_from_file(icon_path)
        pixbuf = pixbuf.scale_simple(48, 48, GdkPixbuf.InterpType.BILINEAR)
        logo = Gtk.Image.new_from_pixbuf(pixbuf)

        title_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=4)

        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>Reyes&amp;Friends Bootstrap</span>")
        title.set_xalign(0)

        subtitle = Gtk.Label(label="Un gestor de utilidades para desarrolladores y administradores de sistemas para una puesta a producción rápida.")
        subtitle.set_xalign(0)
        subtitle.get_style_context().add_class("subtitle")

        title_box.pack_start(title, False, False, 0)
        title_box.pack_start(subtitle, False, False, 0)

        header.pack_start(logo, False, False, 0)
        header.pack_start(title_box, True, True, 0)

        self.pack_start(header, False, False, 0)

        # ===== Card principal =====
        card = Gtk.Frame()
        card.get_style_context().add_class("card")

        card_box = Gtk.Box(
            orientation=Gtk.Orientation.VERTICAL,
            spacing=12,
            margin=16
        )

        desc = Gtk.Label()
        desc.set_markup(
            "<span size='x-large' weight='bold'>Querido usuario final,</span>\n\n"
            "<i>"
            "En el mundo del desarrollo y la administración de sistemas, cada herramienta es una extensión de nuestra creatividad y pasión.\n"
            "<b>Reyes&amp;Friends Bootstrap</b> surge como un puente entre la idea y la acción, entre el deseo de automatizar y la necesidad de simplificar.\n"
            "No es solo un gestor de utilidades, sino el reflejo de incontables horas enfrentando desafíos, aprendiendo de errores y celebrando pequeños triunfos.\n\n"
            "Este proyecto es un homenaje a quienes creen que la tecnología puede ser cercana, útil y elegante.\n"
            "A quienes disfrutan compartir conocimiento y construir soluciones que faciliten la vida de otros.\n"
            "<span foreground='#1565c0'><b>Gracias por ser parte de esta comunidad</b></span>, por inspirar y por confiar en que juntos podemos hacer del mundo digital un lugar más amigable y eficiente."
            "</i>"
        )
        desc.set_xalign(0.5)
        desc.set_halign(Gtk.Align.CENTER)
        desc.set_line_wrap(True)
        desc.set_justify(Gtk.Justification.CENTER)
        desc.set_margin_top(12)
        desc.set_margin_bottom(12)
        desc.set_margin_start(24)
        desc.set_margin_end(24)
        desc.get_style_context().add_class("credit-card")

        card_box.pack_start(desc, False, False, 0)
        card_box.pack_start(Gtk.Separator(), False, False, 8)

        card_box.pack_start(self._info_row("Versión", "1.0.0"), False, False, 0)
        card_box.pack_start(self._info_row("Autor", "Reyes&Friends"), False, False, 0)

        web = Gtk.LinkButton(
            uri="https://www.reyesandfriends.cl",
            label="www.reyesandfriends.cl"
        )
        web.set_halign(Gtk.Align.CENTER)
        web.get_style_context().add_class("about-link")
        card_box.pack_start(web, False, False, 0)

        card.add(card_box)
        self.pack_start(card, False, False, 0)

        thanks_label = Gtk.Label()
        thanks_label.set_markup("<b>Agradecimientos especiales a:</b>")
        thanks_label.set_halign(Gtk.Align.CENTER)
        thanks_label.set_margin_top(24)
        self.pack_start(thanks_label, False, False, 0)

        # ===== Tech Stack =====
        tech_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=24)
        tech_box.set_halign(Gtk.Align.CENTER)
        tech_box.set_margin_top(16)
        tech_box.set_margin_bottom(8)

        techs = [
            {
                "img": os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "icons", "gtk.png"),
                "url": "https://www.gtk.org/",
                "tooltip": "GTK"
            },
            {
                "img": os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "icons", "python.png"),
                "url": "https://www.python.org/",
                "tooltip": "Python"
            },
            {
                "img": os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "icons", "tux.png"),
                "url": "https://www.kernel.org/",
                "tooltip": "Linux (Tux)"
            },
        ]

        for tech in techs:
            btn = Gtk.Button()
            btn.set_relief(Gtk.ReliefStyle.NONE)
            btn.set_tooltip_text(tech["tooltip"])
            img_pixbuf = GdkPixbuf.Pixbuf.new_from_file(tech["img"])

            height = 64
            width = int(img_pixbuf.get_width() * (height / img_pixbuf.get_height()))
            img_pixbuf = img_pixbuf.scale_simple(width, height, GdkPixbuf.InterpType.BILINEAR)
            img = Gtk.Image.new_from_pixbuf(img_pixbuf)
            btn.add(img)
            btn.connect("clicked", self._open_url, tech["url"])
            tech_box.pack_start(btn, False, False, 0)

        self.pack_start(tech_box, False, False, 0)

        footer = Gtk.Label(label="© 2026 Reyes&Friends")
        footer.get_style_context().add_class("footer")
        self.pack_end(footer, False, False, 0)

    def _info_row(self, key, value):
        box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)

        key_label = Gtk.Label(label=f"{key}:")
        key_label.set_xalign(0)
        key_label.get_style_context().add_class("key")

        value_label = Gtk.Label(label=value)
        value_label.set_xalign(0)

        box.pack_start(key_label, False, False, 0)
        box.pack_start(value_label, True, True, 0)

        return box

    def _load_css(self):
        css = b"""
        .about-header {
            padding-bottom: 12px;
        }

        .subtitle {
            color: #777;
        }

        .card {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #ddd;
        }

        .card * {
            color: #000;
        }

        .about-link {
            color: #1565c0;
            font-weight: bold;
        }
        .about-link:hover {
            text-decoration: underline;
        }

        .key {
            font-weight: bold;
        }

        .footer {
            color: #999;
            margin-top: 20px;
        }

        .credit-card {
            border-radius: 10px;
            padding: 18px;
            margin-left: 0px;
            margin-right: 0px;
        }
        """

        provider = Gtk.CssProvider()
        provider.load_from_data(css)
        Gtk.StyleContext.add_provider_for_screen(
            Gdk.Screen.get_default(),
            provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

    def _open_url(self, button, url):
        import webbrowser
        webbrowser.open(url)
