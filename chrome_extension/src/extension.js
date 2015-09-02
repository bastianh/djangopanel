require("./manifest.json");
require("./extension.html");

console = require("./utils/console");

chrome.devtools.panels.create(
    'DjangoPanel',
    null, // No icon path
    'panel/djangopanel.html',
    null // no callback needed
);

