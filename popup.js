'use strict';

var config,
    index = 0;

var list;

function escapeString(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

// Async. Fetch the config from local storage.
function fetchConfig(callback) {
  chrome.storage.local.get(STORAGE_KEY, function(result) {
    config = result[STORAGE_KEY] || INITIAL_CONFIG;
    callback();
  });
}

// Save the config in local storage. Also, any save requires a re-render.
function saveConfig(shouldRender = true) {
  chrome.storage.local.set({[STORAGE_KEY]: config});
  if(shouldRender) {renderRuleList($('.content'))};
}

function isNameAvailable(newName, oldName) {
  return _.isEmpty(_.find(config.rules, {name: newName})) ||
         newName === oldName;
}

function getRuleProblem(rule, oldRule) {
  if (rule.name === '')
    return 'Rule name cannot be empty.';

  if (!isNameAvailable(rule.name, oldRule.name))
    return 'This name is in use by another rule.';

  if (rule.condition === '')
    return 'Condition text cannot be empty. Enter a wildcard (*) to match anything';

  if (rule.from === '')
    return 'Text to replace cannot be empty. Enter a wildcard (*) to match anything';

  return null;
}

function addRule(rule) {
  let problem = getRuleProblem(rule, {});
  if (problem) {
    throw new Error(problem);
  }

  config.rules.push({
    name: rule.name,
    isActive: true,
    condition: rule.condition,
    from: rule.from,
    to: rule.to
  });
  saveConfig();
  renderMainPage();
}

function editRule(rule, newRule) {
  let problem = getRuleProblem(newRule, rule);
  if (problem) {
    throw new Error(problem);
  }


  _.merge(rule, {
    name: newRule.name,
    condition: newRule.condition,
    from: newRule.from,
    to: newRule.to
  });

  rule.name = newRule.name;
  saveConfig();
  renderMainPage();
}

function onLoad() {
  renderMainPage();
}

$(()=>{fetchConfig(onLoad)});

