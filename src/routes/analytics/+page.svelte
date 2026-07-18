<script lang="ts">
	import type { PageData } from './$types';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
	import { Doughnut, Bar } from 'svelte-chartjs';
	import { goto } from '$app/navigation';
	import { ChartPieSlice } from 'phosphor-svelte';

	let { data }: { data: PageData } = $props();

	// Register Chart.js elements
	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

	// Helpers
	const formatBytes = (mb: number) => {
		if (mb < 1) return (mb * 1024).toFixed(1) + ' KB';
		if (mb > 1024) return (mb / 1024).toFixed(2) + ' GB';
		return mb.toFixed(1) + ' MB';
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
			},
			tooltip: {
				callbacks: {
					label: (context: any) => ` ${context.label}: ${formatBytes(context.raw)}`
				}
			}
		}
	};

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

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (context: any) => ` Size: ${formatBytes(context.raw)}`
				}
			}
		},
		scales: {
			y: { beginAtZero: true, grid: { display: false }, border: { display: false } },
			x: { grid: { display: false }, border: { display: false } }
		}
	};
</script>

<svelte:head>
	<title>Analytics - Postman Amogus</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<ChartPieSlice size={36} weight="fill" class="text-indigo-500" />
				Analytics
			</h2>
			<p class="text-slate-500 mt-1">{data.currentEmail ? `Statistics for ${data.currentEmail}` : 'Aggregated statistics across all mailboxes'}</p>
		</div>
		<div>
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-xl px-6">
					{data.currentEmail || 'All Mailboxes'}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl min-w-full w-max max-h-[60vh] overflow-y-auto mt-2 border border-slate-100 font-sans text-slate-600 flex-nowrap">
					<li>
						<button 
							onclick={() => handleMailboxChange('all')} 
							class="whitespace-nowrap {!data.currentEmail ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}"
						>
							<span class="w-4 inline-block">{!data.currentEmail ? '✓' : ''}</span> All Mailboxes
						</button>
					</li>
					<div class="divider my-0"></div>
					{#each data.availableMailboxes as mailbox}
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
		<div class="stat bg-white shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">Total Storage Used</div>
			<div class="stat-value text-amogus-blue text-4xl mt-3 flex items-baseline gap-2 truncate">
				{formatBytes(data.summary.totalSize)} 
				{#if data.summary.totalQuotaMb > 0}
					<span class="text-slate-300 text-2xl font-light px-1 font-sans">/</span> <span class="text-slate-400 text-2xl">{formatBytes(data.summary.totalQuotaMb)}</span>
				{/if}
			</div>
			<div class="stat-desc text-slate-400 mt-2">Used {#if data.summary.totalQuotaMb > 0}/ Total Quota{/if}</div>
		</div>

		<div class="stat bg-white shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">Total Messages</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3">{data.summary.totalMessages.toLocaleString()}</div>
			<div class="stat-desc text-slate-400 mt-2 truncate flex items-center gap-1">
				<span class="text-emerald-500 font-medium">{data.summary.totalRead.toLocaleString()} read</span> / 
				<span class="text-rose-400 font-medium">{data.summary.totalUnread.toLocaleString()} unread</span>
			</div>
		</div>

		<div class="stat bg-white shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">Total Attachments</div>
			<div class="stat-value text-indigo-500 text-4xl mt-3 flex items-baseline gap-2 truncate">
				{formatBytes(data.attachmentSummary.totalSize)} <span class="text-slate-300 text-2xl font-light px-1 font-sans">|</span> <span class="text-slate-500 text-2xl">{data.attachmentSummary.fileCount.toLocaleString()} <span class="text-lg font-sans font-normal text-slate-400">files</span></span>
			</div>
			<div class="stat-desc text-slate-400 mt-2">Total size / File count</div>
		</div>

		<div class="stat bg-white shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">Received Emails</div>
			<div class="stat-value text-emerald-500 text-4xl mt-3 flex items-baseline gap-2 truncate">
				{data.inboxStats.totalCount.toLocaleString()} <span class="text-slate-300 text-2xl font-light px-1 font-sans">|</span> <span class="text-slate-600 text-2xl">{formatBytes(data.inboxStats.totalSize)}</span>
			</div>
			<div class="stat-desc text-slate-400 mt-2">Count / Total size</div>
		</div>

		<div class="stat bg-white shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">Sent Emails</div>
			<div class="stat-value text-orange-500 text-4xl mt-3 flex items-baseline gap-2 truncate">
				{data.sentStats.totalCount.toLocaleString()} <span class="text-slate-300 text-2xl font-light px-1 font-sans">|</span> <span class="text-slate-600 text-2xl">{formatBytes(data.sentStats.totalSize)}</span>
			</div>
			<div class="stat-desc text-slate-400 mt-2">Count / Total size</div>
		</div>

		<div class="stat bg-white shadow-sm rounded-2xl border border-slate-100 p-6 flex flex-col justify-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<div class="stat-title text-slate-400 font-medium text-sm tracking-wide">Oldest Email</div>
			<div class="stat-value text-amber-500 text-4xl mt-3 truncate">
				{data.summary.oldestDate ? new Date(data.summary.oldestDate).toLocaleDateString() : 'N/A'}
			</div>
			<div class="stat-desc text-slate-400 mt-2">Historical depth</div>
		</div>
	</div>

	<!-- Charts Row -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="bg-white p-6 shadow-sm rounded-2xl border border-slate-100 h-[28rem] flex flex-col transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<h3 class="text-2xl text-amogus-dark mb-4">Top 10 Storage by Folder</h3>
			<div class="flex-1 relative py-4">
				{#if folderData.reduce((a, b) => a + b, 0) > 0.001}
					<Doughnut data={doughnutChartData} options={doughnutOptions} />
				{:else}
					<div class="flex h-full items-center justify-center text-slate-400">Not enough data (sizes near zero)</div>
				{/if}
			</div>
		</div>

		<div class="bg-white p-6 shadow-sm rounded-2xl border border-slate-100 h-[28rem] flex flex-col transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<h3 class="text-2xl text-amogus-dark mb-4">Top 10 Attachment Types</h3>
			<div class="flex-1 relative py-4">
				{#if attachmentData.reduce((a, b) => a + b, 0) > 0.001}
					<Bar data={barChartData} options={barOptions} />
				{:else}
					<div class="flex h-full items-center justify-center text-slate-400">Not enough data (sizes near zero)</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Bottom Table Row -->
	<div class="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
		<div class="p-6 border-b border-slate-100 bg-slate-50/50">
			<h3 class="text-2xl text-amogus-dark">Top 10 Senders</h3>
			<p class="text-sm text-slate-500 mt-1">Most frequent senders across all mailboxes</p>
		</div>
		<div class="overflow-x-auto p-4">
			<table class="w-full text-sm border-separate border-spacing-y-1">
				<thead>
					<tr class="text-slate-500">
						<th class="text-left font-bold uppercase text-xs tracking-wide pb-2 px-5">#</th>
						<th class="text-left font-bold uppercase text-xs tracking-wide pb-2 px-5">Sender Email</th>
						<th class="text-right font-bold uppercase text-xs tracking-wide pb-2 px-5">Messages</th>
						<th class="text-right font-bold uppercase text-xs tracking-wide pb-2 px-5">Total Size</th>
					</tr>
				</thead>
				<tbody>
					{#each data.topSenders as sender, i}
						<tr class="even:bg-slate-50 hover:bg-slate-100/60 transition-colors">
							<td class="px-5 py-3 font-medium text-slate-400 rounded-l-full">{i + 1}</td>
							<td class="px-5 py-3 font-bold text-slate-700">{sender.sender}</td>
							<td class="px-5 py-3 text-right text-indigo-500 text-base font-bold">{sender.totalMessages.toLocaleString()}</td>
							<td class="px-5 py-3 text-right text-slate-600 text-base font-bold rounded-r-full">{formatBytes(sender.totalSize)}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="text-center py-8 text-slate-400">No senders data available</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
