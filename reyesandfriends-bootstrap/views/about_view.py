import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk
import os
from gi.repository import GdkPixbuf
from datetime import datetime

class AboutView(Gtk.Box):
    def __init__(self):
        super().__init__(orientation=Gtk.Orientation.VERTICAL, spacing=16)
        self.set_border_width(24)

        # Título
        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>Acerca de</span>")
        title.set_justify(Gtk.Justification.CENTER)
        title.set_halign(Gtk.Align.CENTER)
        self.pack_start(title, False, False, 0)

        # Descripción
        desc = Gtk.Label(label="Información sobre Reyes&Friends Bootstrap.")
        desc.set_justify(Gtk.Justification.CENTER)
        desc.set_halign(Gtk.Align.CENTER)
        desc.set_margin_bottom(24)
        self.pack_start(desc, False, False, 0)

        # ===== Header =====
        header = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=16)
        header.set_margin_top(24) 

        icon_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "assets", "icons", "app_icon_multi.png"
        )
        display_size = 48
        scale_size = 96
        pixbuf = GdkPixbuf.Pixbuf.new_from_file(icon_path)
        pixbuf = pixbuf.scale_simple(scale_size, scale_size, GdkPixbuf.InterpType.BILINEAR)
        logo = Gtk.Image.new_from_pixbuf(pixbuf)

        logo_box = Gtk.EventBox()
        logo_box.set_size_request(display_size, display_size)
        logo_box.add(logo)
        logo_box.set_valign(Gtk.Align.CENTER)

        title_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=4)
        title_box.set_valign(Gtk.Align.CENTER)

        title = Gtk.Label()
        title.set_markup("<span size='xx-large' weight='bold'>Reyes&amp;Friends Bootstrap</span>")
        title.set_xalign(0)

        subtitle = Gtk.Label(label="Un gestor de utilidades para desarrolladores y administradores de sistemas para una puesta a producción rápida.")
        subtitle.set_xalign(0)
        subtitle.set_margin_top(4)
        subtitle.set_margin_bottom(4)

        title_box.pack_start(title, False, False, 0)
        title_box.pack_start(subtitle, False, False, 0)

        header.pack_start(logo_box, False, False, 0)
        header.pack_start(title_box, True, True, 0)

        self.pack_start(header, False, False, 0)

        # ===== Card principal =====
        card = Gtk.Frame()
        card.set_margin_top(24)
        card.set_shadow_type(Gtk.ShadowType.IN)
        card.set_halign(Gtk.Align.CENTER)
        card.set_valign(Gtk.Align.CENTER)
        card.set_size_request(520, -1)

        card_box = Gtk.Box(
            orientation=Gtk.Orientation.VERTICAL,
            spacing=12
        )
        card_box.set_margin_top(16)
        card_box.set_margin_bottom(16)
        card_box.set_margin_start(16)
        card_box.set_margin_end(16)

        # Monólogo
        monologue = self.create_monologue_widget()
        card_box.pack_start(monologue, False, False, 0)

        card_box.pack_start(Gtk.Separator(), False, False, 8)

        card_box.pack_start(self._info_row("Versión", "1.0.0"), False, False, 0)
        card_box.pack_start(self._info_row("Autor", "Reyes&Friends / AstronautMarkusDev"), False, False, 0)

        web = Gtk.LinkButton(
            uri="https://www.reyesandfriends.cl",
            label="www.reyesandfriends.cl"
        )
        web.set_halign(Gtk.Align.CENTER)
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

        current_year = datetime.now().year

        footer = Gtk.Label(label=f"© {current_year} Reyes&Friends")
        footer.set_halign(Gtk.Align.CENTER)
        footer.set_margin_top(20)
        self.pack_end(footer, False, False, 0)

    def create_monologue_widget(self):

        container = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        container.set_halign(Gtk.Align.CENTER)
        container.set_valign(Gtk.Align.CENTER)
        container.set_margin_top(8)
        container.set_margin_bottom(8)
        container.set_margin_start(0)
        container.set_margin_end(0)
        container.set_size_request(480, -1)

        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=0)
        box.set_margin_top(8)
        box.set_margin_bottom(8)
        box.set_margin_start(8)
        box.set_margin_end(8)

        label = Gtk.Label()
        label.set_markup(
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
        label.set_xalign(0.5)
        label.set_halign(Gtk.Align.CENTER)
        label.set_line_wrap(True)
        label.set_justify(Gtk.Justification.CENTER)
        label.set_margin_top(12)
        label.set_margin_bottom(12)
        label.set_margin_start(12)
        label.set_margin_end(12)
        box.pack_start(label, False, False, 0)

        container.pack_start(box, True, True, 0)
        return container

    def _info_row(self, key, value):
        box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)

        key_label = Gtk.Label(label=f"{key}:")
        key_label.set_xalign(0)
        key_label.set_margin_end(4)

        value_label = Gtk.Label(label=value)
        value_label.set_xalign(0)

        box.pack_start(key_label, False, False, 0)
        box.pack_start(value_label, True, True, 0)

        return box

    def _open_url(self, button, url):
        import webbrowser
        webbrowser.open(url)
