import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setOrdersSearchText, getTime } from '../store/ordersSlice';
import { useParams, useHistory } from 'react-router';

function OrdersHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);
	const time = useSelector(({ eCommerceApp }) => eCommerceApp.orders.time);
	const mainTheme = useSelector(selectMainTheme);
	const params = useParams();
	const history = useHistory();

	useEffect(() => {
		dispatch(getTime(params.dayId));
	}, [params]);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<Typography
					className="normal-case flex items-center"
					role="button"
					color="inherit"
					onClick={() => history.push('/apps/calendar')}
				>
					<Icon className="text-20">arrow_back</Icon>
					<span className="mx-4">Назад</span>
				</Typography>

				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="text-32">people</Icon>
				</FuseAnimate>

				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
						Сотрудники
					</Typography>
				</FuseAnimate>
			</div>

			<div className="flex flex-1 items-center justify-center px-12">
				<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
						<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
							Дата: {time}
						</Typography>
					</FuseAnimate>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default OrdersHeader;
