# Use keyboard to spell words with **mondlypress**

## First! Known caveats
- Made for QWERTY keyboard layout
- Currently only for simple alphanumeric keys (A-Z, a-z)

## Problem / Situation
So, witch that out the way... Learning a new language with Mondly using only the keyboard would be great.

## Task
Write a script and turn it into a plugin that accommodates the keyboard user.
The plugin will find the letters on the page when a word or phrase needs to be spelled with individual letters and matches these with the pressed key on the keyboard.

## Action
- Create event listeners for alphanumeric values and `-` character
- On key press, associate alphanumeric value with special letters, for example when pressing `e`, associate with `ê`, `é`, etc.
- Designate DOM area to search in by pattern for current case (this case: pressLetter)
- For each possibility of pressed key, find corresponding letter in designated DOM area , if found: send onpress event to the first occurence and stop the loop.
- Assign `ENTER` to submit/check

## Desired result
### Primary
No need for mouse when spelling out a word in Mondly, including submitting the answer.

### Secondary
When a sentence needs to be composed, enable keyboard users to, either:
- type the words, use `SPACE` to seperate sequence. IMPORTANT: this should've been in primary, no release without this feature.
- When multiple choice of 4 choices, connect pressing `a` to the first option, `b` to the second, et cetera.

### Tertiary
- ~~Backspace: `BACKSPACE`~~
- Skip microphone: `ESC`
- ~~Skip "lesson completed" Continue-button: `ENTER`~~

# Roadmap
1) simple script in console with event listeners
2) code primary requirements as extension
3) setup manifest
4) create logo
5) apply extension Firefox for test
6) apply extension Chromium/Google for test
7) code secondary requirements
8) apply & test again
10) code tertiary requirements
11) apply & test again
12) code cleanup & bugfixing & final tests
13) publish on Firefox and/or Google
