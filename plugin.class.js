class Plugin {
    constructor() {
        this._config = this.constructor._config ?? {};
        this._name = this.constructor._name;
        this.configure(this.getSavedConfig());
    }

    static call(name, props) {
        loadedPlugins[this._name][name].call(loadedPlugins[this._name], props);
    }

    showConfig() {
        if (!this._configElement) {
            this._configElement = document.createElement('div');
            this._configElement.classList.add('config');
            document.body.appendChild(this._configElement);
        }
        this._configElement.innerHTML = this.renderConfig(this._config);
        this._configElement.style.opacity = 1;
    }

    hideConfig() {
       this._configElement.remove();
       delete this._configElement;
    }

    getSavedConfig() {
        try {
            const savedConfig = JSON.parse(localStorage[this._name]) ?? {};
            console.log(`Saved config: `, savedConfig);
            return savedConfig;
        } catch(e) {
            return {};
        }
    }

     configure(config) {
        this._config = {...this._config, ...config};
        localStorage[this._name] = JSON.stringify(this._config);
     }

     set(prop, value) {
        try {
            this.configure({[prop]:value});
            document.querySelectorAll(`input[name="${prop}"]`).forEach((e) => {
                e.value = value;
            });
        } catch(e) {
        }
     }

     render() { return ``; }
     renderConfig() { ``; }

     formElement(name, inputConfig, inputValue) {
        return `
            <label for="${name}">${inputConfig[0]}</label>
            <div class="row">
                <input name="${name}" type="range"
                    oninput="loadedPlugins['${this._name}'].set('${name}', this.value)"
                    value="${inputValue}"
                    min="${inputConfig[1]}"
                    max="${inputConfig[2]}"
                    step="${inputConfig[3]}"
                />
                <input name="${name}" onChange="loadedPlugins['${this._name}'].set('${name}', this.value)" type="text" value="${inputValue}" />
            </div>
        `;
    }

}
