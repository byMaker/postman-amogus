import { browser } from '$app/environment';
import { persistedState } from '$lib/utils/persistedStore.svelte';

class SettingsState {
	#languageState = persistedState('amogus_lang', 'auto');
	#lastActiveTabState = persistedState('amogus_tab', 'general');
	#fontFamilyState = persistedState('amogus_font', 'balsamiq');

	get language() {
		return this.#languageState.value;
	}

	set language(val: string) {
		this.#languageState.value = val;
	}

	get lastActiveTab() {
		return this.#lastActiveTabState.value;
	}

	set lastActiveTab(val: string) {
		this.#lastActiveTabState.value = val;
	}

	get fontFamily() {
		return this.#fontFamilyState.value;
	}

	set fontFamily(val: string) {
		this.#fontFamilyState.value = val;
	}

	get computedLanguage() {
		if (this.language === 'auto') {
			if (browser && navigator.language.startsWith('ru')) {
				return 'ru';
			}
			return 'en';
		}
		return this.language;
	}
}

export const settings = new SettingsState();
