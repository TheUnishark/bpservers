class UI {
    static serverList = null;
    static prevTooltip = null;

    static createElement(tag, innerHTML, className, parent) {
        parent = parent || document.body;
    
        let e = document.createElement(tag);
    
        if (innerHTML) e.innerHTML = innerHTML;
        if (className) e.className = className;
        parent.appendChild(e);
        return e;
    }

    static createLabel(label, element, after = false) {
        let e = document.createElement('label');
        e.innerHTML = label;
        e.setAttribute('for', element.id);
        if (after) element.parentElement.insertBefore(e, element.nextSibling);
        else element.parentElement.insertBefore(e, element);
        return e;
    }

    static prepareHTML() {
        document.body.innerHTML = '<div id="tooltip">No Text</div>';
        UI.serverList = null;
    }

    static async openNews() {
        let modal = UI.createElement('div', '', 'modal');
    
        let background = UI.createElement('div', '', 'modal-background');
        background.onclick = function() {
            modal.remove();
            background.remove();
            document.body.style.overflow = 'auto';
        }
        document.body.style.overflow = 'hidden';
    
        UI.createElement('h2', 'News', '', modal);
    
        let formattedNotes = BPServers.updateNotes
            //.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
            .replace(/\n/g, '<br />')
            .replace(/<color=#([A-Fa-f0-9]{6})>(.*?)<\/color>/g, '<b style="color: #$1">$2</b>');
        UI.createElement('div', formattedNotes, 'modal-content', modal);
    
        let modalClose = UI.createElement('i', '', 'fa-sharp fa-solid fa-xmark close', modal);
        modalClose.onclick = function() {
            modal.remove();
            background.remove();
            document.body.style.overflow = 'auto';
        }
    }


    static buildUI() {
        let titleDiv = UI.createElement('div', '', 'title');
        let title = UI.createElement('h1', 'Broke Protocol Server List - Current Version: ', '', titleDiv);
        let news = UI.createElement('span', BPServers.version, 'news', title);
        news.title = 'Update Notes';
        news.onclick = function() {
            UI.openNews();
        }
        UI.createElement('h2', `<span id="players-count">${BPServers.playerCount}</span> Players on <span id="servers-count">${Servers.filteredServers.length}</span> servers:`, '');
        
        let button = UI.createElement('button', 'Refresh', '', titleDiv);
        button.onclick = function() {
            BPServers.reload();
        }

        let filters = UI.createElement('div', '', 'filters');
        let visibility = UI.createElement('div', '', 'visibility', filters);
        let sorting = UI.createElement('div', '', 'sorting', filters);

        let whitelistLabel = UI.createElement('label', 'Whitelist:', '', visibility);
        let whitelist = UI.createElement('select', '<option value="any">Any</option><option value="disabled">Disabled</option><option value="enabled">Enabled</option>', '', whitelistLabel);
        whitelist.id = 'whitelist';
        whitelist.onchange = function() {
            Sorting.filters.whitelist = whitelist.value;
            Sorting.sortServers();
            UI.fillServerList();
        }

        let validationLabel = UI.createElement('label', 'Validation:', '', visibility);
        let validation = UI.createElement('select', '<option value="any">Any</option><option value="valid">Valid</option><option value="Invalid">Invalid</option>', '', validationLabel);
        validation.id = 'validation';
        validation.onchange = function() {
            Sorting.filters.validation = validation.value;
            Sorting.sortServers();
            UI.fillServerList();
        }

        let updatedLabel =  UI.createElement('label', 'Version:', '', visibility);
        let updated = UI.createElement('select', '<option value="any">Any</option><option value="current">Current</option><option value="outdated">Outdated</option>', '', updatedLabel);
        updated.id = 'updated';
        updated.onchange = function() {
            Sorting.filters.updated = updated.value;
            Sorting.sortServers();
            UI.fillServerList();
        }

        let hideEmptyLabel =  UI.createElement('label', 'Hide Empty:', '', visibility);
        let hideEmpty = UI.createElement('input', '', '', hideEmptyLabel);
        hideEmpty.type = 'checkbox';
        hideEmpty.id = 'hideEmpty';
        hideEmpty.onchange = function() {
            Sorting.filters.hideEmpty = hideEmpty.checked;
            Sorting.sortServers();
            UI.fillServerList();
        }
        UI.createElement('span', '', 'checkmark', hideEmptyLabel);

        let hideFullLabel =  UI.createElement('label', 'Hide Full:', '', visibility);
        let hideFull = UI.createElement('input', '', '', hideFullLabel);
        hideFull.type = 'checkbox';
        hideFull.id = 'hideFull';
        hideFull.onchange = function() {
            Sorting.filters.hideFull = hideFull.checked;
            Sorting.sortServers();
        }
        UI.createElement('span', '', 'checkmark', hideFullLabel);

        let selectLabel =  UI.createElement('label', 'Sort by:', '', sorting);
        let select = UI.createElement('select', '', 'no-margin', selectLabel);
        select.id = 'sorting';

        let options = {
            'default': 'Default',
            'whitelist': 'Whitelist',
            'validation': 'Validation',
            'country': 'Country',
            'name': 'Name',
            'players': 'Players',
            'version': 'Version',
            'size': 'Server Size'
        }

        Object.keys(options).forEach(key => {
            select.innerHTML += `<option value="${key}">${options[key]}</option>`;
        });

        select.onchange = function() {
            Sorting.filters.sorting = select.value;
            Sorting.sortServers();
            UI.fillServerList();
        }

        let asc = UI.createElement('input', '', '', sorting);
        asc.type = 'radio';
        asc.name = 'order';
        asc.id = asc.value = 'asc';
        asc.setAttribute('checked', '');
        let ascLabel = UI.createLabel('&#9650;', asc, true);
        ascLabel.className = 'label-button';

        let desc = UI.createElement('input', '', '', sorting);
        desc.type = 'radio';
        desc.name = 'order';
        desc.id = desc.value = 'desc';
        let descLabel = UI.createLabel('&#9660;', desc, true);
        descLabel.className = 'label-button';

        let radios = document.querySelectorAll('input[type="radio"]');
        let prev = null;

        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener('change', function() {
                if (this !== prev) {
                    prev = this;
                }
                Sorting.filters.sortingOrder = this.value;
                Sorting.sortServers();
                UI.fillServerList();
            });
        }

        UI.serverList = UI.createElement('table');

        whitelist.value = Sorting.filters.whitelist;
        validation.value = Sorting.filters.validation;
        updated.value = Sorting.filters.updated;
        hideEmpty.checked = Sorting.filters.hideEmpty;
        hideFull.checked = Sorting.filters.hideFull;
        select.value = Sorting.filters.sorting
        document.querySelector(`input[value="${Sorting.filters.sortingOrder}"]`).checked = true;
    }

    static fillServerList() {
        if (!UI.serverList) throw new Error('UI not built yet!');
        UI.serverList.innerHTML = '';

        BPServers.countPlayers();
        document.getElementById('players-count').innerHTML = BPServers.playerCount;
	    document.getElementById('servers-count').innerHTML = Servers.filteredServers.length;

        Servers.filteredServers.forEach(server => {
            let row = UI.createElement('tr', '', server.UpToDate ? '' : 'outdated', UI.serverList);
            row.onclick = function(e) {
                if (e.target.className === 'button') return;

                let targetInfo = this.nextElementSibling.querySelector('.info');
                console.log(targetInfo)

                document.querySelectorAll('.serverInfo .info').forEach(info => {
                    if (info !== targetInfo) {
                        info.classList.remove('show');
                    }
                });

                targetInfo.classList.toggle('show');
            }
            row.title = `Total size: ${Utils.getSize(server.TotalSize)}`;

            // Server details
            let subrow = UI.createElement('tr', '', 'serverInfo', UI.serverList);
            let td = UI.createElement('td', '', '', subrow);
            td.colSpan = Utils.mobileAndTabletCheck() ? 5 : 6;
            let wrapper = UI.createElement('div', '', 'info', td)
            let info = UI.createElement('div', '', 'inner', wrapper);

            // Map
            let mapInfo = `Filesize: ${Utils.getSize(server.Map.Filesize)}\nHash: ${server.Map.Hash}`;
            UI.createElement('div', `<b>Map:</b> ${server.Map.Name} <i class="fa-solid fa-circle-info info-tooltip" data-tooltip="${mapInfo}"></i>`, '', info);
            
            // Version
            UI.createElement('div', `<b>Version:</b> ${Utils.parseColorCodes((server.UpToDate ? '&2' : '&4') + server.Version)}`, '', info);
            
            // IP
            UI.createElement('div', `<b>IP:</b> ${server.IP}:${server.Port}`, '', info);
            
            // Difficulty
            UI.createElement('div', `<b>Difficulty:</b> ${parseFloat(server.Difficulty)*100}%`, '', info);

            // URL
            let url = '<b>URL:</b> ' + `<a href="${((server.URL && server.URL.startsWith('http')) ? server.URL : 'https://' + server.URL)}" target="_blank">${server.URL}</a>`;
            UI.createElement('div', url, '', info);
            
            // Plugins
            let pluginList = UI.createElement('details', '', '', info);
            UI.createElement('summary', `<b>Plugins (${server.Plugins ? server.Plugins.length : 0}):</b>`, '', pluginList);
            let pluginDetails = UI.createElement('div', '', 'content', pluginList);
            if (server.Plugins) {
                server.Plugins.forEach(plugin => {
                    pluginDetails.innerHTML += `<span>${plugin.Name} <i class="fa-solid fa-circle-info info-tooltip" data-tooltip="${plugin.Description}"></i></span>`;
                })
            }

            // Assets
            let assetsList = UI.createElement('details', '', '', info);
            UI.createElement('summary', `<b>Asset Bundles (${server.AssetBundles ? server.AssetBundles.length : 0}) [${Utils.getSize(server.TotalAssetsSize)}]:</b>`, '', assetsList);
            let assetsDetails = UI.createElement('div', '', 'content', assetsList);
            if (server.AssetBundles) {
                server.AssetBundles.forEach(asset => {
                    assetsDetails.innerHTML += `<span>${asset.Name} <i class="fa-solid fa-circle-info info-tooltip" data-tooltip="Filesize: ${Utils.getSize(asset.Filesize)}\nHash: ${asset.Hash}"></i></span>`;
                })
            }

            // Whitelist
            UI.createElement('td', server.Whitelist ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>', '', row);

            // Validation
            UI.createElement('td', server.Valid ? '<i class="fa-solid fa-check" style="color:#0f0"></i>' : '<i class="fa-solid fa-x" style="color:#f00"></i>', '', row);

            // Location
            let countryInfo = Countries.getCountryInfo(server.Location);
            let location = UI.createElement('td', countryInfo.flag, '', row);
            location.firstChild.title = countryInfo.name;
            location.firstChild.alt = server.Location;

            // Name
            UI.createElement('td', `<b>${Utils.parseColorCodes(server.Name)}</b>`, 'name', row);

            // Count 
            UI.createElement('td', `(${server.PlayerCount}/${server.PlayerLimit})`, '', row);

            // Connect
            if (!Utils.mobileAndTabletCheck())
            {
                let connectCol = UI.createElement('td', '', '', row);
                let connectButton = UI.createElement('a', 'Connect', 'button', connectCol);
                connectButton.onclick = function() {
                    Utils.connectToServer(`${server.IP}:${server.Port}`);
                }
            }
        });

        let tooltip = document.getElementById('tooltip');

        document.querySelectorAll('.info-tooltip').forEach(x => {
            x.onmouseenter = (e) => {
                showTooltip(e.target);
            }

            x.onmouseleave = () => {
                showTooltip(null, false);
            }

            x.onclick = (e) => {
                let shouldShow = this.prevTooltip ? this.prevTooltip != e.target : !tooltip.classList.contains('fadeIn');

                if (shouldShow) {
                    this.prevTooltip = e.target;
                }

                showTooltip(e.target, shouldShow);
            }
        });

        let showTooltip = (icon = null, visible = true) => {
            if (visible) {
                let rect = icon.getBoundingClientRect();
                tooltip.innerText = icon.dataset.tooltip ? icon.dataset.tooltip : 'No description.';
                tooltip.style.top = `${rect.top + window.scrollY + (rect.height / 2) - (tooltip.clientHeight / 2)}px`;
                tooltip.style.left = `${rect.left + rect.width + 5}px`;
                tooltip.classList.add('fadeIn');
            } else {
                tooltip.classList.remove('fadeIn');
            }
        }
    }
}