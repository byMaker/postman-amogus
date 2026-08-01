<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	let bgImage = $derived.by(() => {
		const path = $page.url.pathname;
		if (path.startsWith("/mailboxes")) return "url(/scene02.png)";
		if (path.startsWith("/aliases")) return "url(/scene03.png)";
		if (path.startsWith("/domains")) return "url(/scene04.png)";
		if (path.startsWith("/blacklists")) return "url(/scene05.png)";
		if (path.startsWith("/whitelists")) return "url(/scene01.png)";
		return "";
	});

	let isVisible = $derived(
		$page.url.pathname !== "/" && 
		$page.url.pathname !== "/analytics" && 
		bgImage !== ""
	);
</script>

{#if isVisible}
	<div class="grid w-full">
		{#key bgImage}
			<div
				in:fade={{ duration: 150, delay: 150 }}
				out:fade={{ duration: 0 }}
				class="col-start-1 row-start-1 mascot-bg w-full h-[250px] bg-no-repeat bg-right-bottom bg-contain mt-0 md:mt-8 relative z-0"
				style="background-image: {bgImage};"
			></div>
		{/key}
	</div>
{/if}
