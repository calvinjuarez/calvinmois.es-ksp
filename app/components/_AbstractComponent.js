import loadTemplate from '../util/loadTemplate.js'
import eventNameToMethodName from '../util/eventNameToMethodName.js'


class ComponentTemplateError extends Error {}
class ComponentChildError extends Error {}
class ComponentMountError extends Error {}
class ComponentChildMountError extends Error {}

class ComponentLifecycleEvent extends CustomEvent {}

class ComponentChildSet extends Set {}


/**
 * Base component class that extends the native EventTarget class.
 *
 * @param {object}  options
 * @param {Element} [options.$mount]  An element to which to mount the component.
 */
export default class _AbstractComponent extends EventTarget {
	#$doc = null

	#isMounted = false

	#loadResolve = () => {}
	#loadReject = () => {}

	children = {}

	get childConstructors() { return {} }

	get elementToChild() { return {} }

	$elements = {}
	get elements() { return {} }

	$slots = {}


	#collection = []
	get collection() { return this.#collection }
	set collection(collection) {
		this.#collection = collection

		this.dispatchEvent(new CustomEvent('collection:change'))
		this.render()
	}

	#$mount = null
	get $mount() { return this.#$mount }
	set $mount($mount) {
		if (! ($mount instanceof Element)) {
			throw new ComponentMountError(`'$mount' must be an element`)
		}

		this.#$mount = $mount
	}


	constructor(options) {
		super(...arguments)

		this.options = { ...options }

		this.#fireLifecycle('construct:start')

		this.#initLoadPromise()

		this.#templateValidate()
		this.#templateLoad()

		this.#buildChildren()

		if ('$mount' in this.options) {
			this.mount(this.options.$mount)
		}

		if ('collection' in this.options) {
			this.collection = this.options.collection
		}
		if ('data' in this.options) {
			this.data = this.options.data
		}

		this.#fireLifecycle('construct')
	}


	#buildChildren() {
		const childConstructorsEntries = Object.entries(this.childConstructors)

		if (childConstructorsEntries.length < 1) { return }

		childConstructorsEntries.forEach(([ childKey, constructor ]) => {
			if (Array.isArray(constructor)) {
				this.#buildRepeatableChild(childKey, constructor[0])
			}
			else {
				this.#buildSingleChild(childKey, constructor)
			}
		})
	}

	#buildRepeatableChild(childKey, constructor) {
		if (constructor.length > 1) {
			throw new ComponentChildError(`Cannot have multiple constructors in childConstructor repeatable syntax`)
		}

		const childSet = this.children[childKey] = new ComponentChildSet()

		this.#collection.forEach((data, index) => {
			if (Array.isArray(data)) {
				childSet.add(new constructor({ collection: data, index }))
			}
			else {
				childSet.add(new constructor({ data, index }))
			}
		})
	}

	#buildSingleChild(childKey, constructor) {
		if (typeof constructor !== 'function') {
			throw new ComponentChildError(`Invalid constructor for child "${childKey}"`)
		}

		this.children[childKey] = new constructor()
	}

	#fireLifecycle(event, options) {
		const method = eventNameToMethodName(event)
		const e = new ComponentLifecycleEvent(event, options)

		if (typeof this[method] === 'function') {
			this[method](e)
		}

		this.dispatchEvent(e)
	}

	#initLoadPromise() {
		/** @var {Promise} */
		this.load = new Promise((resolve, reject) => {
			/** @var {function} */
			this.#loadResolve = resolve
			/** @var {function} */
			this.#loadReject = reject
		})
			.then(response => {
				this.#fireLifecycle('load', { detail: { response } })

				return response
			})
			.catch(error => {
				this.#fireLifecycle('load:fail', { detail: { error } })

				return error
			})
	}

	#mountChild(child, $element) {
		if (! (child instanceof _AbstractComponent)) {
			throw new ComponentChildMountError(`Cannot mount invalid child "${childKey}"`)
		}
		if (! ($element instanceof Element)) {
			throw new ComponentChildMountError(`Cannot mount child to invalid element "${elementKey}"`)
		}

		child.mount($element)
	}

	#mountChildren() {
		const elementToChildEntries = Object.entries(this.elementToChild)

		if (elementToChildEntries.length < 1) { return }

		elementToChildEntries.forEach(([ elementKey, childKey ]) => {
			const child = this.children[childKey]
			const $element = this.$elements[elementKey]

			if (child instanceof ComponentChildSet) {
				// wait 'til they're all loaded so they don't render out of order
				Promise.allSettled([ ...child ].map(c => c.load))
					.then(() => {
						child.forEach(_child => {
							this.#mountChild(_child, $element)
						})
					})
			}
			else {
				this.#mountChild(child, $element)
			}
		})
	}

	#resolve() {
		this.#fireLifecycle('resolve:start')

		this.#resolveElements()
		this.#resolveSlots()

		this.#fireLifecycle('resolve')
	}

	#resolveElements() {
		const elementsEntries = Object.entries(this.elements)

		if (elementsEntries.length < 1) { return }

		elementsEntries.forEach(([ name, selector ]) => {
			const $element = this.$doc.querySelector(selector)

			if ($element instanceof Element) {
				this.$elements[name] = $element
			}
		})
	}

	#resolveSlots() {
		const $slots = this.$doc.querySelectorAll('slot')

		if ($slots.length < 1) { return }

		$slots.forEach($slot => {
			this.$slots[$slot.name] = $slot
		})
	}

	#templateValidate() {
		if (! this.constructor.templateURL) {
			throw new ComponentTemplateError(`${this.name}: Components must specify a static templateUrl`)
		}
		try {
			const url = new URL(this.constructor.templateURL)
		}
		catch (e) {
			throw new ComponentTemplateError(`${this.name}: Specified templateUrl is not a valid URL (${e.message})`)
		}
	}

	#templateLoad() {
		this.#fireLifecycle('load:start')

		loadTemplate(this.constructor.templateURL)
			.then($doc => {
				/** @var {DocumentFragment} */
				this.#$doc = $doc
				this.#loadResolve()
			})
			.catch(() => this.#loadReject())
	}

	mount($mount) {
		this.$mount = $mount

		this.#fireLifecycle('mount:start')

		this.load.then(() => {
			this.$doc = this.#$doc.cloneNode(true)

			this.#buildChildren()

			this.#resolve()

			this.$mount.append(this.$doc)

			this.#mountChildren()

			this.#fireLifecycle('mount')

			this.#isMounted = true
		})
	}

	render() {
		if (! this.#isMounted) { return }

		while (this.$mount.firstChild) {
			this.$mount.removeChild(this.$mount.lastChild)
		}

		this.mount(this.$mount)
	}
}
