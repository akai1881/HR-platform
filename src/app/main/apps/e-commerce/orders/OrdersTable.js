import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import OrdersStatus from '../order/OrdersStatus';
import { selectOrders, getOrders, getUsersData } from '../store/ordersSlice';
import OrdersTableHead from './OrdersTableHead';
import { LocalConvenienceStoreOutlined } from '@material-ui/icons';

function OrdersTable(props) {
	const dispatch = useDispatch();
	const orders = useSelector(({ eCommerceApp }) => eCommerceApp.orders.users);
	// const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);
	const params = useParams();
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState([]);
	const [users, setUsers] = useState(null);
	const [page, setPage] = useState(0);
	const [time, setTime] = useState(new Date());
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		// dispatch(getOrders()).then(() => setLoading(false));
		dispatch(getUsersData(params.dayId));
	}, [dispatch]);

	useEffect(() => {
		// if (searchText.length !== 0) {
		// 	setData(FuseUtils.filterArrayByString(orders, searchText));
		// 	setPage(0);
		// } else {
		// }
		if (orders.length > 0) {
			setLoading(false);
		}
		console.log('this is orders', orders);
	}, [orders]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function formatTimes(date) {
		return new Date(date).toLocaleTimeString();
	}

	function handleClick(item) {
		props.history.push(`/pages/profile/${item.id}`);
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				{orders.length > 0 ? (
					<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
						<OrdersTableHead
							numSelected={selected.length}
							order={order}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={orders.length}
						/>

						<TableBody>
							{orders.map(n => {
								const isSelected = selected.indexOf(n.id) !== -1;
								console.log(n.firstName);
								return (
									<TableRow
										className="h-64 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.firstName} {n.lastName}
										</TableCell>

										{/* <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
											{n.lastName}
										</TableCell> */}

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.phone}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.department}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<OrdersStatus name={n.isLate} />
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.date.slice(0, 10).split('-').reverse().join('-')} {formatTimes(n.date)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : null}
			</FuseScrollbars>

			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={orders.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(OrdersTable);
