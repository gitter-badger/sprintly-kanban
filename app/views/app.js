import React from "react";
import { RouteHandler } from "react-router";
import Promise from "bluebird";
import Sidebars from "./components/sidebars";
import helpers from "./pages/helpers";

export default React.createClass({

  getInitialState() {
    return {lastTap: 0}
  },

  /*
    Mobile double tap muting to prevent unwanted content zoom.
    Instead of adding a markup tag to control content scale which might
    prevent zoom levels on non-mobile
  */
  muteDoubleTap(e) {
    let timeBetweenTaps = e.timeStamp - this.state.lastTap;

    if (timeBetweenTaps < 500 && timeBetweenTaps > 0) {
      e.preventDefault();
    }
    this.setState({
      lastTap: e.timeStamp
    })
  },

  render: function() {
    let style = { minHeight: `${window.innerHeight}px`};
    let touchEndFn = helpers.isMobile(window) ? this.muteDoubleTap : function() {};

    return (
      <div style={style} className="app-view" onTouchEnd={this.muteDoubleTap}>
        <RouteHandler {...this.props} />
        <Sidebars {...this.props} />
      </div>
    )
  }
});
