import _AbstractComponent from './_AbstractComponent.js'


export default class Upload extends _AbstractComponent {
	static templateURL = new URL('./Upload.html', import.meta.url)

	#reader = new FileReader()

	get elements() {
		return {
			$form: '#upload',
			$file: '#upload-file',
			$paste: '#upload-paste',
		}
	}


	constructor() {
		super(...arguments)

		this.#initReader()
	}


	#handleFileChange(e) {
		this.#reader.readAsText(this.$elements.$file.files.item(0))
	}

	#initReader() {
		this.#reader.onload = e => {
			this.dispatchEvent(new CustomEvent('change', {
				detail: { content: e.target.result },
			}))
		}
	}

	onResolve() {
		this.$elements.$file.addEventListener('change', e => this.#handleFileChange(e))
	}
}
