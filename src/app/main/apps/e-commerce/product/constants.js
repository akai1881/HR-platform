import { first } from 'lodash-es';

export const defaultValues = {
	firstName: '',
	lastName: '',
	patronymic: '',
	phone1: '',
	phone2: '',
	phone3: '',
	email: '',
	birthday: '',
	adress: '',
	avatarFile: '',
	department: '',
	id: '',
	team: '',
	teamLeader: '',
	passportId: '',
	firstDayAtJob: '',
	maritalStatus: '',
	projects: [],
	career: [],
	role: '',
	rank: '',
	bank: '',
	creditCardNumber: '',
	accountNumber: ''
};

export const firstColumn = [
	{
		id: 'firstName',
		name: 'firstName',
		label: 'Имя *',
		type: 'text'
	},
	{
		id: 'lastName',
		name: 'lastName',
		label: 'Фамилия *',
		type: 'text'
	},
	{
		id: 'patronymic',
		name: 'patronymic',
		label: 'Отчество',
		type: 'text'
	},
	{
		id: 'birthday',
		name: 'birthday',
		label: 'Дата рождения',
		type: 'date',
		props: {
			InputLabelProps: {
				shrink: true
			}
		}
	},
	{
		id: 'email',
		name: 'email',
		label: 'Email *',
		type: 'text'
	},
	{
		id: 'password',
		name: 'password',
		label: 'Пароль *',
		type: 'text'
	},
	{
		id: 'role-select',
		name: 'role',
		label: 'Роль *',
		type: 'select',
		variants: [
			{
				value: 'admin',
				label: 'Администратор'
			},
			{
				value: 'user',
				label: 'Пользователь'
			}
		]
	},
	{
		id: 'department-select',
		name: 'department',
		label: 'Отдел',
		type: 'select'
	},
	{
		id: 'phone1',
		name: 'phone1',
		label: 'Телефон 1 *',
		type: 'text'
	},
	{
		id: 'phone2',
		name: 'phone2',
		label: 'Телефон 2',
		type: 'text'
	},
	{
		id: 'phone3',
		name: 'phone3',
		label: 'Телефон 3',
		type: 'text'
	},
	{
		id: 'dueTime',
		name: 'dueTime',
		label: 'Расписание',
		type: 'date'
	}
];

export const secondColumn = [
	{
		id: 'adress',
		name: 'adress',
		label: 'Адрес',
		type: 'text'
	},
	{
		id: 'team',
		name: 'team',
		label: 'Команда',
		type: 'text'
	},
	{
		id: 'teamLeader',
		name: 'teamLeader',
		label: 'Руководитель',
		type: 'text'
	},
	{
		id: 'passportId',
		name: 'passportId',
		label: 'Паспорт',
		type: 'text'
	},
	{
		id: 'firstDayAtJob',
		name: 'firstDayAtJob',
		label: 'Первый день работы',
		type: 'date',
		props: {
			InputLabelProps: {
				shrink: true
			}
		}
	},
	{
		id: 'maritalStatus',
		name: 'maritalStatus',
		label: 'Cемейное положение',
		type: 'select',
		variants: [
			{
				value: 'Холост',
				label: 'Холост'
			},
			{
				value: 'Женат',
				label: 'Женат'
			},
			{
				value: 'Не замужем',
				label: 'Не замужем'
			},
			{
				value: 'Замужем',
				label: 'Замужем'
			}
		]
	},
	{
		id: 'rank',
		name: 'rank',
		label: 'Ранг',
		type: 'select',
		variants: [
			{
				value: 'ninja',
				label: 'ninja'
			},
			{
				value: 'ronin',
				label: 'ronin'
			},
			{
				value: 'samurai',
				label: 'samurai'
			}
		]
	},
	{
		id: 'bank',
		name: 'bank',
		label: 'Банк',
		type: 'text'
	},
	{
		id: 'creditCardNumber',
		name: 'creditCardNumber',
		label: 'Номер кредитной карты',
		type: 'text'
	},
	{
		id: 'accountNumber',
		name: 'accountNumber',
		label: 'Лицевой счет',
		type: 'text'
	}
];
