import _AbstractComponent from './_AbstractComponent.js'


export default class ExploreGroup extends _AbstractComponent {
	static templateURL = new URL('./ExploreGroup.html', import.meta.url)

	get elements() {
		return {
			$anchor: '.js-explore-link',
		}
	}


	onResolve() {
		this.$slots.name.innerHTML = this.data.name
	}
	onMount() {
		this.$elements.$anchor.addEventListener('click', e => e.preventDefault())
	}
}
