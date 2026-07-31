<script lang="ts">
	import { onMount } from 'svelte';
	import { ChatTeardropText, X } from 'phosphor-svelte';
	import { t } from '$lib/i18n';
	import { PLACEHOLDERS } from '$lib/constants/placeholders';

	let { comment = $bindable(''), title = '', onsave } = $props<{
		comment: string;
		title?: string;
		onsave?: (newComment: string) => void;
	}>();

	let isOpen = $state(false);
	let popoverRef = $state<HTMLDivElement | null>(null);
	let tempComment = $state(comment);
	let popUpwards = $state(false);

	function toggle() {
		if (!isOpen) {
			tempComment = comment;
			if (popoverRef) {
				const rect = popoverRef.getBoundingClientRect();
				// If within 250px of the bottom of the viewport, pop upwards instead
				popUpwards = rect.bottom > window.innerHeight - 250;
			}
		}
		isOpen = !isOpen;
	}

	function save() {
		comment = tempComment;
		isOpen = false;
		if (onsave) onsave(comment);
	}

	function handleClickOutside(event: MouseEvent) {
		if (isOpen && popoverRef && !popoverRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	});
</script>

<div class="relative inline-flex" bind:this={popoverRef}>
	<!-- Trigger button -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full transition-colors {comment ? 'text-amogus-blue bg-blue-50 hover:bg-amogus-blue hover:text-white' : 'text-slate-400 hover:text-amogus-dark hover:bg-slate-100'}"
		title={comment || t('comment.add')}
		onclick={toggle}
	>
		<ChatTeardropText size={18} weight={comment ? "fill" : "regular"} />
	</div>

	{#if isOpen}
		<!-- Mobile Backdrop / Desktop Container -->
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:backdrop-blur-none sm:bg-transparent sm:p-0 sm:block sm:absolute sm:right-0 {popUpwards ? 'sm:bottom-full sm:mb-2' : 'sm:top-full sm:mt-2'} sm:inset-auto sm:z-[60] w-full sm:w-72 h-full sm:h-auto">
			
			<!-- Mobile Click-outside overlay (invisible) -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="absolute inset-0 sm:hidden" onclick={() => isOpen = false}></div>

			<!-- Popover/Modal Content -->
			<div class="relative w-full max-w-sm sm:max-w-none bg-white border border-slate-200 rounded-3xl shadow-xl p-5 sm:p-4 flex flex-col gap-3 mx-auto">
				<div class="flex justify-between items-center mb-2">
					<h3 class="text-2xl text-amogus-dark">{title || t('comment.title')}</h3>
					<button aria-label="Close" onclick={() => isOpen = false} class="text-slate-400 hover:text-rose-500 transition-colors p-1 bg-slate-50 hover:bg-rose-50 rounded-full">
						<X size={16} weight="bold" />
					</button>
				</div>
				<textarea 
					class="textarea textarea-bordered focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 text-sm resize-none h-24 sm:h-20 w-full rounded-2xl bg-slate-50 transition-all"
					bind:value={tempComment}
				></textarea>
				<div class="flex justify-end gap-3 mt-1 items-center">
					<button class="hidden sm:block text-xs text-slate-500 hover:text-slate-700 transition-colors font-bold px-3 py-2 rounded-full hover:bg-slate-100" onclick={() => isOpen = false}>{t('btn.cancel')}</button>
					<button class="bg-amogus-blue hover:bg-amogus-brown text-white font-bold py-2 px-5 rounded-full text-xs shadow-md transition-all w-full sm:w-auto" onclick={save}>{t('btn.save')}</button>
				</div>
			</div>
		</div>
	{/if}
</div>
