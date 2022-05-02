let servers;
let version;

function parseColorCodes(str) {
	let colors = {
		'0': '000000', '1': '0000AA', '2': '00AA00', '3': '00AAAA',
		'4': 'AA0000', '5': 'AA00AA', '6': 'FFAA00', '7': 'AAAAAA',
		'8': '555555', '9': '5555FF', 'a': '55FF55', 'b': '55FFFF',
		'c': 'FF5555', 'd': 'FF55FF', 'e': 'FFFF55', 'f': 'FFFFFF'
	}
	
	let regex = /&+[a-f]|&+[0-9]/i
	let hasPrevious = false;
	
	while (str.match(regex)) {
		let color = str[str.search(regex)+1];
		str = str.replace(regex, (hasPrevious ? '</span>' : '') + '<span style="color:#' + colors[color] + '">');
		hasPrevious = true;
	}
	if (hasPrevious) str += '</span>';
	return str;
}

function prepareHTML() {
	document.body.innerHTML = '';
}

function connectToServer(ip) {
	window.open(`steam://run/696370//-connect ${ip}/`);
}

async function getVersion() {
	let req = await fetch('https://api.allorigins.win/raw?url=https://brokeprotocol.com/version');
	return await req.json();
}

async function getServers() {
	let req = await fetch('https://api.allorigins.win/raw?url=https://brokeprotocol.com/servers.json');
	return await req.json();
}

async function updateServerList() {
	prepareHTML();
	servers = await getServers();
	version = await getVersion();
	
	let title = document.createElement('h1');
	title.innerHTML = `Broke Protocol Server List - Current Version: ${version}`;
	document.body.appendChild(title);
	let subtitle = document.createElement('h2');
	subtitle.innerHTML = servers.length + ' Servers online:';
	document.body.appendChild(subtitle);
	
	let button = document.createElement('button');
	button.innerHTML = 'Refresh';
	button.onclick = function() {
		updateServerList();
	}
	document.body.appendChild(button);
	
	servers.forEach(server => {
		let details = document.createElement('details');
		document.body.appendChild(details);
		let summary = document.createElement('summary');
		summary.innerHTML = server.Validation + ' ' + server.Location + ' - <b>' + parseColorCodes(server.Name) + '</b> (' + server.PlayerCount + '/' + server.PlayerLimit + ')';
		details.appendChild(summary);
		let content = document.createElement('div');
		content.className = 'content';
		details.appendChild(content);
		
		let connectButton = document.createElement('a');
		connectButton.className = 'button';
		connectButton.innerHTML = 'Connect (Steam only)';
		connectButton.onclick = function() {
			connectToServer(`{server.IP}:${server.Port}`);
		}
		
		let map = document.createElement('div');
		map.innerHTML = '<b>Map:</b> ' + server.Map.Name;
		map.title = `Filesize: ${server.Map.Filesize}\nHash: ${server.Map.Hash}`;
		content.appendChild(map);
		
		let versionText = document.createElement('div');
		versionText.innerHTML = '<b>Version:</b> ' + parseColorCodes(((parseFloat(server.Version) == version) ? '&2' : '&4') + server.Version);
		content.appendChild(versionText);
		
		let ip = document.createElement('div');
		ip.innerHTML = '<b>IP:</b> ' + server.IP + ':' + server.Port;
		content.appendChild(ip);
		
		let difficulty = document.createElement('div');
		difficulty.innerHTML = '<b>Difficulty:</b> ' + parseFloat(server.Difficulty)*100 + '%';
		content.appendChild(difficulty);
		
		let whitelist = document.createElement('div');
		whitelist.innerHTML = '<b>Whitelist:</b> ' + server.Whitelist;
		content.appendChild(whitelist);
		
		let url = document.createElement('div');
		url.innerHTML = '<b>URL:</b> ' + `<a href="${((server.URL && server.URL.startsWith('http')) ? server.URL : 'https://' + server.URL)}" target="_blank">${server.URL}</a>`;
		content.appendChild(url);
		
		let pluginsLabel = document.createElement('span');
		pluginsLabel.innerHTML = '<b>Plugins:</b>';
		content.appendChild(pluginsLabel)
		let plugins = document.createElement('ul');
		server.Plugins.forEach(plugin => {
			let name = document.createElement('li');
			name.innerHTML = plugin.Name;
			name.title = plugin.Description;
			plugins.appendChild(name);
		});
		content.appendChild(plugins);

		let assetsLabel = document.createElement('span');
		assetsLabel.innerHTML = '<b>Asset Bundles:</b>';
		content.appendChild(assetsLabel)	
		let assets = document.createElement('ul');
		server.AssetBundles.forEach(asset => {
			let name = document.createElement('li');
			name.innerHTML = asset.Name;
			name.title = `Filesize: ${asset.Filesize}\nHash: ${asset.Hash}`;
			assets.appendChild(name);
		});
		content.appendChild(assets);
	});
}
