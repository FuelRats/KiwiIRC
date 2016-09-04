var rescuePlugin = {
	AnnouncerUrl: '',
	UseClientForm: true,
	CommanderInfo: {
		CMDRName: null,
		IRCNick: null,
		EO2: null,
		System: null,
		Platform: null,
		RescueId: null,
		ExtraData: null
	},
	RescueInfo: {
		Id: null,
		Active: null,
		Client: null,
		CodeRed: null,
		Epic: null,
		Open: null,
		Notes: null,
		Platform: null,
		Successful: null,
		System: null,
		Title: null,
		CreatedAt: null,
		UpdatedAt: null,
		Rats: [],
		UnidentifiedRats: [],
		FirstLimpet: null
	},
	SetCommanderInfo: function() {
        	function sanitizeCMDRName(cmdrName) {
                	cmdrName = cmdrName.replace(/^cmdr/i,'').trim();
	                return cmdrName;
        	}

	        function sanitizeIRCName(cmdrName) {
        	        cmdrName = cmdrName.trim().replace(/^cmdr/i,'').trim();
                	cmdrName = cmdrName.replace(/\s+/g,'_');
	                cmdrName = cmdrName.split(' ').join('_');
	                cmdrName = cmdrName.replace(/\./g, '');
	                cmdrName = removeDiacritics(cmdrName);
	                cmdrName = cmdrName.replace(/([^A-Za-z0-9\[\]{}\^´`_\\\|-]+)/g,'');
	                cmdrName = cmdrName.replace(/^\d+/,'');
	                return cmdrName;
	        }

		var cmdrName = document.getElementById('server_select_nick').value;
		rescuePlugin.CommanderInfo.CMDRName = sanitizeCMDRName(cmdrName);
		rescuePlugin.CommanderInfo.IRCNick = sanitizeIRCName(cmdrName);

		rescuePlugin.CommanderInfo.System = 'unknown';
		var sysItem = document.getElementById('system');
		if(sysItem != undefined && sysItem.value !== '') {
			rescuePlugin.CommanderInfo.System = sysItem.value.trim();
		}

		rescuePlugin.CommanderInfo.Platform = 'unknown';
		var platItem = document.getElementById('platform');
		if(platItem != undefined && platItem !== '') {
			rescuePlugin.CommanderInfo.Platform = platItem.value.trim();
		}

		rescuePlugin.CommanderInfo.EO2 = document.querySelector('#EO2').checked ? 'NOT OK' : 'OK';

		rescuePlugin.CommanderInfo.ExtraData = navigator.language ? 'Language: ' + getLanguageName(navigator.language) + ' (' + navigator.language + ')' : 'x';
	},
	SendAnnounceToIRC: function() {
		jQuery.ajax({
			url: rescuePlugin.AnnouncerUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'jsonp',
			data: {
				cmdrname: rescuePlugin.CommanderInfo.CMDRName,
				EO2: rescuePlugin.CommanderInfo.EO2,
				system: rescuePlugin.CommanderInfo.System,
				platform: rescuePlugin.CommanderInfo.Platform,
				extradata: rescuePlugin.CommanderInfo.ExtraData
			},
			success: function() { }
		});
	},
	BuildLoginForm: function() {
		if(rescuePlugin.UseClientForm) {
			var cmdrLabel = jQuery('label[for="server_select_nick"]');
			if(cmdrLabel.length == 0) { setTimeout(rescuePlugin.BuildLoginForm, 50); return; }
			cmdrLabel.text('CMDR Name');

			jQuery('.status').text('Please enter your details below...');

			var systemItem = jQuery('.system');
			if(systemItem.length == 0) {
				systemItem = jQuery('<tr class="system"><td><label for="server_select_system">System name</label></td><td><input type="text" id="system" /></td></tr>');
				cmdrLabel.parent().parent().after(systemItem);
			}

			var platformItem = jQuery('.platform');
			if(platformItem.length == 0) {
				platformItem = jQuery('<tr class="platform"><td><label for="server_select_platform">Platform</label></td><td><select name="platform" id="platform"><option value="PC">PC</option><option value="XB">XB</option></select></td></tr>');
				systemItem.after(platformItem);
			}

			var o2Item = jQuery('.o2');
			if(o2Item.length == 0) {
				o2Item = jQuery('<tr class="o2"><td><label for="server_select_o2">Are you on emergency O2?</label></td><td><label style="font-size: .9em;"><input type="checkbox" id="EO2" style="width: auto;" value="NOT OK" /> YES! I have a timer in upper right corner.</td></tr>');
				systemItem.after(o2Item);
			}
		} else {
		}
		jQuery('.have_pass').hide();
		jQuery('.channel').hide();
	}
};

jQuery(document).ready(function() {
	rescuePlugin.BuildLoginForm();
	jQuery('#kiwi .server_select button:contains("Start")').on('click', rescuePlugin.SetCommanderInfo);
	var network = kiwi.components.Network();
	network.on('connect', rescuePlugin.SendAnnounceToIRC);
});
