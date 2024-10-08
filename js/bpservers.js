class BPServers {
    static name = 'BP Server List';

    static playerCount = 0;
    static version = '';
    static updateNotes = '';

    static async reload() {
        UI.prepareHTML();
        Loading.startLoading();
        let failed = false;

        try {
            let responses = await Promise.all([Utils.getVersion(), Utils.getNews(), Servers.getServers(), Countries.loadCountries()]);

            BPServers.version = responses[0];
            BPServers.updateNotes = responses[1];
            Servers.servers = responses[2];

            Servers.loadServers();
            Sorting.loadFilters();
        } catch (e) {
            console.error(e)
            failed = true;
        }

        Loading.endLoading();
        
        if (failed) {
            document.title = BPServers.name + ' (Error)';
            let div = UI.createElement('div', '', 'title');
            UI.createElement('h1', 'Error loading the server list, try again later.', div);
            return;
        }

        UI.buildUI();
        Sorting.sortServers();
        UI.fillServerList();
    }

    static countPlayers() {
        BPServers.playerCount = 0;

        Servers.filteredServers.forEach(x => {
            BPServers.playerCount += x.PlayerCount;
        });
    }
}