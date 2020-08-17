

const ExtensionUtils = imports.misc.extensionUtils,
	  Main  	= imports.ui.main,
	  GObject = imports.gi.GObject,
	  Local		= ExtensionUtils.getCurrentExtension();

const MyIcons	= Local.imports.myicons,
	  Utils		= Local.imports.utils,
 	  _ 		= Utils._getText();

const XRANDR 			= Utils._getXRandr(),
	  PRIM_AUTO			= "	--output #PRIMARY --auto",
	  SECO_AUTO			= " --output #SECONDARY --auto",
	  CMD_GET_CURRENT 	= XRANDR + ' --current',
	  CMD_PRIMARY 		= XRANDR + PRIM_AUTO + ' --output #SECONDARY --off',
	  CMD_SECONDARY 	= XRANDR + SECO_AUTO + ' --output #PRIMARY --off',
	  CMD_MIRROR 		= XRANDR + PRIM_AUTO + SECO_AUTO + ' --same-as #PRIMARY',
	  CMD_EXTEND_LEFT 	= XRANDR + PRIM_AUTO + SECO_AUTO + ' --left-of #PRIMARY',
	  CMD_EXTEND_RIGHT  = XRANDR + PRIM_AUTO + SECO_AUTO + ' --right-of #PRIMARY',
	  CMD_EXTEND_TOP 	= XRANDR + PRIM_AUTO + SECO_AUTO + ' --above #PRIMARY',
	  CMD_EXTEND_BOTTOM = XRANDR + PRIM_AUTO + SECO_AUTO + ' --below #PRIMARY';

const EXP_EDP  	 = "eDP",
	  EXP_VIRT 	 = "VIRTUAL",
	  EXP_DISC 	 = "disconnected",
	  EXP_PRIM 	 = "primary",
	  EXP_MIRROR = "+0+0";

var Mode = GObject.registerClass({
	GTypeName: 'Mode'
	},
	class Mode extends GObject.Object {
    _init(index, name, cmd, iconName, isVisible = true) 
    {
    	this._index		 = index;
    	this._name 		 = name;
    	this._cmd 		 = cmd;
    	this._icon 		 = iconName;
        this._visible	 = isVisible;    	
    }
});

var Display = GObject.registerClass({
	GTypeName: 'Display'
	},
	class Mode extends GObject.Object {	
    _init(name, resolution, connected, marked_primary) 
    {
		log('Initializing Display');
    	this._name 		 = name;
    	this._resolution = resolution;
    	this._connected  = connected;
    	this._marked 	 = marked_primary;
    }
    _isConnected()
    {
    	return (this._connected.indexOf(EXP_DISC) < 0);
    }
});	

var DisplayHandler = GObject.registerClass({
	GTypeName: 'DisplayHandler'
	},
	class DisplayHandler extends GObject.Object {
    _init() 
    {
		log('Initializing DisplayHandler');
    	this._modes 	 = [];
    	this._primary 	 = null;
    	this._secondary  = null;
        this._settings	 = Utils._getSettings();
		this._provModes();
		log(`Modes contains ${this._modes}`)
    }
    _provModes()
    {
		log('Called DisplayHandler.provModes');

 		this.MODE_PRIMARY 	= new Mode(0,_("Primary only"),CMD_PRIMARY,MyIcons.ds_primary);
	  	this.MODE_MIRROR 	= new Mode(1,_("Mirrored"),CMD_MIRROR,MyIcons.ds_mirrored);
	  	this.MODE_EXTEND_L 	= new Mode(2,_("Extended"),CMD_EXTEND_LEFT,MyIcons.ds_extended);
	  	this.MODE_EXTEND_R 	= new Mode(2,_("Extended"),CMD_EXTEND_RIGHT,MyIcons.ds_extended_r);
	  	this.MODE_EXTEND_T 	= new Mode(4,_("Extended"),CMD_EXTEND_TOP,MyIcons.ds_extended_t,false);
	  	this.MODE_EXTEND_B 	= new Mode(5,_("Extended"),CMD_EXTEND_BOTTOM,MyIcons.ds_extended_b,false);
	  	this.MODE_SECONDARY = new Mode(3,_("Secondary only"),CMD_SECONDARY,MyIcons.ds_secondary);

    	this._modes.push(this.MODE_PRIMARY);
    	this._modes.push(this.MODE_MIRROR);
    	this._modes.push(this.MODE_EXTEND_L);
    	this._modes.push(this.MODE_SECONDARY);
    	this._modes.push(this.MODE_EXTEND_T);
    	this._modes.push(this.MODE_EXTEND_B);
    }
	_getMode() 
	{
		log('Called DisplayHandler.getMode');
		this._reload();

		if ( this._primary == null ||
				!this._primary._resolution )
			this._mode = this.MODE_SECONDARY;
		else
		{
			if ( this._secondary == null || 
					!this._secondary._resolution )
				this._mode = this.MODE_PRIMARY;
			else
			{
				if ( this._primary._resolution.indexOf(EXP_MIRROR) > -1 && 
						this._secondary._resolution.indexOf(EXP_MIRROR) > -1 )
					this._mode = this.MODE_MIRROR;
				else
				{
					if ( this._primary._resolution.indexOf(EXP_MIRROR) < 0 )
						this._mode = this.MODE_EXTEND_L;
					else
						this._mode = this.MODE_EXTEND_R;
				}
			}
		}

		return this._mode;
	}
	_getIndex() 
	{
		log('Called DisplayHandler.getIndex');
		return this._getMode()._index;
	}
	_setMode(mode)
	{
		log('Called DisplayHandler.setMode');
		if( typeof mode !== 'undefined' && mode != null )
		{
			if ( mode === this._mode && 
					mode === this.MODE_EXTEND_L )
				mode = this.MODE_EXTEND_R;

			let cmd = mode._cmd;
			
			if ( this._primary != null)
				cmd = cmd.replace(/\#PRIMARY/g, this._primary._name);
			if ( this._secondary != null ) 
				cmd = cmd.replace(/\#SECONDARY/g, this._secondary._name);

			let result 	= Utils._run(cmd);

			if ( result.success )
				this._mode = mode;
		} else
			throw new Error(_("Invalid type of mode"));
	}
	_parse(callback)
	{
		log('Called DisplayHandler.parse');
		let lines 	 = callback.split("\n"),
			displays = [];
		
		//Skip first line, we dont want to see the Screen line.
		for (let i = 1; i < lines.length -1; i++)
		{
			//Ignore display resolution lines
			if ( lines[i].match("^[A-Za-z]") )  
			{
				let ival = lines[i].split(" ");

				let name 			= ival[0],
					connected 		= ival[1],
					marked_primary  = ival[2].indexOf(EXP_PRIM) > -1 ? true : false,
					resolution 		= ival[2].indexOf("(") > -1 ? 
								 		null : ival[2].indexOf(EXP_PRIM) > -1 ? 
								 		(ival[3].indexOf("(") > -1 ? null : ival[3]) : ival[2];
					
				displays.push(new Display(name, resolution, connected, marked_primary));
			}
		}

		return displays;
	}

	_reload()
	{
		log('Called DisplayHandler.reload');
		let result = Utils._run(CMD_GET_CURRENT);
		
		if( result.success ) 
		{
			let displays = this._parse(result.callback);

			for ( let display of displays )
			{		
				if ( display._isConnected() ) 
				{
					//Verify if the name start with eDP, so it's a laptop.
					if ( display._name.indexOf(EXP_EDP) > -1 )
					{
						this._primary = display;
						this._settings.set_boolean('laptop-mode', true);
			 		} 
			 		else
						display._marked && ! this._settings.get_boolean('laptop-mode') ? 
							this._primary = display : 
								this._secondary = display;
				}
			}
		}
		else 
			throw new Error(_("Sorry, for some reason we could not execute the following command: ") + CMD_GET_CURRENT);
	}
});
