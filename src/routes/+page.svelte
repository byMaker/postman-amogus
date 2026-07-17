<script lang="ts">
	// Здесь позже будут данные из базы
	let stats = {
		totalMailboxes: 5,
		activeMailboxes: 4,
		totalDomains: 3,
		totalQuotaMb: 3886
	};
</script>

<div class="space-y-6">
	<div class="border-b border-slate-200 pb-4">
		<h2 class="text-3xl font-bold text-[#1E3A8A]">Dashboard</h2>
		<p class="text-slate-500 mt-1">System overview and statistics</p>
	</div>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Stat Card -->
		<div class="rounded-2xl bg-[#E3F2FD] p-6 shadow-sm border border-blue-100">
			<p class="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">Total Mailboxes</p>
			<p class="mt-2 text-4xl font-black text-[#0284C7]">{stats.totalMailboxes}</p>
		</div>

		<!-- Stat Card -->
		<div class="rounded-2xl bg-[#E3F2FD] p-6 shadow-sm border border-blue-100">
			<p class="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">Active Mailboxes</p>
			<p class="mt-2 text-4xl font-black text-[#0284C7]">{stats.activeMailboxes}</p>
		</div>

		<!-- Stat Card -->
		<div class="rounded-2xl bg-[#E3F2FD] p-6 shadow-sm border border-blue-100">
			<p class="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">Domains</p>
			<p class="mt-2 text-4xl font-black text-[#0284C7]">{stats.totalDomains}</p>
		</div>

		<!-- Stat Card -->
		<div class="rounded-2xl bg-[#E3F2FD] p-6 shadow-sm border border-blue-100">
			<p class="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">Total Quota (MB)</p>
			<p class="mt-2 text-4xl font-black text-[#0284C7]">{stats.totalQuotaMb}</p>
		</div>
	</div>

	<div class="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-200">
		<h3 class="text-lg font-bold text-slate-800 mb-4">Welcome to Postman Amogus</h3>
		<p class="text-slate-600">
			Please use the circular navigation buttons above to manage your domains, mailboxes, and aliases. 
			All passwords will be securely hashed using <code>SHA512-CRYPT</code>.
		</p>
	</div>
</div>
