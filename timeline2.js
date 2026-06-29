class TimelinePluginV2 extends Plugin {
    static _name = "TimelinePluginV2";
    static _config = {
        scale: 4,
        timelineLength: 24*60, // 24h default
        fontSize: 2,
        fontWeight: 500,
        marginLeft: 6,
        marginRight: 6,
        marginBottom: 6,
        invertMode: 0,
        timeMode: 0,
        };

    _dayInMS = 24*60*60*1000;
    _events = [];

    constructor() {
        super();
        console.log(`${this._name} plugin loaded...`);
        this.loadEvents();
    }

    mapPosition(x) {
        const timeInMS = this._config.timelineLength * 60 * 1000;
        if (x > timeInMS) { return 100; }
        return 100 * (x / timeInMS );
    }


    loadEvents() {
        fetch("events.csv").then((data)=>(data.text()))
        .then((data) => {
            if (!data) { throw new Error("Failed to load events").split("\n"); }
            const now = (new Date()).getTime();
            this._events = data.trim().split("\n").map((line)=> {
                try {
                    const csv=line.trim().split("|");
                    if (!csv[1]) { return; }

                    const date = new Date(csv[0]);
                    if (date.getTime() < now) { return };

                    return {
                        name: csv[1],
                        date,
                        bgcolor: csv[2],
                        color: csv[3]
                    };
                } catch(e) {
                    console.error(`Error parsing "${line}"`, e);
                }
            }).filter(e=>e).sort((a,b)=> (a.date.getTime() - b.date.getTime()));
            this._nextEvent = 0;
            console.log(`${this._events.length} event(s) loaded`, this._events);
            const self = this;
        }).catch((error) => {
            alert(error);
        });
     }

     _configForm = {
        scale: ['Timeline scale', 1, 10, 0.1],
        timelineLength: ['Timeline length [minutes]', 1, 24*60, 1],
        fontSize: ['Text size [rem]', 0.1, 3, 0.1],
        fontWeight: ['Font weight', 0, 1000, 100],
        marginLeft: ['Margin left [%]', 0, 50, 0.1],
        marginRight: ['Margin right [%]', 0, 50, 0.1],
        marginBottom: ['Margin bottom [%]', 0, 50, 0.1],
        invertMode: ['Negative', 0, 1, 1],
        timeMode: ['Time to event / time of event', 0, 1, 1],
        };

     renderConfig(config) {
            console.log(config, this._config, this);
            const fields = [];
            fields.push(`<div><h3>${this._name}</h3><span class="close-button" onClick="${this._name}.call('hideConfig')"></span></div>`);
            for (name in this._configForm) {
                fields.push(this.formElement(name, this._configForm[name], config[name]));
            };
            return fields.join('');
     }

     formatTime(timeMS, useUtc = false) {
        const time = useUtc
            ? (new Date(timeMS)).toUTCString().split(' ').slice(-2)[0]
            : (new Date(timeMS)).toLocaleTimeString('PL');
        const days = Math.floor(timeMS / this._dayInMS);
        return days > 0 ? `${days}D ${time}` : time;

     }

     getNextEvent() {
        if (this._nextEvent === this._events.length) {
            return [];
        }
        const now = (new Date()).getTime();
        const nextEvent = this._events[this._nextEvent];
        const timeDiff = nextEvent.date.getTime() - now;

        if (timeDiff > 0) {
            return [{
                ...this._events[this._nextEvent],
                timeTo: `${this.formatTime(timeDiff, true)}`,
                time: nextEvent.date.toLocaleString("pl"),
                name: `${nextEvent.name}`,
                timeDiff
                }]
        } else {
            this._nextEvent++;
        }
     }


     render() {
        const timeNow = (new Date()).toLocaleString("pl").split(' ')[1];
        const events = this.getNextEvent();
        const textStyle = `zoom: ${this._config.scale};font-size:${this._config.fontSize}rem;font-weight:${this._config.fontWeight}`;
        const boxStyle = `
            filter:invert(${this._config.invertMode});
            bottom:${this._config.marginBottom}%;
        `;

        const blankStyle = events.length > 0 ? '' : ' blank';

        return `
<div class="timeline-box-v2" style="${boxStyle}" onmouseup="${this.constructor._name}.call('showConfig')">
  <div class="timeline-v2" style="zoom:${1/this._config.scale}">
    <div class="blank" style="width:${this._config.marginLeft}%"></div>
    <div class="start${blankStyle}"></div>
    <div class="segment${blankStyle}" style="position:relative">
      <div class="dot tick${blankStyle}" style="left:0%">
          <div class="top">
              <div class="text" style="${textStyle}">
                  ${timeNow}
              </div>
          </div>
      </div>
      ${events.reverse().map((event) => {
        const timePos = this.mapPosition( Math.min(event.timeDiff, this._dayInMS) );
        const color = `
            ${event.bgcolor ? `;background-color: ${event.bgcolor}` : ""}
            ${event.color ? `;color: ${event.color}` : ""}
            `;

        return `
        <div class="dot" style="left:${timePos}%;display:flex;justify-content:flex-end">
            <div class="event">
                <div class="" title="${timePos-50}">
                    <div class="text" style="${textStyle}${color};transform:translateX(calc(${-timePos}%))">
                        ${this._config.timeMode === '1' ? event.time : event.timeTo }&nbsp;-&nbsp;${event.name}
                    </div>
                </div>
            </div>
        </div>


        `}).join('')}
    </div>
    <div class="end${blankStyle}"></div>
    <div class="blank" style="width:${this._config.marginRight}%">
        <div class="config-button link" onmouseup="${this.constructor._name}.call('showConfig')" style="${textStyle}">&#x2699;</a>
    </div>
  </div>
</div>
    `;
    }
}
