class Page extends Plugin {
    static _name = "Page";
    static _config = {
        bgColor: 128
    };

    constructor(config) {
        super(config);
        console.log(`${this._name} plugin loaded...`);
        document.body.ondblclick = () => {
            this.showConfig();
        }
        this.setBgColor(this._config.bgColor);
    }

    setBgColor(value) {
        document.body.style.backgroundColor = `rgb(${value},${value},${value})`;
    }

     set(prop, value) {
        super.set(prop, value);
        switch (prop) {
            case "bgColor":
                this.setBgColor(value);
                break;
        }
     }



    renderConfig() {
        const fields = [];
        fields.push(`<div><h3>${this._name}<span class="close-button" onClick="${this._name}.call('hideConfig')"></span></h3></div>`);
        fields.push(this.formElement('bgColor',['Background color', 0, 255, 0], this._config.bgColor));
        return fields.join("");
    }


}