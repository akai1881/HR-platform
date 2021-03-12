import React from 'react';
import { openNewCareerDialog } from 'app/main/apps/e-commerce/store/productSlice';
import CareerCard from 'app/main/apps/e-commerce/product/components/CareerCard';
import { useDispatch } from 'react-redux';
import { Button, Icon } from '@material-ui/core';

function CareerTab({ career, deleteCareer }) {
	const dispatch = useDispatch();

	return (
		<div className="p-16">
			<div className="p-20 mb-20">
				<Button
					variant="contained"
					color="primary"
					className="w-3/12"
					onClick={ev => dispatch(openNewCareerDialog())}
				>
					Добавить карьеру
					<Icon fontSize="small" color="inherit" className="ml-9">
						add_circle_outline
					</Icon>
				</Button>
			</div>
			<div className="flex flex-wrap p-10">
				{career.map(item => (
					<CareerCard key={item.id} career={item} handleDelete={deleteCareer} />
				))}
			</div>
		</div>
	);
}

export default CareerTab;
