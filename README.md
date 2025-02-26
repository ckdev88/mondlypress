# Use keyboard to spell words in Mondly with **mondlypress**
This applies to Mondly: https://app.mondly.com .
Spelling a word by clicking the mouse on a letter over and over can become a bit tedious. Not anymore!
Install this neat little plugin and you'll be able to use the keyboard.

## Installation
Go to https://addons.mozilla.org/en-US/firefox/addon/mondlypress/ for firefox, or just download the ZIP file and add it yourself.
The same can be done for Chromium based browsers (Chrome, Brave, Etc.)

## Why?
So, with that out the way... 
Learning a new language with Mondly is pretty good, wouldn't it be great if it could be used with keyboard only? 

## So?
Let's write a browser plugin that accommodates the keyboard user.
The plugin will find the letters on the page. When a word or phrase needs to be spelled, it matches these with the pressed key on the keyboard.

## How?
- Create event listeners for alphanumeric values and `-` character
- On key press, associate alphanumeric value with special letters, for example when pressing `e`, associate with `ê`, `é`, etc.
- Designate DOM area to search in by pattern for current case (this case: pressLetter)
- For each possibility of pressed key, find corresponding letter in designated DOM area , if found: send onpress event to the first occurence and stop the loop.
- Assign `ENTER` to submit/check
- Edge cases...

## Nice! 
**No need for mouse when:**
- spelling out a word in Mondly, or removing letter with `BACKSPACE`
- including submitting the answer with `ENTER`
- composing sentences, separating words with `SPACE` 
- skip screens like _Lesson completed_ faster with `ENTER`
- (re)playing the audio with `3`

## Known caveats
This is for alphanumeric layouts/languages, using A-Z, a-z. 
If a word you want to type has accents, like `lição`, you can just type `licao`.


### Nice things still to do
- Skip microphone: `ESC`

# Roadmap
1) ~~simple script in console with event listeners~~
2) ~~code primary requirements as extension~~
3) ~~setup manifest~~
4) ~~create logo~~
5) apply extension Firefox for test
6) apply extension Chromium/Google for test
7) code secondary requirements
8) apply & test again
10) code tertiary requirements
11) apply & test again
12) code cleanup & bugfixing & final tests
13) publish on Firefox and/or Google
