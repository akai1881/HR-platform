import _ from '@lodash';
import clsx from 'clsx';
import React from 'react';

export const orderStatuses = [
	{
		id: 1,
		name: 'Во время',
		isLate: false,
		color: 'bg-green text-white'
	},
	{
		id: 2,
		name: 'Опоздал(а)',
		isLate: true,
		color: 'bg-red-700 text-white'
	}
];

function OrdersStatus(props) {
	return (
		<div
			className={clsx('inline text-12 p-4 rounded truncate', _.find(orderStatuses, ['isLate', props.name]).color)}
		>
			{_.find(orderStatuses, ['isLate', props.name]).name}
		</div>
	);
}

export default OrdersStatus;
