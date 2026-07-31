<script lang="ts">
	let { children } = $props();
</script>

<div class="rounded-[32px] border border-slate-200 shadow-sm bg-white animate-in fade-in duration-300 relative">
	<div class="absolute top-0 left-0 right-0 h-[57px] bg-slate-50 rounded-t-[32px] border-b border-slate-200 hidden lg:block"></div>
	<table class="w-full text-left text-sm block lg:table relative z-10">
		{@render children?.()}
	</table>
</div>
