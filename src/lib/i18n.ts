import { settings } from './stores/settings.svelte';

export const translations: Record<string, Record<string, string>> = {
	en: {
		// Dashboard & Nav
		'nav.dashboard': 'Dashboard',
		'nav.dashboard.desc': 'System overview and statistics',
		'nav.analytics': 'Analytics',
		'card.domains': 'Domains',
		'card.domains.desc': 'Manage registered mail domains',
		'card.mailboxes': 'Mailboxes',
		'card.mailboxes.desc': 'Manage users and email accounts',
		'card.aliases': 'Aliases',
		'card.aliases.desc': 'Email forwarding & catch-all rules',
		'card.blacklists': 'Blacklists',
		
		'search.placeholder': 'Search mailboxes, aliases, domains...',
		'card.blacklists.desc': 'Block spam and unwanted senders',
		'card.whitelists': 'Whitelists',
		'card.whitelists.desc': 'Allow trusted mail sources',
		'dashboard.title': 'Postman Amogus Control Center',
		'dashboard.desc': 'Email accounts database management. Here you can easily manage <strong class="text-amogus-dark">Domains</strong> and <strong class="text-amogus-dark">Mailboxes</strong>, configure routing paths via <strong class="text-amogus-dark">Aliases</strong>, and protect your server using <strong class="text-amogus-dark">Blacklists</strong> and <strong class="text-amogus-dark">Whitelists</strong>.',
		
		// Common UI
		
		// Common UI

		'btn.settings': 'Settings',
		'btn.about': 'About',
		'btn.save': 'Save',
		'btn.add_rule': '+ Add Rule',
		'btn.cancel': 'Cancel',
		'btn.delete': 'Delete',
		'btn.edit': 'Edit',
		'btn.add': 'Add',
		'status.active': 'Active',
		'status.inactive': 'Inactive',
		'status.inactive_count': '{count} Inactive',
		'status.all_active': 'All Active',
		'status.backup_mx': 'Backup MX',
		'tooltip.mailboxes': 'Mailboxes',
		'tooltip.email_aliases': 'Email Aliases',
		'tooltip.domain_aliases': 'Domain Aliases',
		'status.dkim': 'DKIM Enforced',
		'status.domain_alias': 'Domain Alias',
		'table.actions': 'Actions',
		'table.description': 'Description',
		'table.status': 'Status',
		'table.filtered_empty': 'No records found matching your filters.',
		
		'comment.title': 'Description',
		'comment.add': 'Add Description',
		'form.email': 'Email Account',
		'form.editing_account': 'Editing Account:',
		'form.fullname': 'Full Name',
		'form.password': 'Password',
		'form.quota_mb': 'Quota (MB)',
		'form.quota_msg': 'Quota (Messages)',
		'form.unlimited': '0 for unlimited.',
		'form.description': 'Description',
		'form.optional': '(Optional)',
		'form.change_password': '(Change Password)',
		'form.active': 'Active',
		'form.backupmx': 'Backup MX',
		'form.forward_to': 'Forward To Mailbox',
		'form.select_destination': 'Select destination...',
		'form.invalid_inactive': '(Current, Invalid/Inactive)',
		
		'form.domain': 'Domain Name',
		'form.active_domain': 'Active Domain',
		'form.use_domain_aliases': 'Use for Domain Aliases',
		'form.backup_mx': 'Backup MX (Secondary Mail Exchanger)',
		'form.backup_mx.desc': 'Act as a backup mail server',
		'form.dkim': 'Enforce DKIM Required',
		'form.dkim.desc': 'Reject emails without a valid DKIM signature to prevent spoofing.',

		'toast.saved': 'Successfully updated!',
		'toast.created': 'Created successfully!',
		'toast.failed_save': 'An error occurred while saving',
		'toast.deleted': 'Deleted successfully!',
		'toast.failed_delete': 'Failed to delete',
		
		'domain.delete.mailboxes': 'Mailboxes will be orphaned',
		'domain.delete.aliases': 'Email Aliases will be orphaned',
		'domain.delete.domain_aliases': 'Domain Aliases will be orphaned',

		'quota.mb': 'MB',
		'quota.gb': 'GB',
		'quota.msgs': 'msgs',
		'quota.unlimited': 'Unlimited',
		'quota.mb_used': 'MB used',
		'quota.gb_used': 'GB used',

		'tab.general': 'General',
		'tab.aliases': 'Aliases',
		
		'domain.alias.desc1': 'All emails sent to the domains listed below will be seamlessly forwarded to',
		'domain.alias.desc2': 'Note: You do not need to create these aliases as primary domains first. If an alias also exists as a primary domain, this forwarding rule will override its local mailboxes. Additionally, each mailbox can individually enable or disable receiving mail from these domain aliases in its own settings.',
		'domain.alias.empty': 'No domain aliases configured.',
		'domain.alias.add': 'Add Alias',
		'domain.alias.limit': 'Maximum limit of 5 aliases reached for this domain.',

		'confirm.title': 'Confirm Changes',
		'confirm.warning': 'You are changing critical settings for',
		'confirm.review': 'Please review:',
		'confirm.routing': 'ROUTING',
		'confirm.dkim': 'DKIM ENFORCED',
		'confirm.domain_name': 'DOMAIN NAME',
		'confirm.primary_mx': 'Primary MX',
		'confirm.yes': 'Yes',
		'confirm.no': 'No',
		'confirm.changed': '(changed)',
		'confirm.domain_change_warning.title': 'Attention:',
		'confirm.domain_change_warning.desc': 'When changing the domain name, it will be automatically updated in the following linked sections: Mailboxes, Aliases, and Domain Aliases.',
		'btn.back_edit': 'Back to Edit',
		'btn.confirm_save': 'Confirm & Save',
		
		'graph.title': 'Mail Routing Graph',
		'graph.direct': 'Direct Delivery',
		'graph.alias': 'Personal Alias',
		'graph.domain_alias': 'Domain Alias',
		'graph.subtitle': 'All incoming email routes delivering to this mailbox.',
		'graph.domain_disabled': 'Domain is Disabled',
		'graph.domain_disabled.desc': 'The domain {domain} is currently disabled. All incoming mail routing is suspended, regardless of individual alias or mailbox settings.',
		
		'analytics.title': 'Analytics',
		'analytics.desc.all': 'Aggregated statistics across all mailboxes',
		'analytics.desc.single': 'Statistics for ',
		'analytics.last_run': 'Last run:',
		'analytics.all_mailboxes': 'All Mailboxes',
		'analytics.stats.storage': 'Total Storage Used',
		'analytics.stats.storage.desc': 'Used | Total Quota',
		'analytics.stats.messages': 'Total Messages',
		'analytics.stats.read': 'read',
		'analytics.stats.unread': 'unread',
		'analytics.stats.attachments': 'Total Attachments',
		'analytics.stats.files': 'files',
		'analytics.stats.received': 'Received Emails',
		'analytics.stats.sent': 'Sent Emails',
		'analytics.stats.count_size': 'Count | Total size',
		'analytics.stats.oldest': 'Oldest Email',
		'analytics.stats.historical': 'Historical depth',
		'analytics.chart.folders': 'Top 10 Storage by Folder',
		'analytics.chart.attachments': 'Top 10 Attachment Types',
		'analytics.chart.empty': 'Not enough data (sizes near zero)',
		'analytics.table.senders': 'Top 10 Senders',
		'analytics.table.senders.desc': 'Most frequent senders across all mailboxes',
		'analytics.table.rank': 'Rank',
		'analytics.table.sender': 'Sender Email',
		'analytics.table.empty': 'No senders data available',
		
		'modal.add': 'Add',
		'modal.edit': 'Edit',
		'modal.delete': 'Delete',
		'modal.are_you_sure': 'Are you absolutely sure?',
		'modal.about_to_delete': 'You are about to permanently delete',
		'modal.delete_domain_warning': 'Please note: By default, this only deletes the domain record. All associated mailboxes and aliases will be left in the database as orphaned and non-functional records.',
		'modal.cascade_delete': 'I want to delete everything (cascade deletion)',
		'modal.type_domain_to_confirm': 'Enter the domain name to confirm deletion:',
		'modal.yes_delete': 'Yes, Delete',
		
		'filter.all_statuses': 'All Statuses',
		'filter.active_only': 'Active Only',
		'filter.disabled_only': 'Disabled Only',
		'filter.all_domains': 'All Domains',

		// Settings Modal
		'settings.title': 'Settings',
		'settings.subtitle': 'Application Preferences',
		'settings.sysconf': 'System Configuration',
		'settings.lang': 'Language',
		'settings.lang.desc': 'Choose your preferred language',
		'settings.auto': 'Auto',
		'settings.font': 'Interface Font',
		'settings.font.desc': 'Choose the primary font family for the dashboard',
		'font.balsamiq': 'Balsamiq (Playful)',
		'font.inter': 'Inter (Strict)',
		'font.roboto': 'Roboto (Strict)',
		'font.golos': 'Golos (Modern)',
		'font.raleway': 'Raleway (Elegant)',
		'font.oswald': 'Oswald (Condensed)',
		'font.jura': 'Jura (Thin Tech)',
		'font.huninn': 'Huninn (Playful)',
		'about.title': 'About',
		'btn.github': 'GitHub Repository',
		'btn.license': 'View License',

		// Domains
		'domain.add': 'Add Domain',
		'domain.table.name': 'Domain Name',
		'domain.table.status': 'Status & Roles',
		'domain.table.usage': 'Usage',

		// Mailboxes
		'mailbox.add': 'Add Mailbox',
		'mailbox.table.email': 'Email Account',
		'mailbox.table.fullname': 'Full Name',
		'mailbox.table.quota': 'Quota',

		// Aliases
		'alias.add': 'Add Alias',
		'alias.table.source': 'Source (Alias)',
		'alias.table.target': 'Target (Destination)',

		// Whitelists

		// Blacklists
		'blacklist.add': 'Add Rule',
		'label.dkim_domain': 'DKIM Domain',
		'label.target': 'Target',
		'label.domain_name': 'Domain Name',
		'label.email_address': 'Email Address',
		'label.ip_address': 'IP Address / Subnet',
		'label.dnsbl_pattern': 'DNSBL Zone / Pattern',
		
		'blacklist.table.empty': 'No entries found in this blacklist.',
		'whitelist.table.empty': 'No entries found in this whitelist.',
		
		'tab.domains': 'Domains',
		'tab.emails': 'Emails',
		'tab.ips': 'IP Addresses',
		'tab.dnsbl': 'Global DNSBL',
		'tab.dkim': 'DKIM Required',
		'search.min_chars': 'Type at least 2 characters...',
		'search.no_results': 'No results found for "{query}"',
		'search.empty_state': 'Start typing to search across the entire system.',
		'search.type.domain': 'Domain',
		'search.type.mailbox': 'Mailbox',
		'search.type.alias': 'Alias',
		'search.type.blacklist': 'Blacklist',
		'search.type.whitelist': 'Whitelist'
	},
	ru: {
		// Dashboard & Nav
		'nav.dashboard': 'Дашборд',
		'nav.dashboard.desc': 'Обзор системы и статистика',
		'nav.analytics': 'Аналитика',
		'card.domains': 'Домены',
		'card.domains.desc': 'Управление почтовыми доменами',
		'card.mailboxes': 'Ящики',
		'card.mailboxes.desc': 'Управление ящиками и пользователями',
		'card.aliases': 'Алиасы',
		'card.aliases.desc': 'Настройка пересылки писем на другие адреса',
		'card.blacklists': 'Блокировки',
		
		'search.placeholder': 'Поиск ящиков, алиасов, доменов...',
		'card.blacklists.desc': 'Блокировка спама и отправителей',
		'card.whitelists': 'Доверенные',
		'card.whitelists.desc': 'Доверенные источники почты',
		'dashboard.title': 'Центр управления Postman Amogus',
		'dashboard.desc': 'Управление базой данных почтовых аккаунтов. Здесь вы можете создавать <strong class="text-amogus-dark">Домены</strong> и <strong class="text-amogus-dark">Ящики</strong>, настраивать маршрутизацию писем через <strong class="text-amogus-dark">Алиасы</strong>, а также управлять <strong class="text-amogus-dark">Черными</strong> и <strong class="text-amogus-dark">Белыми списками</strong>.',
		
		// Common UI
		
		// Common UI

		'btn.settings': 'Настройки',
		'btn.about': 'О программе',
		'btn.save': 'Сохранить',
		'btn.add_rule': '+ Добавить правило',
		'btn.cancel': 'Отмена',
		'btn.delete': 'Удалить',
		'btn.edit': 'Редактирование',
		'btn.add': 'Создание',
		'status.active': 'Активен',
		'status.inactive': 'Неактивен',
		'status.inactive_count': '{count} неакт.',
		'status.all_active': 'Все активны',
		'status.backup_mx': 'Резервный MX',
		'tooltip.mailboxes': 'Почтовые ящики',
		'tooltip.email_aliases': 'Алиасы почты',
		'tooltip.domain_aliases': 'Алиасы домена',
		'status.dkim': 'Проверка DKIM',
		'status.domain_alias': 'Алиас домена',
		'table.actions': 'Действия',
		'table.description': 'Описание',
		'table.status': 'Статус',
		'table.filtered_empty': 'По вашему запросу ничего не найдено.',

		'comment.title': 'Описание',
		'comment.add': 'Добавить описание',
		'form.email': 'Почтовый аккаунт',
		'form.editing_account': 'Редактирование аккаунта:',
		'form.fullname': 'Полное имя',
		'form.password': 'Пароль',
		'form.quota_mb': 'Квота (МБ)',
		'form.quota_msg': 'Квота (Писем)',
		'form.unlimited': '0 — безлимитно.',
		'form.description': 'Описание',
		'form.optional': '(Необязательно)',
		'form.change_password': '(Смена пароля)',
		'form.active': 'Активен',
		'form.backupmx': 'Backup MX',
		'form.forward_to': 'Пересылать на почтовый ящик',
		'form.select_destination': 'Выберите ящик...',
		'form.invalid_inactive': '(Текущий, неактивен/удален)',
		
		'form.domain': 'Имя домена',
		'form.active_domain': 'Активный домен',
		'form.use_domain_aliases': 'Использовать для алиасов домена',
		'form.backup_mx': 'Резервный MX (Вторичный сервер)',
		'form.backup_mx.desc': 'Работать как резервный сервер',
		'form.dkim': 'Строгая проверка DKIM',
		'form.dkim.desc': 'Отклонять письма без валидной подписи DKIM.',

		'toast.saved': 'Успешно изменено!',
		'toast.created': 'Успешно создано!',
		'toast.failed_save': 'Произошла ошибка при сохранении',
		'toast.deleted': 'Успешно удалено!',
		'toast.failed_delete': 'Не удалось удалить',
		
		'domain.delete.mailboxes': 'Почтовые ящики станут осиротевшими',
		'domain.delete.aliases': 'Email-алиасы станут осиротевшими',
		'domain.delete.domain_aliases': 'Доменные алиасы станут осиротевшими',

		'tab.general': 'Основные',
		'tab.aliases': 'Алиасы',
		
		'domain.alias.desc1': 'Все письма, отправленные на указанные ниже домены, будут автоматически пересылаться на',
		'domain.alias.desc2': 'Примечание: Вам не нужно сначала создавать эти алиасы как основные домены. Если алиас также существует как основной домен, это правило пересылки переопределит его локальные ящики. Кроме того, каждый ящик может индивидуально включать или отключать получение почты с этих доменных алиасов в своих настройках.',
		'domain.alias.empty': 'Доменные алиасы не настроены.',
		'domain.alias.add': 'Добавить алиас',
		'domain.alias.limit': 'Достигнут максимальный лимит в 5 алиасов для этого домена.',

		'confirm.title': 'Подтверждение изменений',
		'confirm.warning': 'Вы меняете критические настройки для',
		'confirm.review': 'Пожалуйста, проверьте:',
		'confirm.routing': 'МАРШРУТИЗАЦИЯ',
		'confirm.dkim': 'ПРОВЕРКА DKIM',
		'confirm.domain_name': 'ИМЯ ДОМЕНА',
		'confirm.primary_mx': 'Первичный MX',
		'confirm.yes': 'Да',
		'confirm.no': 'Нет',
		'confirm.changed': '(изменено)',
		'confirm.domain_change_warning.title': 'Внимание:',
		'confirm.domain_change_warning.desc': 'При изменении имени домена, оно будет автоматически обновлено в следующих связанных разделах: Почтовые ящики, Алиасы и Доменные алиасы.',
		'btn.back_edit': 'Назад к редактированию',
		'btn.confirm_save': 'Подтвердить и сохранить',
		
		'graph.title': 'Граф маршрутов',
		'graph.direct': 'Прямая доставка',
		'graph.alias': 'Личный алиас',
		'graph.domain_alias': 'Алиас домена',
		'graph.subtitle': 'Все входящие пути доставки, направленные в этот ящик.',
		'graph.domain_disabled': 'Домен отключен',
		'graph.domain_disabled.desc': 'Домен {domain} в данный момент отключен. Вся входящая почта приостановлена, независимо от настроек алиасов или ящиков.',
		
		'analytics.title': 'Аналитика',
		'analytics.desc.all': 'Общая статистика по всем ящикам',
		'analytics.desc.single': 'Статистика для ',
		'analytics.last_run': 'Последний запуск:',
		'analytics.all_mailboxes': 'Все ящики',
		'analytics.stats.storage': 'Занято места',
		'analytics.stats.storage.desc': 'Использовано | Общая квота',
		'analytics.stats.messages': 'Всего писем',
		'analytics.stats.read': 'прочитано',
		'analytics.stats.unread': 'непрочитано',
		'analytics.stats.attachments': 'Всего вложений',
		'analytics.stats.files': 'файлов',
		'analytics.stats.received': 'Полученные письма',
		'analytics.stats.sent': 'Отправленные письма',
		'analytics.stats.count_size': 'Количество | Общий размер',
		'analytics.stats.oldest': 'Самое старое письмо',
		'analytics.stats.historical': 'Глубина истории',
		'analytics.chart.folders': 'Топ 10 папок по объему',
		'analytics.chart.attachments': 'Топ 10 типов вложений',
		'analytics.chart.empty': 'Недостаточно данных (размер близок к нулю)',
		'analytics.table.senders': 'Топ 10 отправителей',
		'analytics.table.senders.desc': 'Самые частые отправители во всех ящиках',
		'analytics.table.rank': 'Ранг',
		'analytics.table.sender': 'Отправитель',
		'analytics.table.empty': 'Нет данных об отправителях',
		
		'modal.add': 'Создание',
		'modal.edit': 'Редактирование',
		'modal.delete': 'Удаление',
		'modal.are_you_sure': 'Вы абсолютно уверены?',
		'modal.about_to_delete': 'Вы собираетесь безвозвратно удалить',
		'modal.delete_domain_warning': 'Внимание: по умолчанию будет удалена только запись домена. Все привязанные почтовые ящики и алиасы останутся в базе, но станут осиротевшими и нерабочими.',
		'modal.cascade_delete': 'Я хочу удалить домен вместе со всеми ящиками и алиасами (каскадное удаление)',
		'modal.type_domain_to_confirm': 'Введите имя домена для подтверждения удаления:',
		'modal.yes_delete': 'Да, удалить',

		'filter.all_statuses': 'Все статусы',
		'filter.active_only': 'Только активные',
		'filter.disabled_only': 'Только выключенные',
		'filter.all_domains': 'Все домены',

		// Settings Modal
		'settings.title': 'Настройки',
		'settings.subtitle': 'Параметры приложения',
		'settings.sysconf': 'Системная конфигурация',
		'settings.lang': 'Язык',
		'settings.lang.desc': 'Выберите предпочитаемый язык',
		'settings.auto': 'Авто',
		'settings.font': 'Шрифт интерфейса',
		'settings.font.desc': 'Выберите основной шрифт для панели управления',
		'font.balsamiq': 'Balsamiq (Игривый)',
		'font.inter': 'Inter (Строгий)',
		'font.roboto': 'Roboto (Строгий)',
		'font.golos': 'Golos Text (Современный)',
		'font.raleway': 'Raleway (Элегантный)',
		'font.oswald': 'Oswald (Сжатый)',
		'font.jura': 'Jura (Тонкий техно)',
		'font.huninn': 'Huninn (Игривый)',
		'about.title': 'О программе',
		'btn.github': 'Репозиторий GitHub',
		'btn.license': 'Смотреть лицензию',

		// Domains
		'domain.add': 'Добавить домен',
		'domain.table.name': 'Имя домена',
		'domain.table.status': 'Статус и роли',
		'domain.table.usage': 'Использование',

		// Mailboxes
		'mailbox.add': 'Добавить ящик',
		'mailbox.table.email': 'Почтовый аккаунт',
		'mailbox.table.fullname': 'Полное имя',
		'mailbox.table.quota': 'Квота',

		// Aliases
		'alias.add': 'Добавить алиас',
		'alias.table.source': 'Источник (Алиас)',
		'alias.table.target': 'Цель (Куда пересылать)',

		// Whitelists
		
		'label.dkim_domain': 'DKIM домен',
		'label.target': 'Значение',
		'label.domain_name': 'Имя домена',
		'label.email_address': 'Email адрес',
		'label.ip_address': 'IP адрес / Подсеть',
		'label.dnsbl_pattern': 'DNSBL зона / Паттерн',

		// Blacklists
		'blacklist.add': 'Добавить правило',
		'tab.domains': 'Домены',
		'tab.emails': 'Адреса (Email)',
		'tab.ips': 'IP-адреса',
		'tab.dnsbl': 'Глобальный DNSBL',
		'tab.dkim': 'Обязательный DKIM',
		'blacklist.table.empty': 'Записей не найдено.',
		'whitelist.table.empty': 'Записей не найдено.',

		'quota.mb': 'МБ',
		'quota.gb': 'ГБ',
		'quota.msgs': 'писем',
		'quota.unlimited': 'Безлимит',
		'quota.mb_used': 'МБ занято',
		'quota.gb_used': 'ГБ занято',
		'search.min_chars': 'Введите минимум 2 символа...',
		'search.no_results': 'Ничего не найдено по запросу "{query}"',
		'search.empty_state': 'Начните вводить текст для глобального поиска.',
		'search.type.domain': 'Домен',
		'search.type.mailbox': 'Ящик',
		'search.type.alias': 'Алиас',
		'search.type.blacklist': 'Блокировка',
		'search.type.whitelist': 'Доверенный'
	}
};

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey | (string & {})): string {
	const lang = settings.computedLanguage;
	return translations[lang]?.[key] ?? key;
}

export function formatDate(date: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
	let lang = settings.computedLanguage;
	if (lang === 'en') {
		lang = 'en-CA'; // en-CA defaults to YYYY-MM-DD format
	}
	try {
		return new Intl.DateTimeFormat(lang, options).format(new Date(date));
	} catch (e) {
		return String(date);
	}
}

export function formatMb(mb: number): string {
	if (mb > 1023.99) {
		return (mb / 1024).toFixed(2) + ' GB';
	}
	return Math.round(mb) + ' MB';
}
