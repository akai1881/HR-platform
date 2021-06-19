import _ from '@lodash';
import clsx from 'clsx';
import React from 'react';

export const orderStatuses = [
	{
		id: 1,
		name: 'Во время',
		color: 'bg-green text-white'
	},
	{
		id: 2,
		name: 'Опоздал(а)',
		color: 'bg-red-700 text-white'
	},
	{
		id: 3,
		name: 'Не сканировал(а)',
		color: 'bg-gray-600 text-white'
	}
];

function OrdersStatus(props) {
	return (
		<div
			className={clsx('inline text-12 p-4 rounded truncate', _.find(orderStatuses, ['name', props.name]).color)}
		>
			{_.find(orderStatuses, ['name', props.name]).name}
		</div>
	);
}

export default OrdersStatus;
