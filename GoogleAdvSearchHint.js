// ==UserScript==
// @name         Test Script for Google
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Test if Tampermonkey scripts are running on Google.
// @author       Penn201500
// @match        https://www.google.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    alert('Tampermonkey is running!');
})();
