
const 	Main  	= imports.ui.main,
		Lang  	= imports.lang,
		Meta  	= imports.gi.Meta,
		Shell   = imports.gi.Shell,
		Config  = imports.misc.config,
		ExtensionUtils = imports.misc.extensionUtils,
		Local          = ExtensionUtils.getCurrentExtension(),
		SUI            = Local.imports.switcherUI, 
		Utils          = Local.imports.utils;

const	SHOW_ICON      = "show-running-icon",
		SHORTCUT       = "shortcut-switch",
		IS_WAYLAND     = Meta.is_wayland_compositor(),
		META_FLAGS     = Meta.KeyBindingFlags.NONE,
		SHELL_VERSION  = Config.PACKAGE_VERSION.split('.')[1],
		BINDING_FLAGS  = SHELL_VERSION <= 14 ? Shell.KeyBindingMode.NORMAL : Shell.ActionMode.NORMAL;

let 	_extension;

const DisplayExtension = new Lang.Class({
	Name: 'DisplayExtension',

	/**
	 * _init:
	 *
	 * Initialize the new instance of DisplayExtension, load translations, theme, 
	 * settings, bind and then point to on keyPress SwitcherManager.
	 */
	_init: function() 
	{
		Utils._initTranslations();
		Utils._initTheme();

		this._settings = Utils._getSettings();
		this._show_running_icon = this._settings.get_boolean(SHOW_ICON);
		this._switcherManager = new SUI.SwitcherManager();
		this._bind();

		if ( this._show_running_icon ) 
			this._loadicon();
	},
	/**
	 * _show:
	 *
	 * Handles the onKeyPress of the binding shortcut, and when it happens call the SwitcherManager.
	 */		
	_show: function( display, screen, window, binding ) 
	{
		this._switcherManager._show( binding.is_reversed(), 
										binding.get_name(), 
										binding.get_mask()); 
	},
	/**
	 * _bind/_unbind:
	 *
	 * This is the mojo, this bind/unbind the Super + P (or custom keybind),
	 * when pressed it will call the SwitcherManager class where the user 
	 * will be prompt to choose one of Display Mode.
	 */	
	_bind: function()
	{
		Main.wm.addKeybinding( SHORTCUT ,
			this._settings,
			META_FLAGS ,
			BINDING_FLAGS,
			Lang.bind(this, this._show));
	},
	_unbind: function()
	{
		Main.wm.removeKeybinding(SHORTCUT);
	},
	/**
	 * _loadicon/_unloadicon:
	 *
	 * Load/Unload an icon at the top bar, it just an "Running" icon.
	 */	
	_loadicon: function()
	{
		this._topIcon = this._switcherManager._getIcon();
		Main.panel._rightBox.insert_child_at_index(this._topIcon, 0);    
	},
	_unloadicon: function()
	{
		if ( typeof this._topIcon !== 'undefined' && this._topIcon != null )
			this._topIcon = null;
	},
	/**
	 * _destroy:
	 *
	 * Un-Initialize everything, destroy the necessary references and principal unbind 
	 * the keybind shorcut.
	 */	
	_destroy: function()
	{
		this._unbind();
		this._unloadicon();
		this._switcherManager = null;
	}
});

/**
 *	Required methods for a gnome-shell extension.
 */
function init() {}

function enable()
{
	if( !IS_WAYLAND )
		if( typeof _extension === 'undefined' || _extension == null )
			_extension = new DisplayExtension();
}

function disable()
{
	if( _extension )
	{
		_extension._destroy();
		_extension = null;
	}
}