
const	St             = imports.gi.St,
		GObject	= imports.gi.GObject,
		Gio		= imports.gi.Gio,
		Clutter        = imports.gi.Clutter,
		SwitcherPopup  = imports.ui.switcherPopup,
		ExtensionUtils = imports.misc.extensionUtils;

const	Local          	= ExtensionUtils.getCurrentExtension(),
		Display			= Local.imports.displayHandler,
		Utils			= Local.imports.utils;

let _displayHandler;


/**
 * Class: SwitcherManager
 *
 * This class handle the bridge between bind pressed and the Switcher Popup.
 */
var SwitcherManager = GObject.registerClass({
	GTypeName: 'SwitcherManager'
	},
	class SwitcherManager extends GObject.Object {

	/**
	 * _init:
	 *
	 * Instantiate one new and unique @DisplayHandler, which has all display modes and run cmds.
	 */
	_init()
	{
		log('Initializing SwitcherManager');
		if( typeof _displayHandler === 'undefined' ||  
				_displayHandler == null )
			_displayHandler = new Display.DisplayHandler();
	}
	/**
	 * _show:
	 * @backward: Passed from keybind and used by SwitcherPopup. (obrigatory)
	 * @binding: Passed from keybind and used by SwitcherPopup. (obrigatory)
	 * @mask: Passed from keybind and used by SwitcherPopup. (obrigatory)	 
	 * 
	 * Select the active mode loaded and pass to show the SwitcherPopup.
	 *
	 */	
	_show(backward, binding, mask)
	{
		log('Called SwitcherManager.show');

		//log(`this._popup is ${this._popup}`);
		
		// Create a new SwitcherPopup modal dialog and display to display layout options
		this._popup = new ModesPopup(_displayHandler._modes);
		this._popup.show(backward, binding, mask);
		this._popup._select(_displayHandler._getIndex());

		log('Calling popup.connect');
		//this._popup.connect('notify::destroy', () => { this._popup = null; });
	}

	_refresh()
	{
		log("Not implemented yet!");
	}
});

const ModesPopup = GObject.registerClass({
	GTypeName: 'ModesPopup'
	},
	class SwitcherManager extends SwitcherPopup.SwitcherPopup{

	_init(items)
	{
		log('Initializing ModesPopup');
		super._init(items);
		this._switcherList = new ModesList(this._items);
	}
	_keyPressHandler(keysym, action) 
	{
		log(`Calling ModePopup.keyPressHandler with keysym ${keysym} and action ${action}`);

		if ( (keysym == Clutter.KEY_Left ||
				keysym == Clutter.KEY_ISO_Left_Tab) && this._selectedIndex > 0 )
			this._select(this._previous());
		else 
			if ( (keysym == Clutter.KEY_Right || 
					keysym == Clutter.KEY_Tab) && this._selectedIndex < 3 )
				this._select(this._next());
			else
				return Clutter.EVENT_PROPAGATE;

		return Clutter.EVENT_STOP;
	}
	_keyReleaseEvent(actor, event)
	{
		let [x, y, mods] = global.get_pointer(),
			state 		 = mods & this._modifierMask,
			event_key	 = event.get_key_symbol();

		// Verifies if it is Extended Mode and Up or Down Keys where pressed
		let pre_index = this._selectedIndex;
		if ( this._selectedIndex == 2 )
		{
		 	if (event_key == Clutter.KEY_Up)
		 		this._selectedIndex += 2;
		 	else 
		 		if (event_key == Clutter.KEY_Down)
		 			this._selectedIndex += 3;
		}

		if ((event_key == Clutter.KEY_Return && state == 0) ||
				(pre_index == 2 && (event_key == Clutter.KEY_Up || event_key == Clutter.KEY_Down)))
			this._finish(event.get_time());
		
		return Clutter.EVENT_STOP;
	}
	_finish(time) 
	{
		super._finish(time);
		_displayHandler._setMode(this._items[this._selectedIndex]);
	}
});

var ModesList = GObject.registerClass({
	GTypeName: 'ModesList'
	},
	class DisplayExtension extends SwitcherPopup.SwitcherList {

	_init(modes) 
	{
		log('Initializing ModesList');
		super._init(true);
		this._settings = Utils._getSettings();

		for (let mode of modes){
			if (mode._visible)
				this._addIcon(mode);
		}

	}
	_addIcon(mode) 
	{
		let	POPUP_ICON_SIZE = this._settings.get_int('mode-icon-size');

		let box   = new St.BoxLayout({ style_class: 'display-switcher-box', 
										vertical: true }),
			icon  = new St.Icon({ style_class: 'display-switcher-mode', 
									gicon: mode._icon,
									icon_size: POPUP_ICON_SIZE }),
			text  = new St.Label({ text: mode._name });

		box.add(icon);
		box.add(text);

		this.addItem(box, text);
	}
});
