let mySavedLinks = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const savedLinksFromStorage = JSON.parse(localStorage.getItem("savedLinks"));

if (savedLinksFromStorage) {
  mySavedLinks = savedLinksFromStorage;
  render(mySavedLinks);
}

function saveAndRenderLinks() {
  localStorage.setItem("savedLinks", JSON.stringify(mySavedLinks));
  render(mySavedLinks);
}

function render(links) {
  let listItems = "";
  for (let i = 0; i < links.length; i++) {
    listItems += `
      <li>
        <a target='_blank' rel='noopener noreferrer' href='${links[i]}'>
          ${links[i]}
        </a>
      </li>
    `;
  }
  ulEl.innerHTML = listItems;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    if (!string.startsWith("http://") && !string.startsWith("https://")) {
      try {
        new URL("https://" + string);
        return "https://" + string;
      } catch (_) {
        return false;
      }
    }
    return false;
  }
}

inputBtn.addEventListener("click", function () {
  let inputValue = inputEl.value.trim();

  const validatedUrl = isValidUrl(inputValue);
  if (validatedUrl !== false) {
    inputValue = validatedUrl === true ? inputValue : validatedUrl;

    if (!mySavedLinks.includes(inputValue)) {
      mySavedLinks.push(inputValue);
      inputEl.value = "";
      saveAndRenderLinks();
    }
  }
});

tabBtn.addEventListener("click", function () {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        if (!mySavedLinks.includes(url)) {
          mySavedLinks.push(url);
          saveAndRenderLinks();
        }
      }
    });
  } catch (error) {
    console.error("Error accessing tabs:", error);
  }
});

deleteBtn.addEventListener("dblclick", function () {
  localStorage.removeItem("savedLinks");
  mySavedLinks = [];
  render(mySavedLinks);
});
