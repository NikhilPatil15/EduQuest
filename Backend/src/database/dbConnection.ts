import mongoose from 'mongoose';
import { databaseName, databaseUrl } from '../config/settings';

export const connectDatabase = async () => {
	try {
		console.log('Connecting...');
		/* Database connection */
		const connectionInstance = await mongoose.connect(`${databaseUrl}/${databaseName}`);

		console.log('Mongodb server connected: ', connectionInstance.connection.host);
	} catch (error) {
		console.log('Error while connecting to the database: ', error);
		process.exit(1);
	}
};