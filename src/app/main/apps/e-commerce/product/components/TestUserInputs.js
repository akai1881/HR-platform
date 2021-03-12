import React, { useState, useEffect, useRef, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	TextField,
	Select,
	OutlinedInput,
	FormHelperText
} from '@material-ui/core';
import ReactHookFormSelect from './ReactHookFormSelect';
import { firstColumn, secondColumn } from './../constants';
import et from 'date-fns/esm/locale/et/index.js';
import ContinuousSlider from 'app/main/documentation/material-ui-components/components/slider/ContinuousSlider';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
	inputCol: {
		display: 'flex',
		flexDirection: 'column',
		width: '33%',
		'&:not(:last-child)': {
			marginRight: '20px'
		}
	},
	inputField: {
		'&:not(:last-child)': {
			marginBottom: '20px'
		}
	}
}));

function TestUserInputs({ register, values, control, departments, setDepartment, setRole, errors }) {
	const classes = useStyles();
	const [editData, setEditData] = useState(values);
	const userRole = useSelector(({ auth }) => auth.user.role);
	const [selectValue, setSelectValue] = useState('');
	const elementsRef = useRef(departments.map(() => createRef()));

	useEffect(() => {
		setEditData(values);
		setSelectValue(editData.department.id);
		console.log(userRole);
	}, [values, departments]);

	// const handleValue = id => {
	// 	console.log('THIS IS ID', id);
	// 	setDep(id);
	// };

	const handleChange = e => {
		setSelectValue(e.target.value);
		const elem = e.target.value;
		const foundName = elementsRef.current.find(item => item.current.dataset.value === elem);
		setDepartment({
			id: elem,
			name: foundName.current.dataset.name
		});
	};

	return (
		<>
			<div className={classes.inputCol}>
				{firstColumn.map(item => {
					if (item.name === 'department' && item.type === 'select') {
						return (
							<FormControl
								key={`${item.id}-select`}
								variant="outlined"
								className="mb-20 text-red-300"
								fullWidth
							>
								<InputLabel htmlFor={item.id} id={item.id + '__label'}>
									{item.label}
								</InputLabel>
								<Select
									input={
										<OutlinedInput
											value={selectValue}
											id={item.id}
											labelWidth={'department'.length * 8}
										/>
									}
									value={selectValue}
									onChange={e => handleChange(e)}
								>
									{departments.map((dep, i) => {
										return (
											<MenuItem
												key={`${dep.id}-select-item-${dep.name}`}
												ref={elementsRef.current[i]}
												data-name={dep.name}
												value={dep.id}
											>
												{dep.name}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						);
					}

					if (item.type === 'select' && userRole === 'admin') {
						return (
							<ReactHookFormSelect
								id={item.id}
								error={errors[item.name] && errors[item.name]}
								name={item.name}
								key={`${item.id}-select`}
								label={item.label}
								control={control}
								defaultValue={editData[item.name] != '' ? editData[item.name] : ''}
								variant="outlined"
								className="mb-20"
								fullWidth
							>
								{item.variants.map(variant => (
									<MenuItem key={`${variant.value}-select-item-${item.id}`} value={variant.value}>
										{variant.label}
									</MenuItem>
								))}
							</ReactHookFormSelect>
						);
					}

					if (item.name === 'role' && userRole === 'user') {
						return null;
					} else {
						return (
							<TextField
								key={`${item.id}-inp`}
								className={classes.inputField}
								defaultValue={editData[item.name] !== '' ? editData[item.name] : ''}
								label={item.label}
								error={errors[item.name] && errors[item.name]}
								helperText={errors[item.name] && errors[item.name].message}
								type={item.type}
								id={item.id}
								inputRef={register}
								name={item.name}
								variant="outlined"
								fullWidth
								{...item.props}
							/>
						);
					}
				})}
			</div>
			<div className={classes.inputCol}>
				{secondColumn.map(item => {
					if (item.type === 'select' && userRole === 'admin') {
						return (
							<ReactHookFormSelect
								id={item.id}
								name={item.name}
								key={`${item.id}-select`}
								label={item.label}
								control={control}
								defaultValue={editData[item.name] != '' ? editData[item.name] : ''}
								variant="outlined"
								className="mb-20"
								fullWidth
							>
								{item.variants.map(variant => (
									<MenuItem key={`${variant.value}-select-item-${item.id}`} value={variant.value}>
										{variant.label}
									</MenuItem>
								))}
							</ReactHookFormSelect>
						);
					}

					if (item.name === 'rank' && userRole === 'user') {
						return null;
					} else {
						return (
							<TextField
								key={`${item.id}-inp`}
								className={classes.inputField}
								defaultValue={editData[item.name] !== '' ? editData[item.name] : ''}
								label={item.label}
								type={item.type}
								id={item.id}
								inputRef={register}
								name={item.name}
								variant="outlined"
								fullWidth
								{...item.props}
							/>
						);
					}
				})}
			</div>
		</>
	);
}

export default TestUserInputs;
