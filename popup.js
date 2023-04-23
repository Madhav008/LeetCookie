const toggleButton = document.querySelector("#toggle-leetrooms-button");
toggleButton.addEventListener("click", () => {
    const toggleState = toggleButton.checked;
    chrome.storage.local.set({ leetroomsToggleState: toggleState });
    if (toggleState) {
        widthSlider.parentElement.style.display = "flex";
        darkModeButton.parentElement.parentElement.style.display = "flex";
    } else {
        widthSlider.parentElement.style.display = "none";
        darkModeButton.parentElement.parentElement.style.display = "none";
    }
});
const widthSlider = document.querySelector("#leetrooms-width");
widthSlider.addEventListener("input", (event) => {
    const leetroomsWidth = event.target.value;
    chrome.storage.local.set({ leetroomsWidth: leetroomsWidth });
});
const darkModeButton = document.querySelector("#toggle-leetrooms-darkmode");
darkModeButton.addEventListener("click", () => {
    const darkModeState = darkModeButton.checked;
    chrome.storage.local.set({ leetroomsDarkMode: darkModeState });
});

const instructionsContainer = document.querySelector("#leetrooms-instructions");
const settingsContainer = document.querySelector("#leetrooms-settings");
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    console.log(currentUrl);
    if (currentUrl.includes("https://leetcode.com/problems/")) {
        settingsContainer.style.display = "block";
        instructionsContainer.style.display = "none";
        chrome.storage.local.get("leetroomsToggleState", (result) => {
            const toggleState = result.leetroomsToggleState ?? true;
            toggleButton.checked = toggleState;
            if (toggleState) {
                widthSlider.parentElement.style.display = "flex";
                darkModeButton.parentElement.parentElement.style.display =
                    "flex";
            } else {
                widthSlider.parentElement.style.display = "none";
                darkModeButton.parentElement.parentElement.style.display =
                    "none";
            }
        });
        chrome.storage.local.get("leetroomsWidth", (result) => {
            const leetroomsWidth = result.leetroomsWidth || "525";
            widthSlider.value = leetroomsWidth;
        });
        chrome.storage.local.get("leetroomsDarkMode", (result) => {
            const darkModeState = result.leetroomsDarkMode ?? true;
            darkModeButton.checked = darkModeState;
        });

        const leetcodeLinkElement = document.querySelector("#leetcode-link2");

        chrome.storage.local.get("logedIn", (result) => {
          const isLoggedIn = result.logedIn ;
          console.log(isLoggedIn)
          if (isLoggedIn) {
            leetcodeLinkElement.textContent = "Successfully Logged In";
            leetcodeLinkElement.style.display = "none";
          }
        });
        
        chrome.storage.onChanged.addListener(function (changes, areaName) {
          console.log("New item in storage", changes.visitedPages.newValue);
          const isLoggedIn = changes.visitedPages.newValue;
          if (isLoggedIn) {
            leetcodeLinkElement.textContent = "Successfully Logged In";
            leetcodeLinkElement.style.display = "none";
          } else {
            leetcodeLinkElement.textContent = "Log In With Leetcode";
            leetcodeLinkElement.style.display = "block";
          }
        });
        
        // chrome.storage.local.get("loggedIn", (result) => {
        //     const isLoggedIn = result.loggedIn ?? true;
        //     const leetcodeLinkElement = document.querySelector("#leetcode-link2");

        //     if (isLoggedIn) {
        //         leetcodeLinkElement.textContent = "Successfully Logged In";
        //     } else {
        //         leetcodeLinkElement.textContent = "Log In";
        //     }
        // });

    } else {
        settingsContainer.style.display = "none";
        instructionsContainer.style.display = "block";
    }
});

const leetcodeLink = "https://leetcode.com/problems/two-sum";

const leetcodeLinkElement1 = document.querySelector("#leetcode-link");
leetcodeLinkElement1.addEventListener("click", () => {
    chrome.tabs.create({ url: leetcodeLink, active: true });

});

const leetcodeLinkElement = document.querySelector("#leetcode-link2");
leetcodeLinkElement.addEventListener("click", () => {
    // chrome.tabs.create({ url: leetcodeLink, active: true });
    chrome.cookies.getAll({ url: leetcodeLink }, cookies => {
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
});

const githubLink = "https://github.com/marwanhawari/LeetRooms";
const githubLinkElement = document.querySelector("#github-link");
githubLinkElement.addEventListener("click", () => {
    // chrome.tabs.create({ url: githubLink, active: true });


});
