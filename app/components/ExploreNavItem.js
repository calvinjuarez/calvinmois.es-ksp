import _AbstractComponent from './_AbstractComponent.js'


export default class ExploreNavItem extends _AbstractComponent {
	static templateURL = new URL('./ExploreNavItem.html', import.meta.url)

	get elements() {
		return {
			$item: '.js-explore-item',
		}
	}


	constructor(options) {
		super(...arguments)
	}


	onResolve() {
		if (this.data.isNested) {
			this.$elements.$item.classList.add('is-nested')
		}

		this.$slots.name.innerHTML = this.data.name
		this.$slots.value.innerHTML = this.data.isNested
			? '►'
			: JSON.stringify(this.data.value)
	}
}
