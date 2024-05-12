import { Notice } from 'obsidian';
import { CyrillicMorperSettings } from './settings';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ws3Morpher = require('morpher-ws3-client');

interface Morpher {
	generateCases(string: string): Promise<string[]>;
}

export class CyrillicMorpher implements Morpher {
	settings: CyrillicMorperSettings;

	constructor(settings: CyrillicMorperSettings) {
		this.settings = settings;
	}

	async generateCases(string: string, plural = false): Promise<string[]> {
		const client = new ws3Morpher({
			token: this.settings.morpherApiKey,
		});
		let morpher = client[this.settings.morpherLanguage];

		let result: any = null;
		try {
			result = await morpher.declension(string);
		}
		catch(e) {
			if (e.message === 'Failed to fetch') {
				new Notice('Please check if your token is correct!');
			}
			else {
				new Notice(e.message);
			}
			return [];
		}

		// TODO: move to settings
		const cases = [
			'accusative',
			'dative',
			'genitive',
			'instrumental',
			'prepositional',
		];
		let aliases = cases.map((caseName) => {
			return result[caseName];
		});
		if (plural) {
			aliases = aliases.concat(
				cases.map((caseName) => {
					return result['plural'][caseName];
				})
			);
		}
		return [...new Set<string>(aliases)];
	}
}
