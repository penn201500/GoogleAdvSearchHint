// ==UserScript==
// @name         Google Search Bar Info Popup
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Show a popup around the Google search bar when hovering or clicking on it, and hide it when the cursor leaves.
// @author       You
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Inject Google Fonts into the head of the document
  const linkElement = document.createElement("link");
  linkElement.href =
    "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap";
  linkElement.rel = "stylesheet";
  document.head.appendChild(linkElement);
  const advancedSearch = {
    "zh-CN": "Google 高级搜索指令：",
    en: "Google Advanced Search Tips:",
  };
  const closingRemark = {
    "zh-CN": "将鼠标悬停在提示上查看例子，或移开鼠标以关闭此框.",
    en: "Hover over the tips to see examples or out to close this box.",
  };
  const translation = {
    exact_phrase: {
      "zh-CN": "完全匹配字词搜索：",
      en: "Exact phrase search:",
      example: {
        "zh-CN": '例如："精确短语"',
        en: 'e.g., "exact phrase"',
      },
      code: '""',
    },
    exclude_words: {
      "zh-CN": "排除以下字词：",
      en: "Exclude words:",
      example: {
        "zh-CN": "例如：-不需要的 -字词",
        en: "e.g., -unwanted -words",
      },
      code: "-",
    },
    wildcard_search: {
      "zh-CN": "通配符/模糊搜索：",
      en: "Wildcard/fuzzy search:",
      example: {
        "zh-CN": "例如：*通配符*",
        en: "e.g., *wildcard*",
      },
      code: "*",
    },
    limit_site: {
      "zh-CN": "限制结果到特定站点：",
      en: "Limit results to a specific site:",
      example: {
        "zh-CN": "例如：site:example.com",
        en: "e.g., site:example.com",
      },
      code: "site",
    },
    search_filetype: {
      "zh-CN": "搜索如PDF, DOCX的文件类型：",
      en: "Search for files like PDF, DOCX:",
      example: {
        "zh-CN": "例如：filetype:pdf",
        en: "e.g., filetype:pdf",
      },
      code: "filetype",
    },
    words_in_title: {
      "zh-CN": "标题中必须包含的字词：",
      en: "Words must appear in the title:",
      example: {
        "zh-CN": "例如：intitle:weather report",
        en: "e.g., intitle:weather report",
      },
      code: "intitle",
    },
    words_in_url: {
      "zh-CN": "URL中必须包含的字词：",
      en: "Words must appear in the URL:",
      example: {
        "zh-CN": "例如：inurl:blog",
        en: "e.g., inurl:blog",
      },
      code: "inurl",
    },
    words_in_text: {
      "zh-CN": "文本中必须包含的字词：",
      en: "Words must appear in the text:",
      example: {
        "zh-CN": '例如：intext:"privacy policy"',
        en: 'e.g., intext:"privacy policy"',
      },
      code: "intext",
    },
    either_word: {
      "zh-CN": "搜索任一字词：",
      en: "Search for either word:",
      example: {
        "zh-CN": "例如：vacation London OR Paris",
        en: "e.g., vacation London OR Paris",
      },
      code: "OR",
    },
    find_related: {
      "zh-CN": "查找相关网站：",
      en: "Find related websites:",
      example: {
        "zh-CN": "例如：related:example.com",
        en: "e.g., related:example.com",
      },
      code: "related",
    },
    show_cache: {
      "zh-CN": "显示谷歌缓存的网页版本：",
      en: "Show Google's cached version:",
      example: {
        "zh-CN": "例如：cache:example.com",
        en: "e.g., cache:example.com",
      },
      code: "cache",
    },
  };

  let hidePopupTimeout;
  const supportedLanguages = ["zh-CN", "en"];
  // Check if any of the user's preferred languages are supported
  const language =
    navigator.languages.find((lang) => supportedLanguages.includes(lang)) ||
    "en";
  console.log(`Here is the language: ${language}`);
  let isDarkMode = false;
  try {
    isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log("Dark mode is " + (isDarkMode ? "enabled" : "disabled") + ".");
  } catch (error) {
    console.log("Failed to determine the color scheme mode.", error);
  }

  // Function to attach click handlers to list items
  function attachClickHandlers() {
    const items = document.querySelectorAll(".tips-list li");
    items.forEach((item) => {
      item.addEventListener("click", function () {
        handlePopupItemClick(this.getAttribute("data-keyword"));
      });
    });
  }

  // Function to handle click event on popup items
  function handlePopupItemClick(keyword) {
    // Define a set of keywords that need a colon appended after them
    const keywordsSet = new Set([
      "site",
      "cache",
      "inurl",
      "filetype",
      "intitle",
      "intext",
      "related",
    ]);

    // Get the search bar element
    const searchBar = document.querySelector("#APjFqb.gLFyf");
    if (searchBar) {
      // Determine whether to prepend a space based on whether the search bar is empty
      const prefix = searchBar.value ? " " : "";
      // Append the selected keyword to the search bar value
      // Check if the keyword is in the set and append ':' accordingly
      // Set the cursor position based on whether the keyword is exact_phrase
      if (keyword === '""') {
        searchBar.value += `${prefix}""`;
        let cursorPosition = searchBar.value.length - 1; // Move the cursor inside the quotes
        searchBar.focus();
        searchBar.setSelectionRange(cursorPosition, cursorPosition);
      } else {
        if (keywordsSet.has(keyword)) {
          searchBar.value += `${prefix}${keyword}:`;
        } else {
          searchBar.value += `${prefix}${keyword}`;
        }
        // Move the cursor to the end of the search bar value
        searchBar.focus();
        searchBar.setSelectionRange(
          searchBar.value.length,
          searchBar.value.length
        );
      }
    }
  }

  function startHidePopup() {
    // Clear any existing timeout to avoid hiding it prematurely
    clearTimeout(hidePopupTimeout);
    hidePopupTimeout = setTimeout(removePopup, 800); // 800ms delay before hiding the popup
  }

  // Function to cancel hiding the popup if the user moves back over it
  function cancelHidePopup() {
    clearTimeout(hidePopupTimeout);
  }

  // Function to remove the popup
  function removePopup() {
    const existingPopup = document.getElementById("customPopup");
    if (existingPopup) {
      existingPopup.remove();
    }
  }

  // Function to handle keydown event
  function handleKeydownEvent(event) {
    // Check if Ctrl + C is pressed and the cursor is in the search bar
    const searchBar = document.querySelector("#APjFqb.gLFyf");
    const popup = document.getElementById("customPopup");
    if (
      event.ctrlKey &&
      event.key === "c" &&
      document.activeElement === searchBar &&
      popup
    ) {
      event.preventDefault(); // Prevent the default copy action
      removePopup(); // Remove the popup
    }
  }

  // Function to create a list item for each advanced search tip
  function createSearchTipsListItems(translations, language) {
    const searchTipsKeys = Object.keys(translations);
    return searchTipsKeys
      .map((key) => {
        const tip = translations[key];
        if (typeof tip === "object" && tip[language]) {
          // Generate the HTML for each tip
          const keywordAttribute =
            key === "exact_phrase" ? "&quot;&quot;" : tip.code;
          return `<li data-keyword="${keywordAttribute}">
                            <code class="code">${translation[key].code}</code>
                            <span class="colon">:</span>
                            <span class="description">${tip[language]}</span>
                            <span class="example">${tip.example[language]}</span>
                        </li>`;
        }
        return ""; // If there's no translation for the key, return an empty string
      })
      .join(""); // Join all list item strings into a single string
  }

  function generatePopupHTML(isDarkMode, language) {
    // Generate the list items dynamically based on translations
    const searchTipsHTML = createSearchTipsListItems(translation, language);
    return `
    <div class="title">${advancedSearch[language] || advancedSearch.en}</div>
    <div id="cancelButton">&#10006;</div>
    <hr class="custom-hr" />
    <ul class="tips-list">
        ${searchTipsHTML}
    </ul>
    <hr class="custom-hr" />
    <div class="closing-remark">${
      closingRemark[language] || closingRemark.en
    }</div>
    <style>
        .title, .description, .example, .code, .closing-remark {
            font-family: 'Source Code Pro', monospace;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .custom-hr {
            border: 0;
            height: 1px;
            background-image: linear-gradient(to right, transparent, ${
              isDarkMode ? "#fff" : "#555"
            }, transparent);
            margin: 10px 0;
            opacity: 0;
            animation: fadeIn 1s ease-in-out forwards; /* Apply the fadeIn animation */
        }
        .title {
            font-weight: bold;
            margin-bottom: 5px;
            color: ${isDarkMode ? "white" : "gray"};
        }
        .tips-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .code {
            font-weight: bold;
            color: ${isDarkMode ? "lightblue" : "blue"};
        }
        .colon {
            font-weight: bold;
            color: orange;
        }
        .description {
            color: ${isDarkMode ? "white" : "gray"};
            margin-left: 1%;
        }
        .example {
            display: none;
            font-style: italic;
            margin-left: 1%;
            color: ${
              isDarkMode ? "#BBB" : "#555"
            }; // Lighter for dark mode but still legible
        }
        .tips-list li:hover .example {
            display: inline;
        }
        #customPopup {
            max-width: 400px; /* Set a fixed maximum width for the popup */
            width: 100%; /* This makes the popup take full width up to its max-width */
            box-sizing: border-box; /* This ensures padding and borders are included in the width */
            overflow: hidden; /* Hide the overflow content */
        }
        #customPopup:hover {
            max-height: none; /* Show all content on hover */
        }
        #cancelButton {
          position: absolute;
          top: 5px;
          right: 5px;
          cursor: pointer;
          font-size: 14px;
          color: ${isDarkMode ? "#CCC" : "black"};
        }
        .closing-remark {
            font-size: 10px;
            margin-top: 5px;
            color: ${isDarkMode ? "lightgreen" : "darkgreen"};
        }
    </style>
`;
  }

  // Create a function to show the popup
  function showPopup() {
    const searchBar = document.querySelector("#APjFqb.gLFyf");
    if (document.getElementById("customPopup")) {
      // If popup already exists, do nothing
      return;
    }
    // Create a new div element for the popup
    const popup = document.createElement("div");
    popup.id = "customPopup";
    popup.style.position = "absolute";
    popup.style.top = "60px"; // Adjust the position as necessary
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.padding = "10px";
    popup.style.backgroundColor = "#f9f9f9";
    popup.style.border = "1px solid #ccc";
    popup.style.borderRadius = "5px";
    popup.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    popup.style.fontSize = "12px";
    popup.style.lineHeight = "1.5";
    popup.style.zIndex = "1000"; // Ensure it's above other elements
    popup.style.maxWidth = "600px"; // Set a max width that fits all content
    popup.style.whiteSpace = "nowrap"; // Prevents wrapping of content
    popup.style.overflow = "hidden"; // Keeps content from spilling out
    popup.style.textOverflow = "ellipsis"; // Adds ellipsis to overflowing text
    // Apply the background color based on isDarkMode
    popup.style.backgroundColor = isDarkMode
      ? "rgba(50, 50, 50, 0.9)"
      : "#f9f9f9";
    popup.style.color = isDarkMode ? "#CCC" : "black"; // Lighter text color for better contrast in dark mode
    popup.style.border = isDarkMode ? "1px solid #666" : "1px solid #ccc"; // Adjust border color for dark mode

    // Use the generatePopupHTML function to get the HTML content
    const popupContent = generatePopupHTML(isDarkMode, language);
    popup.innerHTML = popupContent;

    // Append the popup to the body of the page
    document.body.appendChild(popup);
    // Attach click handlers to the popup items
    attachClickHandlers();
    // Attach event listeners to popup itself
    popup.addEventListener("mouseover", cancelHidePopup);
    popup.addEventListener("mouseleave", startHidePopup);
    // Prevent hiding popup when clicking on popup items
    popup.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent event bubbling
    });
    // Add event listener for the cancel button
    const cancelButton = popup.querySelector("#cancelButton");
    cancelButton.addEventListener("click", removePopup);
    // Adjust position to be below the search bar, accounting for scrolling
    const rect = searchBar.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY}px`; // Use bottom + scrollY for absolute positioning relative to the page
    popup.style.left = `${rect.left + window.scrollX}px`; // Align left edge with search bar's left
    popup.style.transform = "translateX(0%)"; // Remove centering transformation if previously set
  }

  // Function to initialize event listeners
  function initEventListeners() {
    const searchBar = document.querySelector("#APjFqb.gLFyf");
    if (searchBar) {
      console.log("Search bar found, adding event listeners.");
      searchBar.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent event bubbling
        showPopup();
      });
      searchBar.addEventListener("mouseover", showPopup);
      searchBar.addEventListener("focus", showPopup);
      // Attach event listeners to the search bar for mouseleave
      searchBar.addEventListener("mouseleave", startHidePopup);
      // Hide the popup when the search bar loses focus, with a delay
      searchBar.addEventListener("blur", startHidePopup);

      // Add event listener for keydown
      document.addEventListener("keydown", handleKeydownEvent);

      // Prevent popup from hiding when clicking inside the popup itself
      document.addEventListener("click", function (event) {
        if (
          !document.getElementById("customPopup").contains(event.target) &&
          event.target !== searchBar
        ) {
          removePopup(); // Remove the popup if clicked outside of popup and search bar
        }
      });
    } else {
      console.log("Search bar not found, waiting...");
      setTimeout(initEventListeners, 500); // Wait 500ms and try again
    }
  }

  // Start the script by trying to add event listeners
  initEventListeners();
})();
