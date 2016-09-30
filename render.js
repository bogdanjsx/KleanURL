'use strict';

// Create and element of the given type and append it to the given parent.
// Returns the new element.
function createNewElement(type, text, className, parent) {
    let newElement = document.createElement(type);
    newElement.innerHTML = text;
    newElement.className = className;

    if(parent) {
      $(parent).append(newElement);
    }

    return newElement;
}

function renderMainPage() {
  renderRuleList($('.content'));
  renderAddButton($('.footer'));
}

function renderDetailsPage(rule) {
  renderRuleDetails($('.content'), rule);
  renderDetailsButtons($('.footer'), rule);
}

function renderDeleteButton(parent, rule) {
  let deleteRuleButton = createNewElement(
      'button',
      'Delete',
      'deleteRule col-md-3 btn btn-xs btn-danger',
      parent);
  deleteRuleButton.addEventListener('click', () => {
    if(deleteRuleButton.innerHTML !== CONFIRM_DELETE_TEXT) {
      deleteRuleButton.innerHTML = CONFIRM_DELETE_TEXT;
    }
    else {
      _.remove(config.rules, {name: rule.name});
      saveConfig();
    }
  });

  return deleteRuleButton;
}

function renderEditButton(parent, rule) {
  let editButton = createNewElement(
      'button',
      'Edit',
      'editRule col-md-3 btn btn-xs btn-default',
      parent);
  editButton.addEventListener('click', () => {
    renderDetailsPage(rule);
  });
}

function renderOnOffSwitch(parent, rule) {
  let inputId = 'cmn-toggle-' + rule.name;
  let onOffSwitch = $(`<div class="switch">
    <input id="${inputId}"
      class="cmn-toggle cmn-toggle-round" type="checkbox">
    <label for="${inputId}"></label>
  </div>
  `);
  onOffSwitch.children()[0].checked = rule.isActive;
  onOffSwitch.bind('mousedown', () => {console.log('yes');
    rule.isActive = !rule.isActive; saveConfig(false)});
  $(parent).append(onOffSwitch);
}

function renderRuleList(parent) {
  $(parent).empty();

  let ruleList = document.createElement('div');
  ruleList.className = 'ruleList container-fluid';

  for (let rule of config.rules) {
    let ruleElement = document.createElement('div');
    ruleElement.className = 'rule row';

    createNewElement('div', rule.name, 'ruleName col-md-6', ruleElement);
    renderOnOffSwitch(ruleElement, rule);
    renderEditButton(ruleElement, rule);
    renderDeleteButton(ruleElement, rule);

    $(ruleList).append(ruleElement);
  }

  $(parent).append(ruleList);
}

function renderLabelAndInput(parent, data, label, id) {

  let newDiv = document.createElement('div');
  newDiv.className = 'detailInputWrapper container'
  let newLabel = document.createElement('label');
  newLabel.for = id;
  newLabel.innerHTML = label;
  let newInput = document.createElement('input');
  newInput.id = id + 'Input';
  newInput.className = 'pull-right detailInput';
  newInput.value = data || '';

  $(newDiv).append(newLabel, newInput);
  $(parent).append(newDiv);
}

function renderRuleDetails(parent, rule) {
  $(parent).empty();

  let ruleDetails = document.createElement('div');
  ruleDetails.className = 'ruleDetails container-fluid';

  console.log(rule.condition);

  renderLabelAndInput(ruleDetails, rule.name, 'Name', 'ruleName');
  renderLabelAndInput(ruleDetails, rule.condition, 'Condition', 'ruleCondition');
  renderLabelAndInput(ruleDetails, rule.from, 'Find', 'ruleFrom');
  renderLabelAndInput(ruleDetails, rule.to, 'Replace', 'ruleTo');

  let errorText = document.createElement('div');
  errorText.className = 'errorText text-danger';
  ruleDetails.appendChild(errorText);

  $(parent).append(ruleDetails);
}

function renderAddButton(parent) {
  $(parent).empty();

  let addNewRule = createNewElement('button', 'Add rule',
      'addRule btn btn-primary', parent);
  addNewRule.addEventListener('click', function() {
    renderDetailsPage({});
  });
}

function renderError(message) {
  console.log(message);
  $('.errorText').text(message);
}

function renderDetailsButtons(parent, rule) {
  $(parent).empty();

  let saveChanges = createNewElement('button', 'Save',
      'saveChanges btn btn-primary col-xs-3', parent);
  saveChanges.addEventListener('click', function() {
    let newRule = {
      name: document.getElementById('ruleNameInput').value,
      condition: document.getElementById('ruleConditionInput').value,
      from: document.getElementById('ruleFromInput').value,
      to: document.getElementById('ruleToInput').value,
    };

    try {
      if (_.isEmpty(rule)) {
        addRule(newRule);
      } else {
        editRule(rule, newRule);
      }
    } catch(e) {
      renderError(e.message);
    }
  });

  let cancelChanges = createNewElement('button', 'Cancel',
      'cancelChanges btn btn-danger col-xs-3', parent);
  cancelChanges.addEventListener('click', function() {
    renderMainPage();
  });
}
