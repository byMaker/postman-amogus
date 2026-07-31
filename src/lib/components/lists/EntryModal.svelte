<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import { t } from '$lib/i18n';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/state/toast.svelte';

	let { 
		show = $bindable(false),
		isEditMode = false,
		activeTableKey,
		currentEntry = $bindable(),
		targetLabel,
		validationPattern,
		validationTitle,
		onSuccess
	} = $props<{
		show: boolean;
		isEditMode: boolean;
		activeTableKey: string;
		currentEntry: { id: string; target: string; description: string; active: boolean };
		targetLabel: string;
		validationPattern: string;
		validationTitle: string;
		onSuccess?: () => void;
	}>();
</script>

<Modal bind:show={show} title={isEditMode ? t('modal.edit') : t('modal.add')}>
	<form method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && (result as any).data?.success) {
				toast.success(isEditMode ? t('toast.saved') : t('toast.created'));
				show = false;
				if (onSuccess) onSuccess();
			} else {
				toast.error((result as any).data?.error || t('toast.failed_save'));
			}
			update();
		};
	}} class="space-y-5">
		
		<input type="hidden" name="table" value={activeTableKey} />
		{#if isEditMode}
			<input type="hidden" name="id" value={currentEntry.id} />
		{/if}

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">{targetLabel}</span></div>
			<ValidatedInput name="target" bind:value={currentEntry.target} required 
				pattern={validationPattern}
				title={validationTitle}
				className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" />
		</div>

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">{t('form.description')}</span></div>
			<input type="text" name="description" bind:value={currentEntry.description} class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" />
		</div>

		<label class="cursor-pointer flex items-center gap-3 pt-2">
			<input type="checkbox" name="active" bind:checked={currentEntry.active} class="toggle toggle-amogus" />
			<span class="font-bold text-slate-700">{t('form.active')}</span>
		</label>

		<div class="modal-action mt-8 pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0">
			<button type="button" onclick={() => show = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md w-full sm:w-auto">
				{t('btn.save')}
			</button>
		</div>
	</form>
</Modal>
