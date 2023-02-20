import _AbstractComponent from './components/_AbstractComponent.js'

import Upload from './components/Upload.js'
import Explore from './components/Explore.js'

import ExploreCollection from './data/ExploreCollection.js'
import ExploreListCollection from './data/ExploreListCollection.js'


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


	get _root() { return this }


	constructor(options, reader) {
		super(...arguments)

		this.reader = reader
	}


	#buildExploreSubCollection(level, depth=0) {
		const collection = new ExploreListCollection({ depth })

		Object.entries(level)
			.sort()
			.forEach(([ name, value ]) => {
				const isList = Array.isArray(value)
				const isGroup = ! isList && (typeof value === 'object')
				const data = {
					isGroup,
					isList,
					name,
					value,
				}

				if (data.isGroup) {
					data.value = this.#buildExploreSubCollection(value, 1 + depth)
				}

				collection.push(data)
			})

		collection.depth = depth

		return collection
	}

	#buildExploreCollection() {
		return new ExploreCollection(null, this.#buildExploreSubCollection(this.reader.data['GAME']))
	}

	async #handleUploadChange(e) {
		const { content } = e.detail

		const data = await this.reader.parse(content)

		this.children.explore.collection = this.#buildExploreCollection()
	}

	onMount() {
		this.children.upload.addEventListener('change', e => this.#handleUploadChange(e))
	}
}
