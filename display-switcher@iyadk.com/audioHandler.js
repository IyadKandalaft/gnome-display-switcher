
const	St             = imports.gi.St,
		GObject = imports.gi.GObject,
		Clutter        = imports.gi.Clutter,
		ExtensionUtils = imports.misc.extensionUtils,
		Local          = ExtensionUtils.getCurrentExtension(),
		Utils          = Local.imports.utils;

/**
 * Class: AudioHandler
 *
 * This class should handle the selection of the right audio output depending on
 * which monitor is selected.
 */
const AudioHandler = GObject.registerClass({
	GTypeName: 'AudioHandler'
	},
	class AudioHandler extends GObject.Object {
	
	init(){
		log("THIS SHOULD NOT BE USED YET!");
	}
});