class Countries {
    static codes = {};
    static countries = {};

    static getCountryInfo(code) {
        if (!Countries.countries[code]) {
            let urlCode = code.toLocaleLowerCase();
            Countries.countries[code] = {name: code, flag: `<span>${code}</span>`};
    
            if (Countries.codes[urlCode]) {
                Countries.countries[code].name = Countries.codes[urlCode];
                Countries.countries[code].flag = `<img class="icon" src="https://flagcdn.com/h20/${urlCode}.png" loading="lazy">`;
            }
        }
    
        return Countries.countries[code];
    }

    static async loadCountries() {
        try {
            let req = await fetch('https://flagcdn.com/en/codes.json');
            let json = await req.json();
            Countries.codes = json;
        } catch (e) {
            console.error(e);
        }
    }
}