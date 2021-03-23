import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import clsx from 'clsx';
import { Button, CardActions, Collapse, DialogActions, DialogTitle } from '@material-ui/core';
import { openEditProjectDialog } from '../../store/productSlice';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
	root: {
		width: 345,
		// '&:not(:last-child)': {
		// 	marginRight: '20px'
		// },
		// '&:not(:nth-last-child(-n+3))': {

		// }
		margin: '1.0rem'
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column'
	},
	cardDescr: {
		flex: '1 1 auto'
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	}
}));

export default function ProjectCard(props) {
	const { project, handleDelete, menu } = props;
	const classes = useStyles();
	const [image, setImage] = useState(null);
	const [expanded, setExpanded] = React.useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const dispatch = useDispatch();

	useEffect(() => {
		if (typeof project.cover === 'object') {
			setImage(project.image);
		} else {
			setImage(project.cover);
		}
	}, [project]);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleOpenEdit = () => {
		handleClose();
		dispatch(openEditProjectDialog(project));
	};

	const removeProject = () => {
		handleDelete(project);
		dispatch(closeDialog());
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleDeleteDialog = () => {
		handleClose();
		dispatch(
			openDialog({
				children: (
					<React.Fragment>
						<DialogTitle id="alert-dialog-title">Вы уверены, что хотите удалить проект?</DialogTitle>
						<DialogActions>
							<Button onClick={() => dispatch(closeDialog())} color="primary">
								Нет, отменить
							</Button>
							<Button onClick={removeProject} color="primary" autoFocus>
								Да, я уверен
							</Button>
						</DialogActions>
					</React.Fragment>
				)
			})
		);
	};

	return (
		<Card className={classes.root} raised={true}>
			<CardHeader
				action={
					menu ? (
						<IconButton aria-label="settings" onClick={handleClick}>
							<MoreVertIcon />
						</IconButton>
					) : null
				}
				title={project.title}
			/>
			<Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				<MenuItem onClick={handleOpenEdit}>Изменить</MenuItem>
				<MenuItem onClick={handleDeleteDialog}>Удалить</MenuItem>
			</Menu>
			{image && <CardMedia className={classes.media} image={image} />}
			<CardContent className={classes.cardContent}>
				<div>
					<Typography variant="h6" className="text-base">
						Начало: <span className="text-gray-800">{project.startedAt}</span>
					</Typography>
					{project.activeStatus ? (
						<Typography variant="h6" className="text-base">
							Статус: <span className="text-gray-800">В разработке</span>{' '}
						</Typography>
					) : (
						<Typography variant="h6" className="text-base">
							Конец: <span className="text-gray-800">{project.endedAt}</span>
						</Typography>
					)}
					<Typography variant="body1" className="mt-20" color="textSecondary">
						<Link target="_blank" href={project.link} onClick={e => e.preventDefault}>
							Ссылка на проект
						</Link>
					</Typography>
					<Typography variant="body1" className="mt-20" color="textSecondary">
						<Link target="_blank" href={project.github} onClick={e => e.preventDefault}>
							Ссылка на GitHub
						</Link>
					</Typography>
				</div>
			</CardContent>
			<CardActions disableSpacing>
				<Button onClick={handleExpandClick} aria-label="Показать описание" className="text-left w-full">
					Показать описание
				</Button>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="Показать описание"
				>
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography paragraph>{project.description}</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
