<script lang="ts">
	import FilterListTemplate from '$lib/components/lists/FilterListTemplate.svelte';
	import { t } from '$lib/i18n';
	import { Star } from 'phosphor-svelte';
	import { getWhitelistTabs } from '$lib/utils/tabs';

	let { data } = $props();

	let tabs = $derived(getWhitelistTabs());

	const config = {
		getTableKey: (tab: string) => {
			if (tab === 'domains') return 'whiteDomains';
			if (tab === 'emails') return 'whiteEmails';
			return 'whiteIps';
		},
		getTarget: (item: any) => item.domain || item.email || item.host,
		getDesc: (item: any) => item.description,
		getIsActive: (item: any) => item.active === 1,
		getTargetLabel: (tab: string) => {
			if (tab === 'domains') return t('label.domain_name');
			if (tab === 'emails') return t('label.email_address');
			if (tab === 'ips') return t('label.ip_address');
			return t('label.target');
		},
		getValidationPattern: (tab: string) => {
			if (tab === 'domains') return "^([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]{2,}$";
			if (tab === 'emails') return "^[^@\\s]+@[^@\\s]+\\.[^@\\s0-9]{2,}$";
			return "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$";
		},
		getValidationTitle: (tab: string) => {
			if (tab === 'domains') return "Please enter a valid domain name (e.g. example.com or just a TLD like cn)";
			if (tab === 'emails') return "Please enter a valid email address";
			return "Please enter a valid IP address or CIDR subnet (e.g. 192.168.1.1 or 10.0.0.0/8)";
		},
		emptyMessage: t('whitelist.table.empty')
	};
</script>

<FilterListTemplate
	title={t('card.whitelists')}
	description={t('card.whitelists.desc')}
	icon={Star}
	iconColor="text-yellow-500"
	{tabs}
	{data}
	{config}
/>
