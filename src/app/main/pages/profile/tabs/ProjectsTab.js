import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import ProjectCard from 'app/main/apps/e-commerce/product/components/ProjectCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ProjectsTab({ projects }) {
	const [data, setData] = useState(null);

	useEffect(() => {
		setData(projects);
	}, []);

	if (!data) {
		return null;
	}

	if (projects.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					Проекты отсутвуют
				</Typography>
			</div>
		);
	}

	return (
		data && (
			<div className="md:flex max-w-2xl">
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
					>
						<div className="flex flex-wrap p-10">
							{projects &&
								projects.map(project => (
									<ProjectCard key={project.id} project={project} menu={false} />
								))}
						</div>
					</FuseAnimateGroup>
				</div>
			</div>
		)
	);
}

export default ProjectsTab;
