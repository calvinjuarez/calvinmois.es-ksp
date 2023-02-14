import _AbstractComponent from './components/_AbstractComponent.js'

import Upload from './components/Upload.js'
import Explore from './components/Explore.js'


/**
 * @param {object}  options
 * @param {Element} [options.$mount]  An element to which to mount the app.
 * @param {object}  reader  The tool to use to read the save file.
 */
export default class App extends _AbstractComponent {
	static templateURL = new URL('./App.html', import.meta.url)


	get childConstructors() {
		return {
			upload: Upload,
			explore: Explore,
		}
	}
	get elementToChild() {
		return {
			$input: 'upload',
			$output: 'explore',
		}
	}
	get elements() {
		return {
			$input: '#input',
			$output: '#output',
		}
	}


	constructor(options, reader) {
		super(...arguments)

		this.reader = reader
	}


	#buildExploreSubCollection() {
		const collection = []

		Object.entries(this.reader.data['GAME'])
			.sort()
			.forEach(([ name, value ]) => {
				const data = {
					name,
					value,
				}

				if (typeof value === 'object') {
					data.isNested = true
				}

				collection.push(data)
			})

		return collection
	}

	#buildExploreCollection() {
		return [ this.#buildExploreSubCollection() ]
	}

	async #handleUploadChange(e) {
		const { content } = e.detail

		await this.reader.parse(content)

		this.children.explore.collection = this.#buildExploreCollection()
	}

	onMount() {
		this.children.upload.addEventListener('change', e => this.#handleUploadChange(e))
	}
}
