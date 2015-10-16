
const Main  = imports.ui.main,
      Lang  = imports.lang,
      Meta  = imports.gi.Meta,
      Shell   = imports.gi.Shell,
      Config  = imports.misc.config,
      ExtensionUtils = imports.misc.extensionUtils,
      Local          = ExtensionUtils.getCurrentExtension(),
      SUI            = Local.imports.switcherUI, 
      Utils          = Local.imports.utils;

const SHOW_ICON      = "show-running-icon",
      SHORTCUT       = "shortcut-switch",
      SCHEMA         = "org.gnome.shell.extensions.video-switcher",
      IS_WAYLAND     = Meta.is_wayland_compositor(),
      META_FLAGS     = Meta.KeyBindingFlags.NONE,
      SHELL_VERSION  = Config.PACKAGE_VERSION.split('.')[1],
      BINDING_FLAGS  = SHELL_VERSION <= 14 ? Shell.KeyBindingMode.NORMAL : Shell.ActionMode.NORMAL;

let _extension;

/**
  TODO: Add comments.
  journalctl /usr/bin/gnome-session -f -o cat - Just for debugging 
*/
const DisplayExtension = new Lang.Class({
  Name: 'DisplayExtension',

  _init: function() 
  {
    Utils._initTranslations();
    Utils._initTheme();

    this._settings = Utils._getSettings(SCHEMA);
    this._show_running_icon = this._settings.get_boolean(SHOW_ICON);
    this._switcherManager = new SUI.SwitcherManager();
    this._bind();

    if ( this._show_running_icon ) 
      this._loadIcon();

  },

  _show: function( display, screen, window, binding ) 
  {
    this._switcherManager.popup( binding.is_reversed(), 
                                 binding.get_name(), 
                                 binding.get_mask()); 
  },
  _bind: function() 
  {
    Main.wm.addKeybinding( SHORTCUT ,
                            this._settings,
                            META_FLAGS ,
                            BINDING_FLAGS,
                            Lang.bind(this, this._show));
  },
  _unBind: function() 
  {
    Main.wm.removeKeybinding(SHORTCUT );
  },  
  _loadIcon: function() 
  {
    this._topIcon = this._switcherManager.getIcon();
    Main.panel._rightBox.insert_child_at_index(this._topIcon, 0);    
  },
  _unLoadIcon: function()
  {
    if (this._topIcon != null && 
      typeof this._topIcon === 'undefined' )
      this._topIcon = null;
  },
  _destroy: function()
  {
    this._unBind();
    this._unLoadIcon();
    this._switcherManager = null;
  }
});

function init() 
{
}

function enable() 
{
  if( !IS_WAYLAND ) 
    if( typeof _extension === 'undefined' ) 
      _extension = new DisplayExtension();
}

function disable() 
{
  if(_extension)
  {
    _extension._destroy();
    _extension = null;
  }
}
