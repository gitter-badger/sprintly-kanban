import _ from 'lodash';
import React from 'react/addons';
import classNames from "classnames";
import {SplitButton, ButtonGroup, MenuItem} from 'react-bootstrap';

const SORT_OPTIONS = {
  created_at: 'Created At',
  priority: 'Priority',
  last_modified: 'Recent'
};

let ColumnHeader = React.createClass({

  getDefaultProps: function() {
    return {
      sortField: 'last_modified'
    }
  },

  onSelect: function(field) {
    this.props.setSortCriteria(field);
  },

  onReverseClick: function() {
    if (this.props.sortField !== 'priority') {
      this.props.reverse();
    }
  },

  render: function() {
    let directionClasses = {
      'glyphicon': true,
      'glyphicon-sort-by-attributes': this.props.sortDirection === 'desc',
      'glyphicon-sort-by-attributes-alt': this.props.sortDirection === 'asc',
    };

    return (
      <header>
        <div className="column__sort-options">
          <SplitButton onSelect={this.onSelect} activeKey={this.props.sortField} bsSize="small" title={`Sort by: ${SORT_OPTIONS[this.props.sortField]}`}>
            {_.map(_.omit(SORT_OPTIONS, this.props.sortField), function(label, field) {
              return (
                <MenuItem eventKey={field} key={field}>{label}</MenuItem>
              );
            }, this)}
          </SplitButton>
          <button className="reverse-sort" disabled={this.props.sortField === 'priority'} type="button" onClick={this.onReverseClick} aria-label="Change sort direction">
            <span aria-hidden="true" className={classNames(directionClasses)}/>
          </button>
        </div>

        <div className="column__summary">
          <ButtonGroup>
            <button className="btn btn-sm btn-default">42 points</button>
            <button className="btn btn-sm btn-default">36 items</button>
          </ButtonGroup>
        </div>
      </header>
    )
  }
})

export default ColumnHeader
