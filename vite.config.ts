import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }: { filename: string }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			csrf: {
				trustedOrigins: ['*']
			}
		} as any)
	],
	ssr: {
		noExternal: ['svelte-chartjs', 'chart.js']
	},
	resolve: {
		conditions: ['browser', 'development']
	},
	server: {
		allowedHosts: true
	},
	test: {
		server: {
			deps: {
				inline: [/svelte/]
			}
		},
		include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
		environment: 'jsdom',
		env: {
			SSR: ''
		},
		resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json-summary', 'json'],
			include: ['src/lib/utils/**/*.{js,ts}', 'src/lib/actions/**/*.{js,ts}', 'src/lib/i18n.ts']
		}
	}
});
