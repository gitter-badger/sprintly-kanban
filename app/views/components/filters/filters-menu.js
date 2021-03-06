import _ from 'lodash';
import React from 'react/addons';
import MembersFilter from './forms/members-filter';
import CheckboxFilter from './forms/checkbox-filter';
import TagsFilter from './forms/tags-filter';
import classNames from "classnames";
import onClickOutside from '@sprintly/react-onclickoutside';

var FiltersMenu = React.createClass({

  getDefaultProps() {
    return {
      disableOnClickOutside: true
    }
  },

  getInitialState() {
    return {
      showPopup: false,
      visibleFilters: []
    }
  },

  mixins: [
    onClickOutside
  ],

  handleClickOutside() {
    this.setState({
      showPopup: false
    });
    this.disableOnClickOutside();
  },

  propTypes: {
    members: React.PropTypes.array.isRequired,
    allFilters: React.PropTypes.array.isRequired,
    updateFilters: React.PropTypes.func.isRequired
  },

  toggleFiltersMenu() {
    let showPopup = !this.state.showPopup;

    if (showPopup) {
      this.enableOnClickOutside();
    } else {
      this.disableOnClickOutside();
    }
    this.setState({ showPopup });
  },

  toggleVisible(filter) {
    let visibleFilters = _.clone(this.state.visibleFilters);
    if (_.contains(visibleFilters, filter)) {
      this.setState({ visibleFilters: _.without(visibleFilters, filter) })
    } else {
      visibleFilters.push(filter);
      this.setState({ visibleFilters });
    }
  },

  renderForm(filter) {
    var form;
    var formProps = {
      name: filter.field,
      updateFilters: this.props.updateFilters,
      options: filter.criteriaOptions,
      criteria: filter.criteria,
      visible: true
    };
    switch (filter.type) {
      case 'members':
        form = <MembersFilter {...formProps} members={this.props.members}/>
        break;
      case 'checkbox':
        form = <CheckboxFilter {...formProps} />
        break;
      case 'tags':
        form = <TagsFilter {...formProps} />
        break;
      default:
        form = '';
        break;
    }
    return form;
  },

  buildFilters() {
    return (
      _.map(this.props.allFilters, function(filter, i) {
        var classes = classNames({
          'show-form': _.contains(this.state.visibleFilters, filter.field)
        });

        return (
          <li className={classes} key={i}>
            <h3 onClick={_.partial(this.toggleVisible, filter.field)}>{filter.label}</h3>
            {this.renderForm(filter)}
          </li>
        );
      }, this)
    )
  },

  mine(ev) {
    ev.preventDefault();
    this.props.updateFilters('assigned_to', this.props.user.id)
  },

  render() {
    var classes = classNames({
      'col-sm-2': true,
      'filters-menu': true,
      'show-popup': this.state.showPopup
    })

    var filters = this.buildFilters();
    return (
      <div className={classes}>
        <button className="btn filters-menu__button" onClick={this.toggleFiltersMenu}>
          <span className="glyphicon glyphicon-filter"/> Add Filter
        </button>
        <a href="#" onClick={this.mine} className="filters-menu__mine">My Items</a>
        <div className="col-sm-12 filters-menu__popup">
          <div className="filters-menu__scroll-wrapper">
            <ul className="filters-menu__list">
              {filters}
            </ul>
          </div>
        </div>
      </div>
    )
  }
});

export default FiltersMenu;
