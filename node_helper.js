const NodeHelper = require("node_helper");

require("dotenv").config(); // Load .env variables

module.exports= NodeHelper.create({
    start: function () {
        console.log("Starting node_helper for MMM-Test");
    },
    socketNotificationReceived: async function(notification, payload) {
        if(notification = "GET_NEW_QUOTE") {
            console.log("Fetching new quote...");

            const apiKey = process.env.API_KEY;

            try {

                const fetch = (await import("node-fetch")).default;
                const response = await fetch("https://the-one-api.dev/v2/quote", {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${process.env.API_KEY}`
                    }
                });
                console.log('RESPONSE?????',response);
                const quotes = await response.json();
                console.log("QUOTES?????????????", quotes)
                const quoteData = quotes.docs[Math.floor(Math.random() * quotes.docs.length)];

                // fetch character
                const charResponse = await fetch(`https://the-one-api.dev/v2/character?_id=${quoteData.character}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${process.env.API_KEY}`
                    }
                });

                const charData = await charResponse.json();
                const character = charData.docs[0];

                // send notification back to front end
                this.sendSocketNotification("NEW_QUOTE", {
                    quote: quoteData.dialog,
                    character: character.name || "Unknown",
                    race: character.race || "No data given...",
                    realm: character.realm || (this.raceData === "Hobbit" ? "The Shire" : "No data given...")
                });
            } catch (error) {
                console.error("Error fetching quote:", error);
                this.sendSocketNotification("NEW_QUOTE", {
                    quote: "Failed to fetch a new quote.",
                    character: "Unknown",
                    race: "Unknown",
                    realm: "Unknown"
                });
            }
        }
    },
})