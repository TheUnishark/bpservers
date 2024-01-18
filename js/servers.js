class Servers {
    static servers = [];
    static filteredServers = [];

    static async getServers() {
        let req = await fetch('https://bpservers-proxy.onrender.com/servers');
        let servers = await req.json();
    
        servers.forEach(x => {
            // Sanitize name for sorting
            x.santitizedName = x.Name.replace(/&+[a-f]|&+[0-9]|[^a-z0-9\s]/ig, '').trim();
    
            // Server size
            x.TotalAssetsSize = 0;
            if (x.AssetBundles) {
                x.AssetBundles.forEach(y => {
                    x.TotalAssetsSize += y.Filesize;
                });
            }
    
            x.TotalSize = x.TotalAssetsSize + x.Map.Filesize;
    
            // Server validity
            x.UpToDate = parseFloat(x.Version) == BPServers.version;
            x.Valid = x.Validation === '+';
            x.CanConnect = x.UpToDate && x.PlayerCount < x.PlayerLimit && !x.Whitelist && x.Valid;
        })
    
        return servers;
    }

    static async loadServers() {
        Servers.servers = await Servers.getServers();
        Servers.filteredServers = structuredClone(Servers.servers);
    }
}