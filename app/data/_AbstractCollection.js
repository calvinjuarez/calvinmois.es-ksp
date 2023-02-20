import fireWithMethod from '../util/fireWithMethod.js'


class CollectionLifecycleEvent extends CustomEvent {}


export default class _AbstractCollection extends Array {
	get emitter() { return new EventTarget() }


	constructor(options, ...rest) {
		super(...rest)

		this.options = Object.assign({}, options)
	}


	fireWithMethod(event, options) {
		fireWithMethod(this, this.emitter, CollectionLifecycleEvent, event, options)
	}
}

['push', 'pop', 'shift', 'unshift'].forEach(methodName => {
	const method = {
		[methodName]() {
			this.fireWithMethod(
				`${methodName}:start`,
				{ detail: { args: [ ...arguments ] } },
			)
			this.fireWithMethod(
				'update:start',
				{ detail: { method: methodName, args: [ ...arguments ] } },
			)

			const result = Array.prototype[methodName].apply(this, arguments)

			this.fireWithMethod(
				`${methodName}`,
				{ detail: { args: [ ...arguments ] } },
			)
			this.fireWithMethod(
				'update',
				{ detail: { method: methodName, args: [ ...arguments ] } },
			)

			return result
		}
	}[methodName]

	_AbstractCollection.prototype[methodName] = method
})
