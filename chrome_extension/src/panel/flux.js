var Fluxxor = require("fluxxor");
var Console = require("../utils/console");
var _ = require("lodash");

var constants = {
    ADD_REQUEST: "ADD_REQUEST"
};


var RequestStore = Fluxxor.createStore({
    initialize: function () {
        this.requestId = 0;
        this.requests = [];
        this.bindActions(
            constants.ADD_REQUEST, this.onAddRequest
        );
    },
    onAddRequest: function (payload) {
        var r = payload.request;
        this.requests.unshift({
            key: this._nextRequestId(),
            url: r.request.url,
            method: r.request.method,
            time: r.time,
            size: r.response.bodySize,
            status: r.response.status,
            data: payload.data
        });
        this.emit("change");
    },
    getState: function () {
        return {
            requests: this.requests
        };
    },
    _nextRequestId: function() {
        return ++this.requestId;
    }
});

var actions = {
    addRequest: function (request) {
        var value = _.result(_.findWhere(request.response.headers, {'name': 'X-CHROME-PANEL'}), 'value');
        if (value) {
            this.dispatch(constants.ADD_REQUEST, {request: request, data:JSON.parse(unescape(value))});
        }
    }
};

var stores = {
    RequestStore: new RequestStore()
};

var flux = module.exports = new Fluxxor.Flux(stores, actions);


flux.on("dispatch", function (type, payload) {
    if (Console && Console.log) {
        Console.log("[Dispatch]", type, payload);
    }
});


if (chrome && chrome.devtools) {
    chrome.devtools.network.addRequestHeaders({
        "X-DjangoPanel-Version": "0.0.1"
    });

    chrome.devtools.network.onRequestFinished.addListener(function (request) {
        flux.actions.addRequest(request)
    });
}


