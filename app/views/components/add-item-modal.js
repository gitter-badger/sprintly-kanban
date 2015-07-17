import _ from 'lodash'; import React from 'react/addons';

import {Modal,Nav,NavItem} from 'react-bootstrap';
import {MentionsInput, Mention} from '@sprintly/react-mentions';
import Title from './add-item/title';
import TagsInput from './tags-input';
import StoryTitle from './add-item/story-title';
import MembersDropdown from './add-item/members-dropdown';
import IssueTemplates from './add-item/issue-templates';
import Select from 'react-select';
import LocalStorageMixin from 'react-localstorage';

import ItemActions from '../../actions/item-actions';
import helpers from './helpers';

const NAV_ITEMS = [
  { type: 'story', label: 'Story' },
  { type: 'task', label: 'Task' },
  { type: 'defect', label: 'Defect' },
  { type: 'test', label: 'Test' },
];

const STORY_ATTRS = ['who', 'what', 'why'];

let AddItemModal = React.createClass({

  propTypes: {
    tags: React.PropTypes.array,
    members: React.PropTypes.array,
    product: React.PropTypes.object
  },

  mixins: [
    React.addons.LinkedStateMixin,
    LocalStorageMixin
  ],

  getInitialState() {
    return {
      type: 'story',
      title: '',
      who: '',
      what: '',
      why: '',
      description: '',
      tags: [],
      assigned_to: null,
      assigneeName: '',
      sendToBacklog: true,
      validation: {
        title: true,
        who: true,
        what: true,
        why: true
      }
    }
  },

  getDefaultProps() {
    return {
      members: []
    }
  },

  setDescription(ev, value) {
    this.setState({ description: value });
  },

  setAssignedTo(value, member) {
    let memberName = _.chain(member).pluck('label').first().value()

    this.setState({
      assigned_to: value,
      assigneeName: memberName
    })
  },

  updateTags(tags) {
    this.setState({ tags });
  },

  changeType(type) {
    var descriptionTemplate = (type === 'defect') ? IssueTemplates.defect : '';
    this.setDescription(null, descriptionTemplate);

    this.setState({ type: type });
  },

  dismiss(ev) {
    ev.preventDefault();
    this.props.onHide();
  },

  createItem(ev) {
    ev.preventDefault();
    let item = _.pick(this.state, ['type', 'description', 'tags', 'assigned_to']);

    if (this.state.type === 'story') {
      _.assign(item, _.pick(this.state, STORY_ATTRS));
    } else {
      item.title = this.state.title;
    }

    if (this.state.sendToBacklog) {
      item.status = 'backlog';
    }

    ItemActions.addItem(this.props.product.id, item).then( (err) => {
      if (!err) {
        this.setState(this.getInitialState());
        this.props.onHide();
      } else {
        this.updateValidation(err)
      }
    });
  },

  updateValidation(err) {
    let validationState = this.state.validation;

    _.each(err.validationError, (attr) => {
      validationState[attr] = false;
    })

    this.setState({validation: validationState});
  },

  notAssignable() {
    return !this.props.members.length;
  },

  assignPlaceholder() {
    return this.notAssignable() ? 'Nobody to assign to': 'Unassigned';
  },

  assigneeName() {
    return this.state.assigneeName ? this.state.assigneeName : null;
  },

  render() {
    let mentions = helpers.formatMentionMembers(this.props.members);

    let tags = _.pluck(this.props.tags, 'tag');
    let members = helpers.formatSelectMembers(this.props.members);

    let title;
    if (this.state.type === 'story') {
      title = (
        <StoryTitle
          who={this.linkState('who')}
          what={this.linkState('what')}
          why={this.linkState('why')}
          validation={this.linkState('validation')}
        />
      );
    } else {
      title = (
        <Title
          title={this.linkState('title')}
          validation={this.linkState('validation')}
        />
      )
    }

    return (
      <Modal {...this.props} className="add-item">
        <Nav className="add-item__tabs" bsStyle='tabs' activeKey={this.state.type} onSelect={this.changeType}>
          {_.map(NAV_ITEMS, (item, i) => {
            return (
              <NavItem key={i} tabIndex="1" aria-role="tab" eventKey={item.type} className={`add-item__nav-${item.type}`}>
                {item.label}
              </NavItem>
            )
          })}
        </Nav>
        <div className='modal-body'>
          <form onSubmit={this.createItem}>
            {title}
            <div className="form-group">
              <MentionsInput
                value={this.state.description}
                onChange={this.setDescription}
                placeholder="Add a description...">
                  <Mention data={mentions} />
              </MentionsInput>
            </div>
            <div className="form-group">
              <TagsInput tags={tags} onChange={this.updateTags} value={this.state.tags}/>
            </div>
            <div className="row">
              <div className="col-xs-7 add-item__member-dropdown">
                <Select placeholder={this.assignPlaceholder()}
                        name="form-field-name"
                        className="assign-dropdown"
                        disabled={this.notAssignable()}
                        value={this.assigneeName()}
                        options={members}
                        onChange={this.setAssignedTo}
                        clearable={true} />
              </div>
              <div className="col-xs-5 add-item__actions">
                <button className="btn btn-default btn-lg cancel-item" onClick={this.dismiss}>Cancel</button>
                <input type="submit" className="btn btn-primary btn-lg create-item" value="Create Item"/>
                <div className="checkbox">
                  <label>
                    <input className="backlog-checkbox" type="checkbox" name="backlog" checkedLink={this.linkState('sendToBacklog')}/>
                    Automatically send to backlog.
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
});

export default AddItemModal;
