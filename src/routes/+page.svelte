<script lang="ts">
	import { Envelope, GlobeHemisphereWest, User, HardDrives, SquaresFour } from 'phosphor-svelte';
	let { data } = $props();
	let stats = data.stats;
</script>

<div class="space-y-6">
	<!-- Заголовок -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<SquaresFour size={36} weight="fill" class="text-cyan-500" />
				Dashboard
			</h2>
			<p class="text-slate-500 mt-1">System overview and statistics</p>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Stat Card -->
		<div class="rounded-[32px] bg-amogus-light p-8 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-transform hover:scale-105">
			<div class="bg-white p-3 rounded-full text-amogus-blue mb-4 shadow-sm">
				<Envelope size={32} weight="fill" />
			</div>
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Total Mailboxes</p>
			<p class="mt-2 text-5xl font-black text-amogus-blue">{stats.totalMailboxes}</p>
		</div>

		<!-- Stat Card -->
		<div class="rounded-[32px] bg-amogus-light p-8 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-transform hover:scale-105">
			<div class="bg-white p-3 rounded-full text-emerald-500 mb-4 shadow-sm">
				<User size={32} weight="fill" />
			</div>
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Active Mailboxes</p>
			<p class="mt-2 text-5xl font-black text-emerald-600">{stats.activeMailboxes}</p>
		</div>

		<!-- Stat Card -->
		<div class="rounded-[32px] bg-amogus-light p-8 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-transform hover:scale-105">
			<div class="bg-white p-3 rounded-full text-amogus-blue mb-4 shadow-sm">
				<GlobeHemisphereWest size={32} weight="fill" />
			</div>
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Domains</p>
			<p class="mt-2 text-5xl font-black text-amogus-blue">{stats.totalDomains}</p>
		</div>

		<!-- Stat Card -->
		<div class="rounded-[32px] bg-amogus-light p-8 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-transform hover:scale-105">
			<div class="bg-white p-3 rounded-full text-amogus-brown mb-4 shadow-sm">
				<HardDrives size={32} weight="fill" />
			</div>
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Total Quota (MB)</p>
			<p class="mt-2 text-5xl font-black text-amogus-brown">{stats.totalQuotaMb}</p>
		</div>
	</div>

	<div class="mt-8 rounded-[32px] bg-white p-8 border border-slate-200 shadow-sm flex items-center gap-6">
		<img src="/postman_amogus_logo_small.png" alt="Amogus" class="h-24 w-24 object-cover rounded-full shadow-md" />
		<div>
			<h3 class="text-2xl text-amogus-dark mb-2">Welcome to Postman Amogus</h3>
			<p class="text-slate-600 text-lg">
				Use the circular navigation buttons above to manage your domains, mailboxes, and forwarding aliases. 
			</p>
		</div>
	</div>
</div>
