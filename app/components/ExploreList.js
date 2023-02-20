import _AbstractComponent from './_AbstractComponent.js'

import ExploreGroup from './ExploreGroup.js'
import ExploreItem from './ExploreItem.js'


export default class ExploreList extends _AbstractComponent {
	static templateURL = new URL('./ExploreList.html', import.meta.url)

	get childConstructors() {
		return {
			items: [ options => {
				console.log()

				return options.data.isGroup
					? ExploreGroup
					: ExploreItem
			} ],
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
}
