// // Listen for tab updates
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     // Get the cookies for the current tab
//     chrome.cookies.getAll({ url: tab.url }, cookies => {
//       console.log(cookies);
//     });
//   }
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getCookies') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      // Get the cookies for the current tab

      chrome.cookies.getAll({ url: tabs[0].url }, cookies => {
        sendResponse({ type: 'cookies', cookies: cookies });
      });
    });
    return true;  // Tell Chrome to keep the messaging channel open until sendResponse is called
  }
});
// Listen for tab changes

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    var url = 'https://leetcode.com/';
    console.log('Looking for cookies on: ' + url);

    if (tab.url.includes(url)) {
      // Get the cookies for the current tab

      chrome.cookies.getAll({ url: tab.url }, cookies => {
        var final_cks = cookies.map((e) => {
          return e.name + '=' + e.value + '; ';
        }).join('');

        var username;

        for (var i = 0; i < cookies.length; i++) {
          if (cookies[i].name.includes('_gr_last_sent_cs1')) {
            console.log('Username: ' + cookies[i].value);
            username = cookies[i].value;
            break;
          }
        }
        console.log(final_cks);
        // localStorage.setItem('cookies', final_cks);
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("access-control-allow-origin", "*");
        myHeaders.append("cache-control", "no-cache");
        myHeaders.append("content-type", "application/json");


        var raw = JSON.stringify({
          "username": username,
          "cokkie": final_cks
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:2000/validate/", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(JSON.parse(result).success)
            chrome.storage.local.set({ "logedIn": JSON.parse(result).success });
            chrome.storage.sync.set({ 'visitedPages': JSON.parse(result).success })

          })
          .catch(error => console.log('error', error));
      });
    }
  });
});