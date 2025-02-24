// TODO add Check detection and click
// TODO add some timeout or debounce per key press
// TODO add throttling for writing single letters when answerType=letter
// TODO when typing a word wrong, after ENTER in typeshower give feedback (red or so)

/** Array of letters in the page */
console.log('Loading mondlypress...')
/** @type {string[]} */
let letters = []
/** @type {'letter'|'word'|'multiplechoice'} - Types of answers that the mouse clicks */
let answerType = 'letter'
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
 * @param {string} token
 * @param {'letter'|'word'} charType
 * @returns {string}
 */
function simplifyToken(token, charType = 'letter') {
	token = token.toLowerCase()
	if (charType === 'word') {
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
 * @param {string} - word with possible gender prefix, example: (uma) casa
 * @returns {string} - de-genderized word
 */
function removeGender(combi = '') {
	if (combi[0] !== '(') {
		return simplifyToken(combi, 'word')
	}

	/** @type {string[]} - array used to join and then return */
	let rarr = combi.split('')
	/** @type {string} - result to return, a string free of gender */
	let r = ''
	for (let i = 2; i < rarr.length; i++) {
		// the gender is always in parentheses, so use this to detect closing
		if (rarr[i] === ')') {
			rarr = rarr.slice(i + 2, rarr.length)
			break
		}
	}
	// OPTIMIZE first joining the array, then in simplifyToken it gets spliced and joined again
	r = rarr.join('')
	r = simplifyToken(r, 'word')
	return r
}

/**
 * Find letters, their id's in the DOM and match it with charmap
 * @param {HTMLCollection} tokens
 * @param {'letter'|'word'} answerType - multiplechoice is handles separately in submitMultipleChoice
 * @returns {void}
 */
function composeLetters(tokens) {
	let charType = 'letter'
	letters.splice(0, letters.length)
	setTimeout(() => {
		for (let token of tokens) {
			if (token.innerText.length > 1) charType = 'word'
			const letterObj = {
				id: token.getAttribute('id'),
				letter: simplifyToken(token.innerText, charType),
			}
			letters.push(letterObj)
		}
	}, TIMEOUT_COMPOSE)
}

/**
 * Triggers de button push of the associated keypress letter
 * @returns {void}
 */
function submitLetterOfLetters(letters, letterKey) {
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

/**
 * Triggers de button push of the word associated buffer `wordCapturesLetters` and manages this buffer
 * @returns {void}
 */
function submitWordOfWords(letters) {
	setTimeout(() => {
		for (let i = 0; i < letters.length; i++) {
			if (letters[i].letter === wordCapturesLetters) {
				const targetNode = document.getElementById(letters[i].id)
				if (targetNode) {
					targetNode.click()
					const remo = letters.splice(i, 1)
					lettersRemoved.push(remo[0])
				}
				break
			}
		}
		wordCapturesLetters = ''
		typeShower(wordCapturesLetters)
	}, TIMEOUT_PRESS)
}

function submitMultipleChoice() {
	// trigger button connected to id in answers
	let multiplechoiceAnswers = []
	for (let i = 0; i < 4; i++) {
		// TODO this assumes always 4 options, create some checks for breaks
		multiplechoiceAnswers.push({
			answer: removeGender(document.getElementById(`option-${i}`)?.innerText),
		})
	}

	for (i = 0; i < multiplechoiceAnswers.length; i++) {
		if (wordCapturesLetters.trim() === simplifyToken(multiplechoiceAnswers[i].answer, 'word')) {
			button = document.getElementById(`option-${i}`)
			if (button) button.click()
			break
		}
	}
	setTimeout(() => {
		button = document.querySelector('.quiz-action .btn')
		button.click()
	}, TIMEOUT_PRESS)
}

/**
 * Main function where keys are pressed and buttons get pushed
 * @param letterKey {string}
 * @returns {void}
 */
function checkKeyHit(letterKey) {
	let useTokens = false
	if (
		document.getElementsByClassName('token').length > 0 ||
		document.getElementById('option-0')?.innerText.length > 0
	) {
		useTokens = true
	}

	if (letterKey === '3') {
		playAudio()
	}
	if (letterKey === 'Enter') {
		/** @type {Element|null} */
		typeShower('', true)
		let button = null
		if (answerType === 'multiplechoice') submitMultipleChoice()
		else {
			wordCapturesLetters = ''
			button = document.querySelector('.quiz-action .btn')
		}
		if (!button) button = document.querySelector('.general-action .btn')
		if (button) button.click()
	}

	// if using letters, words and multiplechoice which usually need a finger and/or a mouse
	if (useTokens) {
		let quizInstructionWrapper = document.querySelector('.quiz-instruction-wrapper')
		if (quizInstructionWrapper) {
			let answerType = getAnswerType(tokens)

			// check if quiz has changed, if yes, letters need to be re-composed
			if (quizInstructionWrapper.id !== currentQuizId) {
				// TODO this can/must be optimized
				letters = []
				lettersRemoved = []
				currentQuizId = document.querySelector('.quiz-instruction-wrapper').id
				if (answerType !== 'multiplechoice') {
					tokens = document.getElementsByClassName('token', answerType)
					composeLetters(tokens, answerType)
				}
			}
		}

		if (letterKey === '1') {
			// rebuild letters array // TODO this should not be necessary in a perfect world, if not used anymore, remove it
			tokens = document.getElementsByClassName('token')
			answerType = getAnswerType()
			if (tokens.length > 0) composeLetters(tokens)
		}
		if (letterKey === '2') {
			// TODO this should not be necessary in a perfect world, if not used anymore, remove it
			tokens = document.getElementsByClassName('token')
			composeLetters(tokens)
		} else if (letterKey === 'Backspace') {
			if (answerType === 'word' || answerType === 'multiplechoice') {
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
			if (answerType === 'word' && letterKey !== ' ' && letterKey.length === 1) {
				if (letterKey !== '1' && letterKey !== '2' && letterKey !== '3') {
					wordCapturesLetters += letterKey
					typeShower(wordCapturesLetters)
				}
			}
			if (answerType === 'word' && letterKey === ' ') {
				submitWordOfWords(letters)
			} else if (answerType === 'multiplechoice') {
				if (letterKey.length === 1 && letterKey !== '1' && letterKey !== '2' && letterKey !== '3') {
					wordCapturesLetters += letterKey
					typeShower(wordCapturesLetters)
				}
			} else if (answerType === 'letter') {
				submitLetterOfLetters(letters, letterKey)
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
		ts.style.top = '50vh'
		ts.style.left = '50%'
		ts.style.transform = 'translateX(-50%)'
		ts.style.padding = '20px'
		ts.style.fontSize = '34px'
		ts.style.color = '#1e173c'
		ts.style.borderRadius = '12px'
		ts.style.fontWeight = 'bold'
		ts.style.zIndex = '999999'
		ts.style.transition = 'width .25s linear, height .25s linear, opacity .15s linear'
		ts.style.opacity = '.9'
		ts.style.boxShadow = '0 0 .2em rgba(0,0,0,.3)'
		document.querySelector('.ember-application').prepend(ts)
		ts.innerText = chars
	}
}

/**
 * @returns {'letter'|'word'|'multiplechoice'}
 */
function getAnswerType() {
	let totalchars = 0
	for (let token of tokens) totalchars += token.innerText.length
	if (totalchars === tokens.length) answerType = 'letter'
	if (totalchars > tokens.length) answerType = 'word'
	if (document.getElementById('option-0')) answerType = 'multiplechoice'
	return answerType
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
