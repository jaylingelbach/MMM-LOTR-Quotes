const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node_helper for MMM-LOTR-Quotes");
        this.apiKey = null; // Initialize apiKey
    },

    socketNotificationReceived: async function (notification, payload) {
        if (notification === "SET_UPDATE_INTERVAL") {
            console.log("Update interval set: ", payload);
            this.updateInterval = payload;
            return;
        }

        if (notification === "SET_API_KEY") {
            console.log("!@!@!@!@!@!@!@!@!@!@Received API key.", payload);
            this.apiKey = payload; // Store API key correctly
            return;
        }

        if (notification === "GET_NEW_QUOTE") {
            if (!this.apiKey) {
                console.error("API key is missing!");
                this.sendSocketNotification("NEW_QUOTE", {
                    quote: "No API key provided.",
                    character: "Unknown",
                    race: "Unknown",
                    realm: "Unknown",
                });
                return;
            }

            try {
                const fetch = (await import("node-fetch")).default;

                const response = await fetch("https://the-one-api.dev/v2/quote", {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                });

                if (!response.ok) throw new Error(`Error fetching quotes: ${response.statusText}`);

                const quotes = await response.json();
                if (!quotes.docs || quotes.docs.length === 0) throw new Error("No quotes found");

                const quoteData = quotes.docs[Math.floor(Math.random() * quotes.docs.length)];

                // Fetch character details
                const charResponse = await fetch(`https://the-one-api.dev/v2/character?_id=${quoteData.character}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                });

                if (!charResponse.ok) throw new Error(`Error fetching character: ${charResponse.statusText}`);

                const charData = await charResponse.json();
                const character = charData.docs[0] || {};

                // Send notification back to frontend
                this.sendSocketNotification("NEW_QUOTE", {
                    quote: quoteData.dialog || "No quote available",
                    character: character.name || "Unknown",
                    race: character.race || "No data given...",
                    realm: character.realm || (character.race === "Hobbit" ? "The Shire" : "No data given..."),
                });
            } catch (error) {
                console.error("Error fetching quote:", error);
                this.sendSocketNotification("NEW_QUOTE", {
                    quote: "Failed to fetch a new quote.",
                    character: "Unknown",
                    race: "Unknown",
                    realm: "Unknown",
                });
            }
        }
    },
});
