'use strict';

const INITIAL_CONFIG = {isActive: true, rules: []};
var config, backgroundPage, index = 0;

// Async.
function fetchConfig(callback) {
  chrome.storage.local.get('replinkConfig', function(result) {
    config = result.replinkConfig.rules ? result.replinkConfig : INITIAL_CONFIG;
    callback();
  });
}

function saveConfig() {
  chrome.storage.local.set({'replinkConfig': config});
  chrome.storage.local.get('replinkConfig', function(result) {console.log(result);});
}

function populateRulesList(rules) {
  $('.ruleList').empty();
  for (const rule of rules) {
    let ruleElement = document.createElement('div');
    ruleElement.innerHTML = rule.name;
    ruleElement.class = 'rule';

    $('.ruleList').append(ruleElement);
  }
}

function addRule(name) {
  config.rules.push({name: name, matcher: 0, replacers:[ ]});
  console.log(config);
  saveConfig(config);
  populateRulesList(config.rules);
}

function onLoad() {
  populateRulesList(config.rules);
  $('.addRule').bind('click', function() {
    addRule("Rule " + (++index));
  });
}


$(()=>{fetchConfig(onLoad)});

