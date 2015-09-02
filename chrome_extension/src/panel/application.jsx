var Console = require("../utils/console");
var React = require("react");
var Fluxxor = require("fluxxor");
var flux = require("./flux");
var _ = require("lodash");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var Table = React.createClass({
    render: function () {
        return (
            <table>
                {_.map(this.props.requests, function (r) {
                    return (
                        <tr>
                            <td>{r.url}</td>
                            <td>{r.method}</td>
                            <td>{r.time}</td>
                        </tr>
                    );
                })}
            </table>
        );
    }
});

var Application = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("RequestStore")],

    getStateFromFlux: function () {
        var flux = this.getFlux();
        return flux.store("RequestStore").getState();
    },

    render: function () {
        Console.warn("Rendered!", this.state.requests);

        return <Table requests={this.state.requests}/>;
    }
});

React.render(<Application flux={flux}/>, document.getElementById('container'));