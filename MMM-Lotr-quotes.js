Module.register("MMM-LOTR-Quotes", {
    defaults: {
        updateInterval: 180000, // 3 minutes
        fadeSpeed: 4000,
    },
    start: function() {
        Log.info("Starting module: " + this.name);

        this.quoteData = "Loading...";
        this.characterData = "";
        this.raceData = "";
        this.realmData = "";

        // fetch an initial quote
        this.sendSocketNotification("GET_NEW_QUOTE");

        // Request a new quote from the backend
        setInterval(() => {
            this.sendSocketNotification("GET_NEW_QUOTE");
        }, this.config.updateInterval);
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <blockquote>${this.quoteData}</blockquote>
            <cite> - ${this.characterData}</cite>
            <div><strong>Race:</strong> ${this.raceData}</div>
            <div><strong>Realm:</strong> ${this.realmData}</div>
        `;
        return wrapper;
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification === "NEW_QUOTE") {
            console.log("New quote received:", payload.quote);
            this.quoteData = payload.quote;
            this.characterData = payload.character;
            this.raceData = payload.race;
            this.realmData = payload.realm;
            this.updateDom(this.config.fadeSpeed);
        }
    }
})