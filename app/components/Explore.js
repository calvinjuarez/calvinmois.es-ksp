import _AbstractComponent from './_AbstractComponent.js'

import ExploreList from './ExploreList.js'


export default class Explore extends _AbstractComponent {
	static templateURL = new URL('./Explore.html', import.meta.url)

	get childConstructors() {
		return {
			list: [ ExploreList ],
		}
	}
	get elementToChild() {
		return {
			$explore: 'list',
		}
	}
	get elements() {
		return {
			$explore: '#explore',
		}
	}


	populateNextNav(collection) {
		if (collection.depth < this.collection.length) {
			this.collection = [
				...this.collection.slice(0, collection.depth),
				collection
			]
		}
		else {
			this.collection = [ ...this.collection, collection ]
		}
	}
}
