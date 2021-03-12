import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { openEditCareerDialog } from '../../store/productSlice';

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		margin: '10px'
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	}
});

function CareerCard({ career, handleDelete }) {
	const dispatch = useDispatch();
	const classes = useStyles();

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<Typography className={classes.title} color="textSecondary" gutterBottom>
					Позиция: {career.position}
				</Typography>
				<Typography variant="h5" component="h2">
					Компания: {career.company}
				</Typography>
				<Typography className={classes.pos} color="textSecondary">
					Начало работы: {career.startedAt}
				</Typography>
				{career.endedAt ? (
					<Typography variant="body2" component="p">
						Конец работы: {career.endedAt}
					</Typography>
				) : (
					<Typography variant="body2" component="p">
						По настоящее время
					</Typography>
				)}
			</CardContent>
			<CardActions>
				<Button size="small" onClick={() => handleDelete(career)}>
					Удалить
				</Button>
				<Button size="small" onClick={() => dispatch(openEditCareerDialog(career))}>
					Изменить
				</Button>
			</CardActions>
		</Card>
	);
}

export default CareerCard;
