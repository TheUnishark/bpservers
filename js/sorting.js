class Sorting {
    static filters = {
        whitelist: 'any',
        validation: 'any',
        updated: 'any',
        hideEmpty: false,
        hideFull: false,
        sorting: 'default',
        sortingOrder: 'asc',
    }

    static applyFilters(serverList) {
        return serverList.filter(server => {
            let whitelist = Sorting.filters.whitelist === 'disabled' ? false : true;
            let validation = Sorting.filters.validation === 'valid' ? '+' : '!';
            let updated = Sorting.filters.updated === 'current' ? true : false;
    
            if (Sorting.filters.whitelist !== 'any' && server.Whitelist !== whitelist) return false;
            if (Sorting.filters.validation !== 'any' && server.Validation !== validation) return false;
            if (Sorting.filters.updated !== 'any' && ((updated && !server.UpToDate) || (!updated && server.UpToDate))) return false;
            if (Sorting.filters.hideEmpty && server.PlayerCount < 1) return false;
            if (Sorting.filters.hideFull && server.PlayerCount >= server.PlayerLimit) return false;
            return true;
        });
    }

    static sortServers() {
        localStorage.setItem('filters', JSON.stringify(Sorting.filters));
        let desc = Sorting.filters.sortingOrder === 'desc';
    
        Servers.filteredServers = Sorting.applyFilters(structuredClone(Servers.servers));
    
        switch (Sorting.filters.sorting) {
            case 'country':
                Servers.filteredServers.sort((a, b) => a.Location.localeCompare(b.Location));
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'name':
                Servers.filteredServers.sort((a, b) => a.santitizedName.localeCompare(b.santitizedName));
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'players':
                Servers.filteredServers.sort((a, b) => a.PlayerCount - b.PlayerCount);
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'version':
                Servers.filteredServers.sort((a, b) => parseFloat(a.Version) - parseFloat(b.Version));
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'validation':
                Servers.filteredServers.sort((a, b) => {
                    let aVal = a.Valid ? 1 : 0;
                    let bVal = b.Valid ? 1 : 0;
                    return aVal - bVal;
                });
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'whitelist':
                Servers.filteredServers.sort((a, b) => a.Whitelist - b.Whitelist);
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'size':
                Servers.filteredServers.sort((a, b) => a.TotalSize - b.TotalSize);
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
            case 'default':
            default:
                Servers.filteredServers = Sorting.applyFilters(structuredClone(Servers.servers));
                if (desc) Servers.filteredServers = Servers.filteredServers.reverse();
                break;
        }
    }

    static loadFilters() {
        let filters = localStorage.getItem('filters');
        if (filters) Sorting.filters = JSON.parse(filters);
    }
}