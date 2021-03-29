import { authRoles } from 'app/auth';
import i18next from 'i18next';
import DocumentationNavigation from '../main/documentation/DocumentationNavigation';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications',
		title: 'Навигация',
		translate: 'Навигация',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'contacts',
				title: 'Сотрудники',
				translate: 'Сотрудники',
				type: 'item',
				icon: 'account_box',
				url: '/apps/contacts/all'
			},
			{
				id: 'calendar',
				title: 'Календарь',
				translate: 'Календарь',
				type: 'item',
				icon: 'today',
				url: '/apps/calendar'
			}
		]
	}
];

export default navigationConfig;
