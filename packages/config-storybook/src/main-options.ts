import type { StorybookConfig } from '@storybook/sveltekit';

export const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs'],
	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},
	staticDirs: ['../static'],
	async viteFinal(config) {
		// Storybook 9's Svelte docgen plugin stalls on .svelte story imports in this SDK.
		config.plugins = (config.plugins || []).filter(
			(plugin) =>
				!(
					typeof plugin === 'object' &&
					plugin !== null &&
					!Array.isArray(plugin) &&
					'name' in plugin &&
					plugin.name === 'storybook:svelte-docgen-plugin'
				),
		);
		return config;
	},
};
