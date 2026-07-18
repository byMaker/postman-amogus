<script lang="ts">
	import { WarningCircle } from 'phosphor-svelte';
	
	let {
		value = $bindable(''),
		name = '',
		placeholder = '',
		pattern = undefined,
		title = '',
		required = false,
		readonly = false,
		type = 'text',
		className = ''
	} = $props<{
		value?: string;
		name?: string;
		placeholder?: string;
		pattern?: string;
		title?: string;
		required?: boolean;
		readonly?: boolean;
		type?: string;
		className?: string;
	}>();

	let inputRef = $state<HTMLInputElement | null>(null);
	let errorMsg = $state('');
	let showTooltip = $state(false);

	function validate() {
		if (readonly || !inputRef) {
			errorMsg = '';
			showTooltip = false;
			return true;
		}

		if (required && !value.trim()) {
			errorMsg = 'This field is required';
			return false;
		}

		if (pattern && value) {
			const regex = new RegExp(pattern);
			if (!regex.test(value)) {
				errorMsg = title || 'Invalid format';
				return false;
			}
		}

		errorMsg = '';
		showTooltip = false;
		return true;
	}

	function handleInput() {
		if (errorMsg) {
			validate();
		}
	}

	function handleInvalid(e: Event) {
		e.preventDefault(); // Prevent standard browser popup
		validate();
		showTooltip = true;
	}
</script>

<div class="relative w-full">
	<input
		bind:this={inputRef}
		{type}
		{name}
		bind:value
		{placeholder}
		{pattern}
		{required}
		{readonly}
		oninput={handleInput}
		oninvalid={handleInvalid}
		onblur={() => showTooltip = false}
		onfocus={() => { if (errorMsg) showTooltip = true; }}
		class="{className} {errorMsg ? '!border-rose-500 !ring-rose-200' : ''}"
	/>
	
	{#if errorMsg && showTooltip}
		<div class="absolute z-50 bottom-full left-0 mb-2 w-max max-w-xs animate-in slide-in-from-bottom-2 fade-in duration-200">
			<div class="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-2xl shadow-lg flex gap-3 items-start relative">
				<WarningCircle size={20} weight="fill" class="text-rose-500 shrink-0 mt-0.5" />
				<div class="flex flex-col gap-0.5">
					<span class="font-bold">Invalid Format</span>
					<span>{errorMsg}</span>
				</div>
				<!-- Arrow -->
				<div class="absolute -bottom-2 left-6 w-4 h-4 bg-rose-50 border-b border-r border-rose-200 transform rotate-45"></div>
			</div>
		</div>
	{/if}
</div>
