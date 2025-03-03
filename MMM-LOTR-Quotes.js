
Module.register("MMM-LOTR-Quotes", {
    defaults: {
        fadeSpeed: 4000,
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.apiKey = this.config.apiKey || ""
        this.updateInterval = this.config.updateInterval
        // Initialize quote data as an object
        this.quoteData = {
            quote: "Loading...",
            character: "Loading...",
            race: "Loading...",
            realm: "Loading..."
        };

        if(!this.updateInterval || this.updateInterval === "") {
            console.log("Default updateInterval is 10 minutes");
            this.updateInterval = 600000;
        }

        if (!this.apiKey || this.apiKey === "") {
            Log.error("MMM-LOTR-Quotes: No API key provided!");
            return;
        }

        this.sendSocketNotification("SET_UPDATE_INTERVAL", this.updateInterval);

        // Send API key to node_helper
        this.sendSocketNotification("SET_API_KEY", this.apiKey);

        // Fetch an initial quote
        this.sendSocketNotification("GET_NEW_QUOTE");

        // Request a new quote every `updateInterval` (3 minutes)
        setInterval(() => {
            this.sendSocketNotification("GET_NEW_QUOTE");
        }, this.config.updateInterval);
    },

    getHeader: function () {
        return "Lord of the Ring quotes"
      },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className="quote";
        wrapper.innerHTML = `
            <div >
                <blockquote><strong>${this.quoteData.quote}</strong>
                    <cite> - <strong>${this.quoteData.character}</cite> <strong>
                </blockquote>
            </div>
            <div><strong>Race:</strong> ${this.quoteData.race}</div>
            <div><strong>Realm:</strong> ${this.quoteData.realm}</div>
        `;

        return wrapper;
    },
    // get notification from the backend
    socketNotificationReceived: function (notification, payload) {
        if (notification === "NEW_QUOTE") {
            console.log("New quote received:", payload.quote);

            // Update the data and the DOM
            this.quoteData = {
                quote: payload.quote,
                character: payload.character,
                race: payload.race,
                realm: payload.realm,
            };

            // Update the DOM with fade effect
            this.updateDom(this.config.fadeSpeed);
        }
    }
});


