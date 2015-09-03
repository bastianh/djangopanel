var Console = require("../utils/console");
var React = require("react");
var Fluxxor = require("fluxxor");
var flux = require("./flux");
var _ = require("lodash");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var PTable = React.createClass({

    render: function () {
        var textright = {textAlign: "right"}, textleft = {textAlign: "left"};
        var highlightKey = null;
        if (this.props.highlightRequest) {
            highlightKey = this.props.highlightRequest.key;
        }
        return (
            <table className="rtable">
                <tr key="head">
                    <th>Status</th>
                    <th style={textleft}>Url</th>
                    <th>Method</th>
                    <th>Resp.Time</th>
                </tr>
                {_.map(this.props.requests, function (r) {
                    var classString = "";
                    if (r.key == highlightKey) {
                        classString = "highlight";
                    }
                    return (
                        <tr className={classString} key={r.key} onClick={this.props.handleClick.bind(this, r)}>
                            <td>{r.status}</td>
                            <td style={textleft}>{r.url}</td>
                            <td className={classString}>{r.method}</td>
                            <td style={textright}>{r.time.toFixed(1)} ms</td>
                        </tr>
                    );
                }, this)}
            </table>
        );
    }
});

var RequestPanel = React.createClass({
    render: function () {
        var r = this.props.request;
        return (
            <div>
                <div>{r.url}</div>
                <table className="rtable">
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
        var style = {padding:0};
        var rp;
        if (this.state.currentRequest) {
            rp = <RequestPanel request={this.state.currentRequest}/>
        } else {
            rp = <div></div>
        }
        return (
            <div>
                <div style={style} className="col-sm-6">
                    <PTable handleClick={this.handleClick} highlightRequest={this.state.currentRequest}
                            requests={this.props.requests}/>
                </div>
                <div style={style} className="col-sm-6">
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

React.render(<Application flux={flux}/>, document.getElementById('container'));