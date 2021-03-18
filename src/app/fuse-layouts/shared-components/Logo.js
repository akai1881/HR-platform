import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import logo from 'assets/main_logo.svg';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		'& .logo-icon': {
			width: 24,
			height: 24,
			transition: theme.transitions.create(['width', 'height'], {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		},
		'& .react-badge, & .logo-text': {
			transition: theme.transitions.create('opacity', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		}
	},
	reactBadge: {
		backgroundColor: 'transparent',
		color: '#61DAFB'
	}
}));

function Logo() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex items-center')}>
			<Typography className="text-16 mx-12 font-light logo-text" color="primary">
				HR
			</Typography>
			<div className={clsx(classes.reactBadge, 'react-badge flex items-center py-4 px-8 rounded')}>
				<img className="react-logo" src={logo} alt="react" width="80" />
			</div>
		</div>
	);
}

export default Logo;
