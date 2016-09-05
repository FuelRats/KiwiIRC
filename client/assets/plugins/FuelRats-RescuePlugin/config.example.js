var rescuePlugin = {
	AnnouncerUrl: '',
	ApiUrl: '',
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
		Open: null,
		Notes: null,
		Platform: null,
		Successful: null,
		Epic: null,
		System: null,
		Title: null,
		CreatedAt: null,
		UpdatedAt: null,
		Rats: {},
		UnidentifiedRats: {},
		FirstLimpet: null
	},
	SetCommanderInfo: function() {
        	function sanitizeCMDRName(cmdrName) {
                	cmdrName = cmdrName.replace(/^cmdr/i,'').trim();
			cmdrName = transliterate(cmdrName);
	                return cmdrName;
        	}

	        function sanitizeIRCName(cmdrName) {
        	        cmdrName = cmdrName.trim().replace(/^cmdr/i,'').trim();
                	cmdrName = cmdrName.replace(/\s+/g,'_');
	                cmdrName = cmdrName.split(' ').join('_');
	                cmdrName = cmdrName.replace(/\./g, '');
			cmdrName = transliterate(cmdrName);
	                cmdrName = removeDiacritics(cmdrName);
	                cmdrName = cmdrName.replace(/([^A-Za-z0-9\[\]{}\^´`_\\\|-]+)/g,'');
	                cmdrName = cmdrName.replace(/^\d+/,'');
	                return cmdrName;
	        }

		var cmdrName = document.getElementById('server_select_nick').value;
		rescuePlugin.CommanderInfo.CMDRName = sanitizeCMDRName(cmdrName);
		rescuePlugin.CommanderInfo.IRCNick = sanitizeIRCName(cmdrName);

		document.getElementById('server_select_nick').value = rescuePlugin.CommanderInfo.IRCNick;

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
		if(rescuePlugin.CommanderInfo.CMDRName !== null) {
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
				success: function() { 
				}
			});
			setTimeout(rescuePlugin.GetInitialRescueInformation, 1000);
		}
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

			var contentHolder = jQuery('.side_panel .content');
			jQuery('.server_select.initial').css({ 'margin-top': '155px', 'width': '620px' }); 
			var topPanel = jQuery('<div style="height: 150px; background-color: rgba(0,0,0,0.9); position: fixed; top: 0; left: 0; right: 0;"><img src="/kiwi/assets/plugins/FuelRats-RescuePlugin/fuelrats.png" alt="Fuel Rats" title="Fuel Rats" style="width: 138px; margin-left: 5px; margin-top: 5px;" /></div>');
			
			contentHolder.empty();
			contentHolder.append(topPanel);			
			
			var infoText = jQuery('<div style="margin: 1em 20px; margin-top: 70px;"><p style="font-style:italic;">Thank you for providing your information! We\'re ready to assist you on our IRC server, which you will reach by clicking the <strong>Start</strong> button to the left<br /><br />Please leave your <strong>commander name</strong> intact so we know who you are</p></div>');
			contentHolder.append(infoText);
		} else {
			var cmdrLabel = jQuery('label[for="server_select_nick"]');
			if(cmdrLabel.length == 0) { setTimeout(rescuePlugin.BuildLoginForm, 50); return; }
			cmdrLabel.text('CMDR Name');

			jQuery('.status').text('Please enter your details below...');

			var contentHolder = jQuery('.side_panel .content');
			jQuery('.server_select.initial').css({ 'margin-top': '155px', 'width': '620px' }); 
			var topPanel = jQuery('<div style="height: 150px; background-color: rgba(0,0,0,0.9); position: fixed; top: 0; left: 0; right: 0;"><img src="/kiwi/assets/plugins/FuelRats-RescuePlugin/fuelrats.png" alt="Fuel Rats" title="Fuel Rats" style="width: 138px; margin-left: 5px; margin-top: 5px;" /></div>');
			
			contentHolder.empty();
			contentHolder.append(topPanel);			

			var infoText = jQuery('<div style="margin: 1em 20px; margin-top: 70px;"><p style="font-style:italic;">Thank you for providing your information! We\'re ready to make you assist our clients on our IRC server, which you will reach by clicking the <strong>Start</strong> button to the left<br /><br />Please leave your <strong>commander name</strong> intact so we know who you are</p></div>');
			contentHolder.append(infoText);
		}
		jQuery('.have_pass').hide();
		jQuery('.channel').hide();
		jQuery('.show_more').hide();
		jQuery('.more').hide();
		jQuery('#kiwi .server_select button').on('click', rescuePlugin.SetCommanderInfo);
	},
	GetInitialRescueInformation: function() {
		$.ajax({
			url: rescuePlugin.ApiUrl + '/rescues?client=' + encodeURIComponent(rescuePlugin.CommanderInfo.CMDRName),
			type: 'GET',
			success: function(data) {
				if(data.data.length > 0) {
					var rescue = data.data[0];
					rescuePlugin.CommanderInfo.RescueId = rescue.id;

					rescuePlugin.RescueInfo.Id = rescue.id;
					rescuePlugin.RescueInfo.Active = rescue.active;
					rescuePlugin.RescueInfo.Client = rescue.client;
					rescuePlugin.RescueInfo.CodeRed = rescue.codeRed;
					rescuePlugin.RescueInfo.CreatedAt = rescue.createdAt;
					rescuePlugin.RescueInfo.System = rescue.system;
					rescuePlugin.RescueInfo.Platform = rescue.platform;
					rescuePlugin.RescueInfo.UpdatedAt = rescue.updatedAt;
					rescuePlugin.RescueInfo.Title = rescue.title;
				} else {
					setTimeout(rescuePlugin.SendAnnounceToIRC, 5000);
				}
				setTimeout(rescuePlugin.UpdateRescueInfo, 5000);
			},
			error: function() { setTimeout(rescuePlugin.GetInitialRescueInformation, 3000); }
		});
	},
	UpdateRescueInfo: function() {
		$.ajax({
			url: rescuePlugin.ApiUrl + '/rescues/' + rescuePlugin.RescueInfo.Id,
			type: 'GET',
			success: function(data) {
				var rescue = data.data;
				rescuePlugin.RescueInfo.Active = rescue.active;
				rescuePlugin.RescueInfo.CodeRed = rescue.codeRed;
				rescuePlugin.RescueInfo.System = rescue.system;
				rescuePlugin.RescueInfo.Platform = rescue.platform;
				rescuePlugin.RescueInfo.Open = rescue.open;
				rescuePlugin.RescueInfo.UpdatedAt = rescue.updatedAt;
				rescuePlugin.RescueInfo.Epic = rescue.epic;
				rescuePlugin.RescueInfo.Title = rescue.title;
				setTimeout(rescuePlugin.UpdateRescueInfo, 5000);
				var rats = rescue.rats.length;
				for(var i = 0; i < rats; i++) {
					rescuePlugin.RescueInfo.Rats[rescue.rats[i]] = rescuePlugin.FetchRatInfo(rescue.rats[i]);
				}
			},
			error: function() { setTimeout(rescuePlugin.UpdateRescueInfo, 10000); }
		});
	},
	FetchRatInfo: function(ratId) {
		if(rescuePlugin.CachedRats[ratId]) {
			return rescuePlugin.CachedRats[ratId];
		} else {
			$.ajax({
				url: rescuePlugin.ApiUrl + '/rats/' + ratId,
				type: 'GET',
				success: function(rat) {
					rescuePlugin.CachedRats[ratId] = rat.data.CMDRname;
				}
			});
		}
	},
	CachedRats: {}
};

jQuery(document).ready(function() {
	rescuePlugin.BuildLoginForm();
	if(rescuePlugin.UseClientForm) {
		var network = kiwi.components.Network();
		network.on('connect', rescuePlugin.SendAnnounceToIRC);
	}
});
