import _AbstractCollection from './_AbstractCollection.js'


export default class ExploreListCollection extends _AbstractCollection {
	#depth = 0

	get depth() { return this.#depth }
	set depth(depth) {
		if (typeof depth !== 'number'
		||  ! Number.isFinite(depth)) {
			throw new TypeError(`depth must be a finite number`)
		}

		this.#depth = depth
	}


	constructor() {
		super(...arguments)

		if (('depth' in this.options)) {
			this.depth = this.options.depth
		}
	}
}
