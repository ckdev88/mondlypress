// TODO add detection, only activate if useful
// TODO add Check detection and click
// TODO add Backspace detection and click
const letters = []
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
function composeLetters() {
	const tokens = document.getElementsByClassName('token')
	for (let token of tokens) {
		const letterObj = {
			id: token.getAttribute('id'),
			letter: simplifyToken(token.innerText),
		}
		letters.push(letterObj)
	}
}
function checkKeyHit(letterKey) {
	if (letters.length < 1) composeLetters()
	/** prevent javascript from getting ahead of itself */
	let duplicate = false
	if (letters.length > 0 && duplicate === false) {
		for (let i = 0; i < letters.length; i++) {
			if (letters[i].letter === letterKey) {
				document.getElementById(letters[i].id).click()
				letters.splice(i, 1)
				duplicate = true
				console.log('ring')
				break
			}
		}
	}
}

/**
 * Check the pressed key with the word (letters array)
 * @param letterKey {string}
 * @returns {void}
 */
document.addEventListener('keyup', (event) => {
	event.preventDefault()
	let letterKey = event.key.toLowerCase()
	checkKeyHit(letterKey)
})
