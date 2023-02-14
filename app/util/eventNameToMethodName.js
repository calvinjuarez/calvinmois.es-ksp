export default function eventNameToMethodName(eventName) {
	return `on:${eventName}`.replace(
		/:[a-zA-Z0-9]/g,
		match => match.replace(':', '').toUpperCase(),
	)
}
