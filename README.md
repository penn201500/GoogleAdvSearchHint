# GoogleAdvSearchHint

This README is also available in [Chinese](README_CN.md).

## Google Search Bar Info Popup Script

This script enhances the Google search experience by displaying a popup with advanced search tips around the Google search bar when it is hovered over, clicked, or focused. The popup can be manually controlled: it can be hidden using the `Ctrl + C` shortcut when the cursor is inside the search bar. The popup will disappear when the cursor moves away or when the search bar loses focus.

## Features

- Dynamically displays a list of advanced Google search tips.
- Popup appears on hover, click, or focus on the search bar.
- Popup can be manually hidden using the `Ctrl + C` shortcut when the cursor is in the search bar.
- Ensures that multiple rapid clicks do not open multiple instances of the popup.
- Popup remains visible until the mouse leaves the popup area or the search bar loses focus.
- Supports both English and Simplified Chinese based on user preferences.
- Custom styled components with dark mode detection.
- Automatically hides the popup on cursor out or by using keyboard shortcut.

## Screenshot

![GoogleAdvanceSearchHint-EN](https://github.com/penn201500/GoogleAdvSearchHint/blob/main/GoogleAdvanceSearchHint-EN.gif)

## Installation

1. Ensure you have Tampermonkey installed in your browser. If not, install it from [Tampermonkey's official website](https://www.tampermonkey.net/).
2. Copy the script code.
3. Open Tampermonkey in your browser and select 'Create a new script'.
4. Paste the copied script into the editor and save.

## Usage

Simply navigate to Google and interact with the search bar to see the popup. This can be triggered by hovering, clicking, or focusing on the search bar.
Press `Ctrl + C` while focused on the search bar to hide the popup.
Move your cursor away to hide the popup automatically.

## License

This script is open-source and free to use under the MIT license.
