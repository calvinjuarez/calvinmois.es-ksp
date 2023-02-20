import eventNameToMethodName from './eventNameToMethodName.js'


export default function fireWithMethod(context, target, EventConstructor, event, options) {
	const method = eventNameToMethodName(event)
	const e = new EventConstructor(event, options)

	if (typeof context[method] === 'function') {
		context[method](e)
	}

	target.dispatchEvent(e)
}
