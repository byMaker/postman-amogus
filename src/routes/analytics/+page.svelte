<script module lang="ts">
	import { formatMb } from '$lib/i18n';

	// Helpers
	const formatBytes = (mb: number) => formatMb(mb);
</script>

<script lang="ts">
	import type { PageData } from './$types';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
	import { Doughnut, Bar } from 'svelte-chartjs';
	import { goto } from '$app/navigation';
	import { ChartPieSlice } from 'phosphor-svelte';
	import { t, formatDate } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { 
				position: 'right' as const,
				labels: {
					usePointStyle: true,
					pointStyle: 'circle'
				}
			}
		}
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false }
		},
		scales: {
			y: { beginAtZero: true, grid: { display: false }, border: { display: false } },
			x: { grid: { display: false }, border: { display: false } }
		}
	};

	// Register Chart.js elements
	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);
	
	ChartJS.defaults.plugins.tooltip.callbacks.label = function(context: any) {
		let label = context.dataset.label || context.label || '';
		if (label) {
			label += ': ';
		}
		if (context.raw !== null) {
			label += formatBytes(context.raw as number);
		}
		return ' ' + label;
	};

	const generateColors = (count: number) => {
		const colors = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#6366f1', '#14b8a6', '#ec4899', '#84cc16', '#64748b'];
		return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
	};

	const handleMailboxChange = (value: string) => {
		// Close dropdown by blurring active element
		if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
		if (value === 'all') {
			goto('/analytics');
		} else {
			goto(`/analytics?email=${encodeURIComponent(value)}`);
		}
	};

	// 1. Folders Doughnut Chart Data
	const folderLabels = $derived(data.folders.map(f => f.folderName));
	const folderData = $derived(data.folders.map(f => f.totalSize));
	const folderColors = $derived(generateColors(data.folders.length));

	const doughnutChartData = $derived({
		labels: folderLabels,
		datasets: [
			{
				data: folderData,
				backgroundColor: folderColors,
				hoverBackgroundColor: folderColors.map(c => c + 'CC'),
				borderWidth: 2,
				borderColor: '#ffffff',
				borderRadius: 12,
				spacing: 4,
				hoverOffset: 4
			}
		]
	});

	// 2. Attachments Bar Chart Data
	const attachmentLabels = $derived(data.attachments.map(a => a.extension.toUpperCase() || 'UNKNOWN'));
	const attachmentData = $derived(data.attachments.map(a => a.totalSize));
	const attachmentColors = $derived(generateColors(data.attachments.length));

	const barChartData = $derived({
		labels: attachmentLabels,
		datasets: [
			{
				label: 'Size (MB)',
				data: attachmentData,
				backgroundColor: attachmentColors,
				borderRadius: 9999,
				borderSkipped: false
			}
		]
	});

</script>

<svelte:head>
	<title>{t('analytics.title')} - Postman Amogus</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<ChartPieSlice size={36} weight="fill" class="text-indigo-500" />
				{t('analytics.title')}
			</h2>
			<p class="text-slate-500 mt-1">
				{data.currentEmail ? t('analytics.desc.single') + data.currentEmail : t('analytics.desc.all')}
				{#if data.lastRunDate}
					({formatDate(data.lastRunDate, { dateStyle: 'short', timeStyle: 'short' })})
				{/if}
			</p>
		</div>
		<div class="w-full sm:w-auto">
			<div class="dropdown dropdown-end w-full sm:w-auto">
				<div tabindex="0" role="button" class="btn w-full sm:w-auto flex justify-between sm:justify-center bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{data.currentEmail || t('analytics.all_mailboxes')}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-3xl min-w-full w-max max-h-[60vh] overflow-y-auto mt-2 border border-slate-100 font-sans text-slate-600 flex-nowrap">
					<li>
						<button 
							onclick={() => handleMailboxChange('all')} 
							class="whitespace-nowrap {!data.currentEmail ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}"
						>
							<span class="w-4 inline-block">{!data.currentEmail ? '✓' : ''}</span> {t('analytics.all_mailboxes')}
						</button>
					</li>
					<div class="divider my-0"></div>
					{#each data.availableMailboxes as mailbox (mailbox)}
						<li>
							<button 
								onclick={() => handleMailboxChange(mailbox)} 
								class="whitespace-nowrap {data.currentEmail === mailbox ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}"
							>
								<span class="w-4 inline-block text-amogus-blue">{data.currentEmail === mailbox ? '✓' : ''}</span> {mailbox}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Top Stats Row -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="stat bg-white shadow-sm rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">{t('analytics.stats.storage')}</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 truncate">
				{formatBytes(data.summary.totalSize)}
			</div>
			{#if data.summary.totalQuotaMb > 0}
				<div class="text-slate-500 text-xl font-bold mt-1 truncate">
					{formatBytes(data.summary.totalQuotaMb)}
				</div>
			{/if}
			<div class="stat-desc text-slate-400 mt-2">{t('analytics.stats.storage.desc')}</div>
		</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="stat bg-white shadow-sm rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">{t('analytics.stats.messages')}</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 truncate">{data.summary.totalMessages.toLocaleString()}</div>
			<div class="text-slate-500 text-sm font-bold mt-2 truncate flex items-center gap-2">
				<span>{data.summary.totalRead.toLocaleString()} <span class="text-slate-400 font-normal">{t('analytics.stats.read')}</span></span>
				<span class="text-slate-300">•</span> 
				<span>{data.summary.totalUnread.toLocaleString()} <span class="text-slate-400 font-normal">{t('analytics.stats.unread')}</span></span>
			</div>
		</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="stat bg-white shadow-sm rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">{t('analytics.stats.attachments')}</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 truncate">
				{formatBytes(data.attachmentSummary.totalSize)}
			</div>
			<div class="text-slate-500 text-xl font-bold mt-1 truncate">
				{data.attachmentSummary.fileCount.toLocaleString()} <span class="text-sm font-normal text-slate-400">{t('analytics.stats.files')}</span>
			</div>
			<div class="stat-desc text-slate-400 mt-2">{t('analytics.stats.count_size')}</div>
		</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="stat bg-white shadow-sm rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">{t('analytics.stats.received')}</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 truncate">
				{data.inboxStats.totalCount.toLocaleString()}
			</div>
			<div class="text-slate-500 text-xl font-bold mt-1 truncate">
				{formatBytes(data.inboxStats.totalSize)}
			</div>
			<div class="stat-desc text-slate-400 mt-2">{t('analytics.stats.count_size')}</div>
		</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="stat bg-white shadow-sm rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">{t('analytics.stats.sent')}</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 truncate">
				{data.sentStats.totalCount.toLocaleString()}
			</div>
			<div class="text-slate-500 text-xl font-bold mt-1 truncate">
				{formatBytes(data.sentStats.totalSize)}
			</div>
			<div class="stat-desc text-slate-400 mt-2">{t('analytics.stats.count_size')}</div>
		</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="stat bg-white shadow-sm rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">{t('analytics.stats.oldest')}</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 truncate">
				{data.summary.oldestDate ? formatDate(data.summary.oldestDate) : 'N/A'}
			</div>
			<div class="stat-desc text-slate-400 mt-2">{t('analytics.stats.historical')}</div>
		</div>
	</div>

	<!-- Charts Row -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="bg-white p-6 shadow-sm rounded-[32px] border border-slate-100 h-[28rem] flex flex-col transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<h3 class="text-2xl text-amogus-dark mb-4">{t('analytics.chart.folders')}</h3>
			<div class="flex-1 relative py-4">
				{#if folderData.reduce((a, b) => a + b, 0) > 0.001}
					<Doughnut data={doughnutChartData} options={doughnutOptions} />
				{:else}
					<div class="flex h-full items-center justify-center text-slate-400">{t('analytics.chart.empty')}</div>
				{/if}
			</div>
		</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="bg-white p-6 shadow-sm rounded-[32px] border border-slate-100 h-[28rem] flex flex-col transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<h3 class="text-2xl text-amogus-dark mb-4">{t('analytics.chart.attachments')}</h3>
			<div class="flex-1 relative py-4">
				{#if attachmentData.reduce((a, b) => a + b, 0) > 0.001}
					<Bar data={barChartData} options={barOptions} />
				{:else}
					<div class="flex h-full items-center justify-center text-slate-400">{t('analytics.chart.empty')}</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Bottom Table Row -->
	<div class="bg-white shadow-sm rounded-[32px] border border-slate-100 overflow-hidden">
		<div class="p-6 border-b border-slate-100 bg-slate-50/50">
			<h3 class="text-2xl text-amogus-dark">{t('analytics.table.senders')}</h3>
			<p class="text-sm text-slate-500 mt-1">{t('analytics.table.senders.desc')}</p>
		</div>
		<div class="overflow-hidden p-0 md:p-4">
			<table class="w-full text-sm border-separate md:border-collapse border-spacing-y-1 block md:table">
				<thead class="hidden md:table-header-group">
					<tr class="text-slate-500">
						<th class="text-left font-bold uppercase text-xs tracking-wide py-2 px-5">#</th>
						<th class="text-left font-bold uppercase text-xs tracking-wide py-2 px-5">{t('analytics.table.sender')}</th>
						<th class="text-right font-bold uppercase text-xs tracking-wide py-2 px-5">{t('analytics.stats.messages')}</th>
						<th class="text-right font-bold uppercase text-xs tracking-wide py-2 px-5">{t('analytics.stats.storage')}</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 bg-white block md:table-row-group">
					{#each data.topSenders as sender, i (sender.sender)}
						<tr class="even:bg-slate-50 hover:bg-slate-100/60 transition-colors block md:table-row p-4 md:p-0 border-b border-slate-100 last:border-0 md:border-none">
							<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-5 font-medium text-slate-400 border-b border-b-slate-50 md:border-none md:rounded-l-full">
								<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('analytics.table.rank')}</span>
								<span>{i + 1}</span>
							</td>
							<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-5 font-bold text-slate-700 border-b border-b-slate-50 md:border-none">
								<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('analytics.table.sender')}</span>
								<span class="text-right md:text-left truncate max-w-[200px] md:max-w-none">{sender.sender}</span>
							</td>
							<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-5 md:text-right text-indigo-500 text-sm font-bold border-b border-b-slate-50 md:border-none">
								<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('analytics.stats.messages')}</span>
								<span>{sender.totalMessages.toLocaleString()}</span>
							</td>
							<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-5 md:text-right text-slate-600 text-sm font-bold md:rounded-r-full">
								<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('analytics.stats.storage')}</span>
								<span>{formatBytes(sender.totalSize)}</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="text-center py-8 text-slate-400 block md:table-cell">{t('analytics.table.empty')}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
