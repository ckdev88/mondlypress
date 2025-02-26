echo "$(printf  "Press 1 for Firefox\nPress 2 for Chromium")"
read nr
if [ "$nr" -eq 1 ]; then
	echo 'Building for Firefox';
	cat manifest-firefox.json > manifest.json &&
	rm mondlypress-firefox.zip && 
	zip mondlypress-firefox.zip icon-128.png icon-64.png icon-48.png icon-32.png icon-16.png icon.svg manifest.json mondlypress.js

elif [ "$nr" -eq 2 ];then
	echo 'Building for Chromium';
	cat manifest-chrome.json > manifest.json
	rm mondlypress-chrome.zip && 
	zip mondlypress-chrome.zip icon-128.png icon-64.png icon-48.png icon-32.png icon-16.png icon.svg manifest.json mondlypress.js
fi
