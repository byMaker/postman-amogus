<script lang="ts">
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { NotePencil, Trash } from 'phosphor-svelte';
	import { t } from '$lib/i18n';

	let { 
		onEdit,
		onDelete,
		isLast = false,
		className = ''
	} = $props<{
		onEdit?: () => void;
		onDelete?: () => void;
		isLast?: boolean;
		className?: string;
	}>();
</script>

<td class="flex justify-between items-center lg:table-cell px-2 py-3 lg:px-6 lg:py-5 lg:text-right {isLast ? 'lg:rounded-br-[32px]' : ''} {className}">
	<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.actions')}</span>
	<div class="flex justify-end gap-3 transition-opacity">
		{#if onEdit}
			<Tooltip text={t('btn.edit')} position="top">
				<button onclick={onEdit} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors">
					<NotePencil size={24} weight="fill" />
				</button>
			</Tooltip>
		{/if}
		{#if onDelete}
			<Tooltip text={t('btn.delete')} position="top">
				<button onclick={onDelete} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors">
					<Trash size={24} weight="fill" />
				</button>
			</Tooltip>
		{/if}
	</div>
</td>
