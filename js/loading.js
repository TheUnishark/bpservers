class Loading {
    static loading = false;
    static loadingElement = null;
    static loadingInterval = null;

    static startLoading() {
        if (Loading.loading) return;
        Loading.loading = true;
        setTimeout(function() {
            if (Loading.loading) Loading.showLoading();
        }, 100);
    }

    static endLoading() {
        if (this.loading) {
            this.loading = false;
            this.hideLoading();
        }
    }

    static showLoading() {
        document.title = BPServers.name + ' (Loading...)';
        Loading.loadingElement = UI.createElement('div', '', 'title');

        let loadingText = UI.createElement('h1', 'Loading', '', Loading.loadingElement);
        Loading.loadingInterval = setInterval(function() {
            if (loadingText.innerHTML.endsWith('...')) loadingText.innerHTML = 'Loading';
            else loadingText.innerHTML += '.';
        }
        , 500);
    }
    
    static hideLoading() {
        document.title = BPServers.name;
        if (Loading.loadingElement) {
            clearInterval(Loading.loadingInterval);
            Loading.loadingInterval = null;

            Loading.loadingElement.remove();
            Loading.loadingElement = null;
        }
    }
}