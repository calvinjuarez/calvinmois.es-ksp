import _AbstractComponent from './_AbstractComponent.js'


export default class ExploreItem extends _AbstractComponent {
	static templateURL = new URL('./ExploreItem.html', import.meta.url)


	onResolve() {
		this.$slots.name.innerHTML = this.data.name
		this.$slots.value.innerHTML = JSON.stringify(this.data.value, null, 4)
	}
}
