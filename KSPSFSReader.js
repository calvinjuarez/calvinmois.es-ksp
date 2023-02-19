class KSPSFSReaderEvent extends CustomEvent {}


export default class KSPSFSReader extends EventTarget {
	#content = ''


	constructor(options) {
		super(...arguments)

		this.options = { ...options }
		this.data = {}
	}


	setContent(content) {
		this.#content = content

		return this
	}

	async parse(content) {
		if (typeof content === 'string') {
			this.setContent(content)
		}

		this.dispatchEvent(new KSPSFSReaderEvent('parse:start'), {
			detail: { content: this.#content },
		})

		const groupLineage = []

		let currentGroup = this.data
		let prevLine = ''

		this.#content.split(/[\r\n]+/).forEach(line => {
			line = line.trim()

			if (/=/.test(line)) {
				const [ key, value ] = line.split('=').map(s => s.trim())

				if (! currentGroup[key]) {
					currentGroup[key] = value
				}
				else {
					if (! Array.isArray(currentGroup[key])) {
						currentGroup[key] = [ currentGroup[key] ]
					}

					currentGroup[key].push(value)
				}
			}
			else if (/{/.test(line)) {
				groupLineage.push(prevLine)
				if (! currentGroup[prevLine]) {
					currentGroup[prevLine] = {}
					currentGroup = currentGroup[prevLine]
				}
				else {
					if (! Array.isArray(currentGroup[prevLine])) {
						currentGroup[prevLine] = [ currentGroup[prevLine] ]
					}

					const i = currentGroup[prevLine].push({}) - 1;

					groupLineage.push(i)
					currentGroup = currentGroup[prevLine][i]
				}
			}
			else if (/}/.test(line)) {
				let prevGroupName = groupLineage.pop()

				if (typeof prevGroupName === 'number') {
					prevGroupName = groupLineage.pop()
				}

				currentGroup = this.data
				groupLineage.forEach(group => {
					currentGroup = currentGroup[group]
				})
			}

			prevLine = line
		})

		this.dispatchEvent(new KSPSFSReaderEvent('parse'), {
			detail: { data: this.data },
		})

		return this.data
	}
}
