// ==UserScript==
// @name         Google Search Bar Info Popup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show a popup around the Google search bar when hovering or clicking on it, and hide it when the cursor leaves.
// @author       You
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the popup
    function removePopup() {
        const existingPopup = document.getElementById('customPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
    }

    // Create a function to show the popup
    function showPopup() {
        removePopup(); // Ensure any existing popup is removed before creating a new one

        // Create a new div element for the popup
        const popup = document.createElement('div');
        popup.id = 'customPopup';
        popup.style.position = 'absolute';
        popup.style.top = '60px'; // Adjust the position as necessary
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.padding = '10px';
        popup.style.backgroundColor = '#f9f9f9';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        popup.style.maxWidth = '300px';
        popup.style.fontSize = '12px';
        popup.style.lineHeight = '1.5';
        popup.style.zIndex = '1000'; // Ensure it's above other elements

        // Adding inner HTML for styled content with examples
        popup.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Google Advanced Search Tips:</div>
            <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li><code>site:</code> Limit results to a specific site. <span class="example">e.g., site:example.com</span></li>
                <li><code>filetype:</code> Search for files like PDF, DOCX. <span class="example">e.g., filetype:pdf</span></li>
                <li><code>intitle:</code> Words must appear in the title. <span class="example">e.g., intitle:weather report</span></li>
                <li><code>inurl:</code> Words must appear in the URL. <span class="example">e.g., inurl:blog</span></li>
                <li><code>intext:</code> Words must appear in the text. <span class="example">e.g., intext:"privacy policy"</span></li>
                <li><code>related:</code> Find related websites. <span class="example">e.g., related:example.com</span></li>
                <li><code>cache:</code> Show Google's cached version. <span class="example">e.g., cache:example.com</span></li>
                <li><code>" "</code> Exact phrase search. <span class="example">e.g., "exact phrase"</span></li>
                <li><code>-</code> Exclude words. <span class="example">e.g., -unwanted -words</span></li>
                <li><code>*</code> Wildcard/fuzzy search. <span class="example">e.g., *wildcard*</span></li>
                <li><code>OR</code> Search for either word. <span class="example">e.g., vacation London OR Paris</span></li>
            </ul>
            <style>
                #customPopup .example {
                    display: none;
                    color: #555;
                }
                #customPopup li:hover .example {
                    display: inline;
                }
                #customPopup {
                    max-height: 80px; /* Set maximum height for popup */
                    overflow: hidden; /* Hide the overflow content */
                }
                #customPopup:hover {
                    max-height: none; /* Show all content on hover */
                }
            </style>
            <div style="font-size: 10px; margin-top: 5px;">Hover over the tips to see examples or out to close this box.</div>
        `;

        // Append the popup to the body of the page
        document.body.appendChild(popup);
        popup.addEventListener('mouseleave', removePopup);

        // Add slight delay to ensure mouseover has completed
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);
    }

    // Function to initialize event listeners
    function initEventListeners() {
        const searchBar = document.querySelector('#APjFqb.gLFyf');
        if (searchBar) {
            console.log('Search bar found, adding event listeners.');
            searchBar.addEventListener('mouseover', showPopup);
            searchBar.addEventListener('focus', showPopup);
            searchBar.addEventListener('mouseleave', removePopup);
            searchBar.addEventListener('blur', removePopup); // Also hide popup when focus is lost
        } else {
            console.log('Search bar not found, waiting...');
            setTimeout(initEventListeners, 500); // Wait 500ms and try again
        }
    }

    // Start the script by trying to add event listeners
    initEventListeners();
})();
