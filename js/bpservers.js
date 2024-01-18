class BPServers {
    static name = 'BP Server List';

    static playerCount = 0;
    static version = 0;
    static updateNotes = '';

    static async reload() {
        UI.prepareHTML();
        Loading.startLoading();
        let failed = false;

        try {
            BPServers.version = await Utils.getVersion();
            BPServers.updateNotes = await Utils.getNews();
            await Servers.loadServers();
            await Countries.loadCountries();
            Sorting.loadFilters();
        } catch (e) {
            console.error(e);
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