# MMM-LOTR-Quotes

LOTR Quotes for Magic Mirror

![LOTR-Quotes](https://github.com/jaylingelbach/MMM-LOTR-Quotes/blob/main/LOTR-quotes-demo.jpg)

## Dependencies

- An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
- API key (free/requires a key) https://the-one-api.dev/

## Installation

1. Install MMM-LOTR-Quotes Module

```javascript
cd ~MagicMirror/modules/
git clone https://www.github.com/jaylingelbach/MMM-LOTR-Quotes.git
cd MMM-LOTR-Quotes
npm install
```

2. Add module to ~MagicMirror/config/config.js

## Config

| **Option** | **Description**                                 |
| ---------- | ----------------------------------------------- |
| `apiKey`   | Needed to access the quotes and run the module. |

| Option           | Description                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| `updateInterval` | Amount of time in milliseconds, the default is 10 min or 600000 milliseconds.. |

Here is an example for # MMM-LOTR-Quotes configuration in `config.js`

```
  {
    module: "MMM-LOTR-Quotes",
    position: "top_left",
    config: {
      apiKey: "YOUR_API_KEY_HERE",
      updateInterval: 1200000000 // 20 minutes leave out for 10 minute default
    }
  }
```

## Custom size manpulation

Custom css in `MagicMirror/css/custom.css`
You can adjust the size of the module by targeting the region and module name. If you place it in the bottom left for example:

```
.region.bottom-left .module.MMM-LOTR-Quotes {
    width: 400px !important;
}
```
