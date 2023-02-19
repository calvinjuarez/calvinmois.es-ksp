import _AbstractComponent from './_AbstractComponent.js'

import ExploreList from './ExploreList.js'


export default class Explore extends _AbstractComponent {
	static templateURL = new URL('./Explore.html', import.meta.url)

	get childConstructors() {
		return {
			nav: [ ExploreList ],
		}
	}
	get elementToChild() {
		return {
			$explore: 'nav',
		}
	}
	get elements() {
		return {
			$explore: '#explore',
		}
	}


	constructor() {
		super(...arguments)
	}
}
