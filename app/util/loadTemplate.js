import { BASE, ROOT } from '../_const.js'


export default async function loadMarkup(url) {
	return fetch(url)
		.then(async response => {
			const $template = document.createElement('template')
			const markup = await response.text()

			$template.innerHTML = markup

			return $template.content
		})
		.catch(async response => {
			console.error(`failed to load template at "${path}"`)
		})
}
