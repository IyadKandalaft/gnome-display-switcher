const Gio = imports.gi.Gio;

const Local = imports.misc.extensionUtils.getCurrentExtension();


var ds_display_b    = Gio.icon_new_for_string(Local.path + '/icons/ds-display-b.svg');
var ds_display_w    = Gio.icon_new_for_string(Local.path + '/icons/ds-display-w.svg');
var ds_extended     = Gio.icon_new_for_string(Local.path + '/icons/ds-extended.svg');
var ds_extended_b   = Gio.icon_new_for_string(Local.path + '/icons/ds-extended-b.svg');
var ds_extended_l   = Gio.icon_new_for_string(Local.path + '/icons/ds-extended-l.svg');
var ds_extended_r   = Gio.icon_new_for_string(Local.path + '/icons/ds-extended-r.svg');
var ds_extended_t   = Gio.icon_new_for_string(Local.path + '/icons/ds-extended-t.svg');
var ds_mirrored     = Gio.icon_new_for_string(Local.path + '/icons/ds-mirrored.svg');
var ds_primary      = Gio.icon_new_for_string(Local.path + '/icons/ds-primary.svg');
var ds_secondary    = Gio.icon_new_for_string(Local.path + '/icons/ds-secondary.svg');

