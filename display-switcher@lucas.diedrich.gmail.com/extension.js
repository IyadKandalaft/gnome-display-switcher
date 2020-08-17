
const	St      = imports.gi.St,
		Gio     = imports.gi.Gio,
		Main  	= imports.ui.main,
		GObject = imports.gi.GObject,
		Meta  	= imports.gi.Meta,
		Shell   = imports.gi.Shell,
		Config  = imports.misc.config,
		ExtensionUtils = imports.misc.extensionUtils,
		Local          = ExtensionUtils.getCurrentExtension();

const	SUI            = Local.imports.switcherUI,
		Utils          = Local.imports.utils;

const	SHOW_ICON      = "show-running-icon",
		SHORTCUT       = "shortcut-switch",
		IS_WAYLAND     = Meta.is_wayland_compositor(),
		META_FLAGS     = Meta.KeyBindingFlags.NONE,
		SHELL_VERSION  = Config.PACKAGE_VERSION.split('.')[1],
		BINDING_FLAGS  = SHELL_VERSION <= 14 ? Shell.KeyBindingMode.NORMAL : Shell.ActionMode.NORMAL;

const MessageTray = imports.ui.messageTray;

let 	_extension;

const DisplayExtension = GObject.registerClass({
	GTypeName: 'DisplayExtension'
	},
	class DisplayExtension extends GObject.Object {

	/**
	 * _init:
	 *
	 * Initialize the new instance of DisplayExtension, load translations, theme, 
	 * settings, bind and then point to on keyPress SwitcherManager.
	 */
	_init() 
	{
		Utils._initTranslations();
		Utils._initTheme();
		this._settings = Utils._getSettings();
		this._switcherManager = new SUI.SwitcherManager();
		this._bind();
		this._checkIcon();
	}
	/**
	 * _show:
	 *
	 * Handles the onKeyPress of the binding shortcut, and when it happens call the SwitcherManager.
	 */		
	_show( display, window, binding ) 
	{
		log('Called DisplayExtension.show');
		this._switcherManager._show( binding.is_reversed(), 
										binding.get_name(), 
										binding.get_mask()); 
	}
	/**
	 * _bind/_unbind:
	 *
	 * This is the mojo, this bind/unbind the Super + P (or custom keybind),
	 * when pressed it will call the SwitcherManager class where the user 
	 * will be prompt to choose one of Display Mode.
	 */	
	_bind()
	{
		log('Called DisplayExtension.bind');
		this._settings.connect('changed::' + SHOW_ICON, this._checkIcon.bind(this));

		Main.layoutManager.connect('monitors-changed', this._switcherManager._refresh.bind(this));

		Main.wm.addKeybinding( SHORTCUT ,
			this._settings,
			META_FLAGS ,
			BINDING_FLAGS,
			this._show.bind(this));
	}
	_unbind()
	{
		log('Called DisplayExtension.unbind');
		Main.wm.removeKeybinding(SHORTCUT);
	}
	/**
	 * _loadicon/_unloadicon:
	 *
	 * Load/Unload an icon at the top bar, it just an "Running" icon.
	 */	
	_loadicon()
	{
		log('Called DisplayExtension.loadicon');
		if (typeof this._topIcon === 'undefined' || this._topIcon == null)
		{
        	let _appIcon = new St.Icon({ style_class: 'system-status-icon',
										 icon_name: 'ds-display-w'});

			this._topIcon = new St.Bin({ style_class: 'panel-button',
										reactive: true,
									    can_focus: true,
									    x_fill: true,
									    y_fill: true,
									    track_hover: true,
									    child: _appIcon });

			Main.panel._rightBox.insert_child_at_index(this._topIcon, 0);
		}
	}
	_unloadicon()
	{
		log('Called DisplayExtension.unloadicon');
		if ( typeof this._topIcon !== 'undefined' && this._topIcon != null )
		{
			Main.panel._rightBox.remove_child(this._topIcon);
			this._topIcon = null;
		}

	}
	_checkIcon()
	{
		log('Called DisplayExtension.checkIcon');
		this._show_running_icon = this._settings.get_boolean(SHOW_ICON);
		if ( this._show_running_icon )
			this._loadicon();
		else
			this._unloadicon();
	}
	/**
	 * _destroy:
	 *
	 * Un-Initialize everything, destroy the necessary references and principal unbind 
	 * the keybind shorcut.
	 */	
	_destroy()
	{
		log('Called DisplayExtension.destroy');
		this._unbind();
		this._unloadicon();
		this._switcherManager = null;
	}
});

/**
 *	Required methods for a gnome-shell extension.
 */
function init() 
{
	log(`initializing DisplaySwitcher`);
}

function enable() 
{
	log(`Enabling DisplaySwitcher`)
	if( !IS_WAYLAND )
		if( typeof _extension === 'undefined' || _extension == null )
			_extension = new DisplayExtension();
}

function disable()
{
	log(`Disabling DisplaySwitcher`);

	if( _extension )
	{
		_extension._destroy();
		_extension = null;
	}
}
