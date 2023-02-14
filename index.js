import App from './app/App.js'
import KSPSFSReader from './KSPSFSReader.js'


window.app = new App(
	{ $mount: document.documentElement.querySelector('main') },
	new KSPSFSReader(),
)
