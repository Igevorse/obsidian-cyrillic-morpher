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
		const morpher = new ws3Morpher({
			token: this.settings.morpherApiKey,
		});
		const result = await morpher.russian.declension(string);
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
