var Console = require("../utils/console");
var React = require("react");
var Fluxxor = require("fluxxor");
var flux = require("./flux");
var _ = require("lodash");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var PTable = React.createClass({

    render: function () {
        var col_rtime = {textAlign: "right", width: "40px"},
            textleft = {textAlign: "left"},
            col_status = {width: "40px"},
            col_method = {width: "50px"};
        var highlightKey = null;
        if (this.props.highlightRequest) {
            highlightKey = this.props.highlightRequest.key;
        }
        return (
            <table id="requests" className="rtable">
                <thead>
                <tr key="head">
                    <th style={{width:"30px"}}>Status</th>
                    <th style={{textAlign:"left"}}>View</th>
                    <th style={{width:"30px"}}>Method</th>
                    <th style={{width:"30px"}}>Resp.Time</th>
                </tr>
                </thead>
                <tbody>
                {_.map(this.props.requests, function (r) {
                    var classString = "";
                    if (r.key == highlightKey) {
                        classString = "highlight";
                    }
                    return (
                        <tr className={classString} key={r.key} onClick={this.props.handleClick.bind(this, r)}>
                            <td>{r.status}</td>
                            <td style={{textAlign:"left"}}>{r.data.view_func}</td>
                            <td>{r.method}</td>
                            <td>{r.time.toFixed(1)} ms</td>
                        </tr>
                    );
                }, this)}
                </tbody>
            </table>
        );
    }
});

var RequestPanel = React.createClass({
    render: function () {
        var r = this.props.request;
        return (
            <div>
                <div><code>{JSON.stringify(r.data)}</code></div>
                <table className="rtable mheight">
                    {_.map(r.data.panels, function (row) {
                        return (
                            <tr>
                                <th>{row.t}</th>
                                <td>{row.s}</td>
                            </tr>
                        )
                    }, this)}
                </table>
            </div>
        );
    }
});


var Panel = React.createClass({
    getInitialState: function () {
        return {currentRequest: null}
    },
    handleClick: function (r, event) {
        this.setState({currentRequest: r});
    },

    render: function () {
        var rp;
        if (this.state.currentRequest) {
            rp = <RequestPanel request={this.state.currentRequest}/>
        } else {
            rp = <div></div>
        }
        return (
            <div id="container">
                <div id="content_left">
                    <PTable handleClick={this.handleClick} highlightRequest={this.state.currentRequest}
                            requests={this.props.requests}/>
                </div>
                <div id="content_right">
                    {rp}
                </div>
            </div>
        );
    }
});

var Application = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("RequestStore")],

    getStateFromFlux: function () {
        var flux = this.getFlux();
        return {
            request_store: flux.store("RequestStore").getState()
        }
    },

    render: function () {
        return <Panel requests={this.state.request_store.requests}/>;
    }
});

React.render(<Application flux={flux}/>, document.getElementById('app'));