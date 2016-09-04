var rescuePlugin = {
	AnnouncerUrl: '',
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
		Platform: null
		Successful: null,
		System: null,
		Title: nul,
		CreatedAt: null,
		UpdatedAt: null,
		Rats: [],
		UnidentifiedRats: [],
		FirstLimpet: null
	},
	SetCommanderInfo: function() {
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
			data: {
				cmdrname: rescuePlugin.CommanderInfo.CMDRName,
				EO2: rescuePlugin.CommanderInfo.EO2,
				system: rescuePlugin.CommanderInfo.System,
				platform: rescuePlugin.CommanderInfo.Platform,
				extradata: rescuePlugin.CommanderInfo.ExtraData
			},
			success: function() { }
		});
	}
};
