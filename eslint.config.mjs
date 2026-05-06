import pluginVue from 'eslint-plugin-vue';
import {
	defineConfigWithVueTs,
	vueTsConfigs,
} from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
	pluginVue.configs['flat/recommended'],
	vueTsConfigs.recommendedTypeChecked,
	{
		rules: {
			'vue/html-indent': ['error', 'tab'], // Default is 2 spaces, but we use tabs for indentation
			'vue/no-v-html': 'off', // Required for news content and servers names
			'vue/max-attributes-per-line': 'off', // Prettier handles this
			'vue/singleline-html-element-content-newline': 'off', // Prettier handles this
			'vue/html-self-closing': 'off', // Prettier handles this
		},
	},
);
