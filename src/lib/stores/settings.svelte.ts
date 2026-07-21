import { browser } from '$app/environment';

class SettingsState {
	#language = $state('auto');
	#lastActiveTab = $state('general');
	#fontFamily = $state('balsamiq');

	constructor() {
		if (browser) {
			const storedLang = localStorage.getItem('amogus_lang');
			if (storedLang) this.#language = storedLang;

			const storedTab = localStorage.getItem('amogus_tab');
			if (storedTab) this.#lastActiveTab = storedTab;

			const storedFont = localStorage.getItem('amogus_font');
			if (storedFont) this.#fontFamily = storedFont;
		}
	}

	get language() {
		return this.#language;
	}

	set language(val: string) {
		this.#language = val;
		if (browser) localStorage.setItem('amogus_lang', val);
	}

	get lastActiveTab() {
		return this.#lastActiveTab;
	}

	set lastActiveTab(val: string) {
		this.#lastActiveTab = val;
		if (browser) localStorage.setItem('amogus_tab', val);
	}

	get fontFamily() {
		return this.#fontFamily;
	}

	set fontFamily(val: string) {
		this.#fontFamily = val;
		if (browser) localStorage.setItem('amogus_font', val);
	}

	get computedLanguage() {
		if (this.#language === 'auto') {
			if (browser && navigator.language.startsWith('ru')) {
				return 'ru';
			}
			return 'en';
		}
		return this.#language;
	}
}

export const settings = new SettingsState();
