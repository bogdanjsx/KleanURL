'use strict';

var config;

function fetchConfig(callback) {
  chrome.storage.local.get(STORAGE_KEY, function(result) {
    config = result[STORAGE_KEY] || INITIAL_CONFIG;
    callback();
  });
}


function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

var readd = function() {
    console.log('readd');
    chrome.webNavigation.onBeforeNavigate.addListener(replace);
    //chrome.webNavigation.onDOMContentLoaded.removeListener(readd);
}

var replace = function(details) {
    let oldUrl = details.url,
        newUrl = oldUrl.slice();

    if (!config.rules)
      return;

    console.log(details);

    // for (var iii = 0; iii < config.rules.length - 1; ++iii) {
    //   let rule = config.rules[iii];
    //   console.log('heeereee', iii);

    //   if(!rule.isActive)
    //     continue;

    //   if(rule.condition === null && oldUrl.match(rule.condition)) {
    //     newUrl.replace(rule.from, rule.to);
    //   }
    // }

    if(oldUrl.indexOf('yahoo') > -1) {
        details.url  = 'http://www.yahoo.com/mail';
        //chrome.tabs.update(details.tabId, {url: 'http://www.yahoo.com/mail'}, callback);
    }

   chrome.webNavigation.onDOMContentLoaded.addListener(readd);
   chrome.webNavigation.onBeforeNavigate.removeListener(this);
}

fetchConfig(function() {
  chrome.webNavigation.onBeforeNavigate.addListener(replace);
});
