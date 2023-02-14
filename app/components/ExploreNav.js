import _AbstractComponent from './_AbstractComponent.js'

import ExploreNavItem from './ExploreNavItem.js'


export default class ExploreNav extends _AbstractComponent {
	static templateURL = new URL('./ExploreNav.html', import.meta.url)

	get childConstructors() {
		return {
			items: [ ExploreNavItem ],
		}
	}
	get elementToChild() {
		return {
			$items: 'items',
		}
	}
	get elements() {
		return {
			$items: '.js-explore-items',
		}
	}


	constructor(options) {
		super(...arguments)
	}
}
