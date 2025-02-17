// TODO add detection, only activate if useful
// TODO add Check detection and click
// TODO add Backspace detection and click
// TODO add some timeout or debounce per key press
// TODO add throttling for writing single letters when !isWords

/** Array of letters in the page */
console.log('Loading mondlypress...')
/** @type {string[]} */
let letters = []
let isWords = false
var wordCapturesLetters = ''

/** @type {number} -- artificial delay to deal with heavy/slow scripting on Mondly-side */
const TIMEOUT_COMPOSE = 90
/** @type {number} -- artificial delay, logically follows loop delayed by TIMEOUT_COMPOSE */
const TIMEOUT_PRESS = 120

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
	ô: 'o',
	ó: 'o',
	õ: 'o',
}
const strippers = ['.', ',', '?', "'"]

/**
 * Converts special char/token into simple one so it can be matched with pressed key
 * @param token {string}
 * @returns {string}
 */
function simplifyToken(token, isWords = false) {
	token = token.toLowerCase()
	if (isWords) {
		let braveNewWord = token.split('')
		for (let i = 0; i < braveNewWord.length; i++) {
			if (charmap[braveNewWord[i]] !== undefined) {
				braveNewWord[i] = charmap[braveNewWord[i]]
			} else if (strippers.includes(braveNewWord[i])) {
				braveNewWord[i] = ''
			}
		}
		return braveNewWord.join('')
	} else {
		if (charmap[token]) return charmap[token]
	}
	return token
}

/**
 * Find letters, their id's and match it with charmap
 * @param tokens {HTMLCollection}
 * @returns {void}
 */
function composeLetters(tokens) {
	letters.splice(0, letters.length)
	let lettersize = 0
	setTimeout(() => {
		for (let token of tokens) {
			if (token.innerText.length > 1) isWords = true
			const letterObj = {
				id: token.getAttribute('id'),
				letter: simplifyToken(token.innerText, isWords),
			}
			letters.push(letterObj)
			lettersize += token.innerText.length
		}
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

	if (letterKey === '3') {
		playAudio()
	}
	if (letterKey === 'Enter') {
		let button = document.querySelector('.quiz-action .btn')
		typeShower('', true)
		if (!button) {
			button = document.querySelector('.general-action .btn')
		}
		if (button) {
			button.click()
		}
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
				if (document.querySelector('.tokens-list .token').innerText.length > 1) {
					isWords = true
				} else {
					isWords = false
				}
			}
		}
		// rebuild letters array on L press // TODO this should not be necessary in a perfect world, if not used anymore, remove it

		if (letterKey === '1') {
			isWords = false
			tokens = document.getElementsByClassName('token')
			composeLetters(tokens)
		}
		if (letterKey === '2') {
			// TODO this should not be necessary in a perfect world, if not used anymore, remove it
			tokens = document.getElementsByClassName('token')
			composeLetters(tokens)
		} else if (letterKey === 'Backspace') {
			if (isWords) {
				wordCapturesLetters = wordCapturesLetters.slice(0, wordCapturesLetters.length - 1)
				typeShower(wordCapturesLetters)
			} else {
				// push backspaced characters into buffer stack
				const button = document.querySelector('.token-deselect .btn')
				if (button) button.click()
				const redo = lettersRemoved.splice(-1, 1)
				if (lettersRemoved.length > 0) letters.push(redo[0])
			}
		} else {
			letterKey = letterKey.toLowerCase()
			if (isWords && letterKey !== ' ' && letterKey.length === 1) {
				if (letterKey !== '1' && letterKey !== '2' && letterKey !== '3') {
					wordCapturesLetters += letterKey
					typeShower(wordCapturesLetters)
				}
			}

			if (isWords && letterKey === ' ') {
				setTimeout(() => {
					// if (letters.length > 0) {
					for (let i = 0; i < letters.length; i++) {
						if (letters[i].letter === wordCapturesLetters) {
							const targetNode = document.getElementById(letters[i].id)
							console.log('gogogo')
							if (targetNode) {
								targetNode.click()
								const remo = letters.splice(i, 1)
								lettersRemoved.push(remo[0])
								// console.log('removed letters:', lettersRemoved.join('').toString())
							}
							break
						}
					}
					wordCapturesLetters = ''
					typeShower(wordCapturesLetters)
				}, TIMEOUT_PRESS)
			} else if (!isWords) {
				// TODO not yet optimal, keeps stuck on isWords=true sometimes
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
		}
	} else {
		if (letterKey === '3') {
			let areaValue
			let area
			if (document.querySelector('textarea')) {
				area = document.querySelector('textarea')
				areaValue = document.querySelector('textarea').value
			} else if (document.querySelector('input')) {
				area = document.querySelector('input')
				areaValue = document.querySelector('input').value
			}
			area.value = areaValue.slice(0, areaValue.length - 1)
		}
	}
}

function playAudio() {
	let playAudioButton = document.getElementsByClassName('play-audio')[0]
	if (playAudioButton) playAudioButton.click()
}

/**
 * Showing the character typed to form words, helps not "typing in the dark"
 * @param {string} chars - Characters passed by buffer
 * @param {boolean} clear - Remove when not needed
 * @returns {void}
 */
function typeShower(chars = '', clear = false) {
	/** @type {HTMLElement | null} - TypeShower HTML element */
	let ts = null
	if (document.getElementById('typeshower')) {
		ts = document.getElementById('typeshower')
		if (clear) {
			ts.remove()
			return
		} else {
			if (chars === '') ts.style.opacity = '0'
			else ts.style.opacity = '.9'
		}
		ts.innerText = chars
	} else if (clear === false) {
		ts = document.createElement('div')
		ts.id = 'typeshower'
		ts.innerText = chars
		ts.style.backgroundColor = '#dedae2'
		ts.style.width = 'auto'
		ts.style.position = 'fixed'
		ts.style.height = 'calc(1.25em + 40px)'
		ts.style.lineHeight = '1.25em'
		ts.style.bottom = '40px'
		ts.style.right = '40px'
		ts.style.padding = '20px'
		ts.style.fontSize = '30px'
		ts.style.color = '#1e173c'
		ts.style.borderRadius = '12px'
		ts.style.fontWeight = 'bold'
		ts.style.zIndex = '999999'
		ts.style.transition = 'width .12s linear, height .12s linear, opacity .12s ease-in-out'
		ts.style.opacity = '.9'
		document.querySelector('.ember-application').prepend(ts)
		ts.innerText = chars
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
