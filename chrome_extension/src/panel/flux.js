var Fluxxor = require("fluxxor");
var Console = require("../utils/console");


var constants = {
    ADD_REQUEST: "ADD_REQUEST"
};


var RequestStore = Fluxxor.createStore({
    initialize: function () {
        this.requests = [];
        this.bindActions(
            constants.ADD_REQUEST, this.onAddRequest
        );
    },
    onAddRequest: function (payload) {
        var r = payload.request;
        this.requests.unshift({
            url: r.request.url,
            method: r.request.method,
            time: r.time,
            size: r.response.bodySize,
            headers: r.response.headers
        });
        this.emit("change");
    },
    getState: function () {
        return {
            requests: this.requests
        };
    }
});

var actions = {
    addRequest: function (request) {
        this.dispatch(constants.ADD_REQUEST, {request: request});
    }
};

var stores = {
    RequestStore: new RequestStore()
};

var flux = module.exports = new Fluxxor.Flux(stores, actions);

/*
flux.on("dispatch", function (type, payload) {
    if (Console && Console.log) {
        Console.log("[Dispatch]", type, payload);
    }
});
*/

chrome.devtools.network.addRequestHeaders({
    "X-DjangoPanel-Version": "0.0.1"
});

chrome.devtools.network.onRequestFinished.addListener(function (request) {
    flux.actions.addRequest(request);
});

