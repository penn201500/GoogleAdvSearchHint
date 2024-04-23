// ==UserScript==
// @name         Google Search Bar Info Popup
// @namespace    http://tampermonkey.net/
// @version      0.3
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

  let hidePopupTimeout;

  // Function to remove the popup with a delay
  function startHidePopup() {
    // Clear any existing timeout to avoid hiding it prematurely
    clearTimeout(hidePopupTimeout);
    hidePopupTimeout = setTimeout(removePopup, 500); // 500ms delay before hiding the popup
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

  let isDarkMode = false;
  try {
    isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log("Dark mode is " + (isDarkMode ? "enabled" : "disabled") + ".");
  } catch (error) {
    console.log("Failed to determine the color scheme mode.", error);
  }

  // Create a function to show the popup
  function showPopup() {
    removePopup(); // Ensure any existing popup is removed before creating a new one

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

    // Adding inner HTML for styled content with examples
    popup.innerHTML = `
          <div class="title">Google Advanced Search Tips:</div>
          <hr class="custom-hr" />
          <ul class="tips-list">
              <li><code class="code">""</code><span class="colon">:</span><span class="description">Exact phrase search.</span><span class="example">e.g., "exact phrase"</span></li>
              <li><code class="code">-</code><span class="colon">:</span><span class="description">Exclude words.</span><span class="example">e.g., -unwanted -words</span></li>
              <li><code class="code">*</code><span class="colon">:</span><span class="description">Wildcard/fuzzy search.</span><span class="example">e.g., *wildcard*</span></li>
              <li><code class="code">site</code><span class="colon">:</span><span class="description">Limit results to a specific site.</span><span class="example">e.g., site:example.com</span></li>
              <li><code class="code">filetype</code><span class="colon">:</span><span class="description">Search for files like PDF, DOCX.</span><span class="example">e.g., filetype:pdf</span></li>
              <li><code class="code">intitle</code><span class="colon">:</span><span class="description">Words must appear in the title.</span><span class="example">e.g., intitle:weather report</span></li>
              <li><code class="code">inurl</code><span class="colon">:</span><span class="description">Words must appear in the URL.</span><span class="example">e.g., inurl:blog</span></li>
              <li><code class="code">intext</code><span class="colon">:</span><span class="description">Words must appear in the text.</span><span class="example">e.g., intext:"privacy policy"</span></li>
              <li><code class="code">OR</code><span class="colon">:</span><span class="description">Search for either word.</span><span class="example">e.g., vacation London OR Paris</span></li>
              <li><code class="code">related</code><span class="colon">:</span><span class="description">Find related websites.</span><span class="example">e.g., related:example.com</span></li>
              <li><code class="code">cache</code><span class="colon">:</span><span class="description">Show Google's cached version.</span><span class="example">e.g., cache:example.com</span></li>
          </ul>
          <hr class="custom-hr" />
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
              .closing-remark {
                  font-size: 10px;
                  margin-top: 5px;
                  color: ${isDarkMode ? "lightgreen" : "darkgreen"};
              }
          </style>
          <div class="closing-remark">Hover over the tips to see examples or out to close this box.</div>
          `;

    // Append the popup to the body of the page
    document.body.appendChild(popup);
    // Attach event listeners to popup itself
    popup.addEventListener("mouseover", cancelHidePopup);
    popup.addEventListener("mouseleave", startHidePopup);
  }

  // Function to initialize event listeners
  function initEventListeners() {
    const searchBar = document.querySelector("#APjFqb.gLFyf");
    if (searchBar) {
      console.log("Search bar found, adding event listeners.");
      searchBar.addEventListener("mouseover", showPopup);
      searchBar.addEventListener("focus", showPopup);
      // Attach event listeners to the search bar for mouseleave
      searchBar.addEventListener("mouseleave", startHidePopup);
      // Hide the popup when the search bar loses focus, with a delay
      searchBar.addEventListener("blur", startHidePopup);
    } else {
      console.log("Search bar not found, waiting...");
      setTimeout(initEventListeners, 500); // Wait 500ms and try again
    }
  }

  // Start the script by trying to add event listeners
  initEventListeners();
})();
