import React, { useState, useEffect, useRef, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, TextField, Select, OutlinedInput } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { TimePicker } from '@material-ui/pickers';
import ReactHookFormSelect from './ReactHookFormSelect';
import { firstColumn, secondColumn } from '../constants';

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

function TestUserInputs({
	register,
	values,
	control,
	departments,
	setDepartment,
	params,
	errors,
	handleDateChange,
	selectedDate
}) {
	const classes = useStyles();
	const [editData, setEditData] = useState(values);
	const userRole = useSelector(({ auth }) => auth.user.role);
	const [selectValue, setSelectValue] = useState('');
	const elementsRef = useRef(departments.map(() => createRef()));

	useEffect(() => {
		if (editData) {
			setEditData(values);
			setSelectValue(editData.department.id);
		}

		console.log(userRole);
	}, [values, departments]);

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
								<InputLabel htmlFor={item.id} id={`${item.id}__label`}>
									{item.label}
								</InputLabel>
								<Select
									input={
										<OutlinedInput
											value={selectValue || ''}
											id={item.id}
											labelWidth={'department'.length * 8}
										/>
									}
									value={selectValue || ''}
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

					if (item.type === 'select' && item.name === 'role' && params === 'new') {
						return (
							<ReactHookFormSelect
								id={item.id}
								errors={errors[item.name] && errors[item.name]}
								name={item.name}
								key={`${item.id}-select`}
								label={item.label}
								control={control}
								defaultValue={editData[item.name] || ''}
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

					if (item.name === 'dueTime' && item.type === 'date') {
						return (
							<TimePicker
								clearable
								name={item.name}
								className={classes.inputField}
								// label="24 hours"
								inputVariant="outlined"
								value={selectedDate}
								onChange={handleDateChange}
							/>
						);
					}

					if ((item.name === 'password' && params !== 'new') || (item.name === 'role' && params !== 'new')) {
						return null;
					}
					return (
						<TextField
							key={`${item.id}-inp`}
							className={classes.inputField}
							defaultValue={editData[item.name] !== '' ? editData[item.name] : ''}
							label={item.label}
							error={errors[item.name] && !!errors[item.name]}
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
								defaultValue={editData[item.name] || ''}
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
					}
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
				})}
			</div>
		</>
	);
}

export default TestUserInputs;
