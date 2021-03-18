import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Controller } from 'react-hook-form';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { FormHelperText } from '@material-ui/core';

const ReactHookFormSelect = ({ name, label, control, defaultValue, children, errors, ...props }) => {
	const labelId = `${name}-label`;

	// error={errors && errors}

	return (
		<FormControl {...props} error={errors && !!errors}>
			<InputLabel id={labelId}>{label}</InputLabel>
			<Controller
				as={
					<Select labelId={labelId} input={<OutlinedInput name={label} labelWidth={name.length * 8} />}>
						{children}
					</Select>
				}
				name={name}
				control={control}
				defaultValue={defaultValue}
			/>
			<FormHelperText>{errors && errors.message}</FormHelperText>
		</FormControl>
	);
};
export default ReactHookFormSelect;
