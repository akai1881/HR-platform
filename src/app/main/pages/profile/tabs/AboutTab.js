import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';

function AboutTab({ user }) {
	const [data, setData] = useState(null);
	// const userRole = useSelector(({ auth }) => auth.user.role);

	useEffect(() => {
		if (user) {
			setData(user);
		}
	}, [user]);

	if (!data) {
		return null;
	}

	const { career } = data;

	return (
		data && (
			<div className="md:flex max-w-2xl">
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
					>
						<Card className="w-full mb-16 rounded-8">
							<AppBar position="static" elevation={0}>
								<Toolbar className="px-8">
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
										Персональные данные
									</Typography>
								</Toolbar>
							</AppBar>

							<CardContent>
								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Фамилия Имя Отчество</Typography>
									<Typography>
										{user.lastName} {user.firstName} {user.patronymic}
									</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">ID паспорта</Typography>
									<Typography>{user.passportId}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Адрес проживания</Typography>

									<Typography>{user.adress}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Семейное положение</Typography>
									<Typography>{user.maritalStatus}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Ранг разработчика</Typography>
									<Typography>{user.rank}</Typography>
								</div>
							</CardContent>
						</Card>

						<Card className="w-full mb-16 rounded-8">
							<AppBar position="static" elevation={0}>
								<Toolbar className="px-8">
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
										Работа
									</Typography>
								</Toolbar>
							</AppBar>

							<CardContent>
								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Отдел</Typography>
									<Typography>{user.department.name}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Тимлид</Typography>
									<Typography>{user.teamLeader}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-20 text-15">Карьера</Typography>
									<Timeline align="right">
										{career.map(job => (
											<TimelineItem key={job.id}>
												<TimelineOppositeContent>
													<Typography variant="body2" color="textSecondary">
														C {job.startedAt}
													</Typography>
													<Typography variant="body2" color="textSecondary">
														по
													</Typography>
													<Typography variant="body2" color="textSecondary">
														{!job.status ? job.endedAt : 'настоящее время'}
													</Typography>
												</TimelineOppositeContent>
												<TimelineSeparator>
													<TimelineDot color="primary">
														<Icon color="inherit">work</Icon>
													</TimelineDot>
													<TimelineConnector />
												</TimelineSeparator>
												<TimelineContent>
													<Paper elevation={3} className="pt-6 pb-12 px-16">
														<Typography variant="h6" component="h1">
															{job.company}
														</Typography>
														<Typography>{job.position}</Typography>
													</Paper>
												</TimelineContent>
											</TimelineItem>
										))}
									</Timeline>
								</div>
							</CardContent>
						</Card>
					</FuseAnimateGroup>
				</div>

				<div className="flex flex-col md:w-512">
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
					>
						<Card className="w-full mb-16 rounded-8">
							<AppBar position="static" elevation={0}>
								<Toolbar className="px-8">
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
										Контакты
									</Typography>
								</Toolbar>
							</AppBar>
							<CardContent className="p-16">
								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">
										Собственный номер телефона
									</Typography>
									<Typography>{user.phone1}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">
										Дополнительные номера телефонов
									</Typography>
									<Typography>{user.phone2}</Typography>
									<Typography>{user.phone3}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Почта</Typography>
									<Typography>{user.email}</Typography>
								</div>
							</CardContent>
						</Card>

						<Card className="w-full mb-16 rounded-8">
							<AppBar position="static" elevation={0}>
								<Toolbar className="px-8">
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
										Банковские реквизиты
									</Typography>
								</Toolbar>
							</AppBar>
							<CardContent className="p-16">
								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Банк</Typography>
									<Typography>{user.bank}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Номер карты</Typography>
									<Typography>{user.creditCardNumber}</Typography>
								</div>

								<div className="mb-24">
									<Typography className="font-bold mb-4 text-15">Лицевой счет</Typography>
									<Typography>{user.accountNumber}</Typography>
								</div>
							</CardContent>
						</Card>
					</FuseAnimateGroup>
				</div>
			</div>
		)
	);
}

export default AboutTab;
