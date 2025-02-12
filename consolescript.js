// TODO add detection, only activate if useful
// TODO add Check detection and click
// TODO add Backspace detection and click
// TODO add some timeout or debounce per key press

/** Array of letters in the page */
console.log('Loading mondlypress...')
/** @type {string[]} */
let letters = []

/** @type {number} -- artificial delay to deal with heavy/slow scripting on Mondly-side */
const TIMEOUT_COMPOSE = 200
/** @type {number} -- artificial delay, logically follows loop delayed by TIMEOUT_COMPOSE */
const TIMEOUT_PRESS = 150

/**
 * Stack to enable backspace/undo
 * @type {string[]}
 */
let lettersRemoved = []
let tokens = document.getElementsByClassName('token')
let currentQuizId
if (document.querySelector('.quiz-instruction-wrapper')) {
	currentQuizId = document.querySelector('.quiz-instruction-wrapper').id
}

/** Special characters to simplify */
const charmap = {
	á: 'a',
	ä: 'a',
	à: 'a',
	â: 'a',
	ã: 'a',
	ç: 'c',
	ë: 'e',
	é: 'e',
	é: 'e',
	ē: 'e',
	ê: 'e',
	è: 'e',
	í: 'i',
	ñ: 'n',
}

/**
 * Converts special char/token into simple one so it can be matched with pressed key
 * @param token {string}
 * @returns {string}
 */
function simplifyToken(token) {
	token = token.toLowerCase()
	if (charmap[token]) return charmap[token]
	return token
}

/**
 * Find letters, their id's and match it with charmap
 * @param tokens {HTMLCollection}
 * @returns {void}
 */
function composeLetters(tokens) {
	let isWords = false
	letters.splice(0, letters.length)
	setTimeout(() => {
		for (let token of tokens) {
			if (token.innerText.length > 1) isWords = true
			const letterObj = {
				id: token.getAttribute('id'),
				letter: simplifyToken(token.innerText),
			}
			letters.push(letterObj)
		}
		// if (isWords) console.log('is words') TODO in following features, make these type-able too
	}, TIMEOUT_COMPOSE)
}

/**
 * Main function where keys are pressed and buttons get pushed
 * @param letterKey {string}
 * @returns {void}
 */
function checkKeyHit(letterKey) {
	let useTokens = false
	if (document.getElementsByClassName('token').length > 0) useTokens = true

	// control keys
	if (letterKey === 'P') {
		let playAudioButton = document.getElementsByClassName('play-audio')[0]
		if (playAudioButton) playAudioButton.click()
	} else if (letterKey === 'Enter') {
		let button = document.querySelector('.quiz-action .btn')
		if (button) button.click()
	}

	// if using letters and words which usually need a finger and/or a mouse
	if (useTokens) {
		let quizInstructionWrapper = document.querySelector('.quiz-instruction-wrapper')
		if (quizInstructionWrapper) {
			// check if quiz has changed, if yes, letters need to be re-composed
			if (quizInstructionWrapper.id !== currentQuizId) {
				// TODO this can/must be optimized
				letters = []
				lettersRemoved = []
				tokens = document.getElementsByClassName('token')
				composeLetters(tokens)
				currentQuizId = document.querySelector('.quiz-instruction-wrapper').id
			}
		}
		// rebuild letters array on R press
		if (letterKey === 'R') {
			// TODO this should not be necessary in a perfect world, if not used anymore, remove it
			tokens = document.getElementsByClassName('token')
			composeLetters(tokens)
		} else if (letterKey === 'Backspace') {
			// push backspaced characters into buffer stack
			const button = document.querySelector('.token-deselect .btn')
			if (button) button.click()
			const redo = lettersRemoved.splice(-1, 1)
			if (lettersRemoved.length > 0) letters.push(redo[0])
		} else {
			letterKey = letterKey.toLowerCase()
			setTimeout(() => {
				if (letters.length > 0) {
					for (let i = 0; i < letters.length; i++) {
						if (letters[i].letter === letterKey) {
							const targetNode = document.getElementById(letters[i].id)
							if (targetNode) {
								targetNode.click()
								const remo = letters.splice(i, 1)
								lettersRemoved.push(remo[0])
							}
							break
						}
					}
				}
			}, TIMEOUT_PRESS)
		}
	} else {
		if (letterKey === 'Enter') {
			let button = document.querySelector('.general-action .btn')
			if (button) button.click()
		}
	}
}

/**
 * Listen for keyups and do the thing, you know...
 * @param letterKey {string}
 * @returns {void}
 */
document.addEventListener('keyup', (event) => {
	event.preventDefault()
	checkKeyHit(event.key)
})

console.log('... mondlypress olé!')
