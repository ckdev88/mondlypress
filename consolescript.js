// TODO add detection, only activate if useful
// TODO add Check detection and click
// TODO add Backspace detection and click
// TODO add some timeout or debounce per key press

/** Array of letters in the page */
let letters = []

/** Stack to enable backspace/undo */
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
	ç: 'c',
	ë: 'e',
	é: 'e',
	é: 'e',
	ē: 'e',
	ê: 'e',
	è: 'e',
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
 * @returns {void}
 */
function composeLetters(tokens) {
	for (let token of tokens) {
		const letterObj = {
			id: token.getAttribute('id'),
			letter: simplifyToken(token.innerText),
		}
		letters.push(letterObj)
	}
}

/**
 * Main function where keys are pressed and buttons get pushed
 * @param letterKey {string}
 * @returns {void}
 */
function checkKeyHit(letterKey) {
	if (letters.length < 1) composeLetters(tokens)
	/** prevent javascript from getting ahead of itself */
	let duplicate = false
	if (letters.length > 0 && duplicate === false) {
		for (let i = 0; i < letters.length; i++) {
			duplicate = true
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
		if (letterKey === 'enter') {
			const button = document.querySelector('.quiz-action .btn')
			if (button) button.click()
			duplicate = true
		} else if (letterKey === 'backspace') {
			const button = document.querySelector('.token-deselect .btn')
			if (button) button.click()
			const redo = lettersRemoved.splice(-1, 1)
			if (lettersRemoved.length > 0) letters.push(redo[0])
			duplicate = true
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
	if (document.querySelector('.quiz-instruction-wrapper').id !== currentQuizId) {
		letters = []
		lettersRemoved = []
		tokens = document.getElementsByClassName('token')
		currentQuizId = document.querySelector('.quiz-instruction-wrapper').id
	}
	let letterKey = event.key.toLowerCase()
	checkKeyHit(letterKey)
})
