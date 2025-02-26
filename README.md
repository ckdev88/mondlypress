# Use keyboard to spell words with **mondlypress**

## First! Known caveats
- Made for QWERTY keyboard layout
- Currently only for simple alphanumeric keys (A-Z, a-z)
	**Example:** in case of Portuguese: when quizzed to spell `lição` you can just type `licao` and have it approved. It will not work the other way around.


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
