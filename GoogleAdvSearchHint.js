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
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        popup.textContent = 'Tip: You can use advanced search operators such as "site:", "filetype:", "intitle:".'; // Customize with your own message

        // Append the popup to the body of the page
        document.body.appendChild(popup);
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
