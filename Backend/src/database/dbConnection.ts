import mongoose from 'mongoose';
import { databaseName, databaseUrl } from '../config/settings';

let memoryServer: any = null;

export const connectDatabase = async () => {
	try {
		console.log('Connecting to database...');
		const isBadCluster = databaseUrl && databaseUrl.includes('cluster0.nlgup.mongodb.net');
		const useMemory = process.env.USE_MEMORY_DB === 'true' || isBadCluster || !databaseUrl;

		if (useMemory) {
			console.log('⚙️ Initializing In-Memory MongoDB server...');
			const { MongoMemoryServer } = await import('mongodb-memory-server');
			memoryServer = await MongoMemoryServer.create();
			const uri = memoryServer.getUri();
			console.log('✅ In-Memory MongoDB started at:', uri);
			await mongoose.connect(uri);
			console.log('✅ Mongodb connected (in-memory mode)');
			return;
		}

		/* Database connection */
		const connectionInstance = await mongoose.connect(`${databaseUrl}/${databaseName}`, {
			serverSelectionTimeoutMS: 5000,
		});

		console.log('Mongodb server connected: ', connectionInstance.connection.host);
	} catch (error: any) {
		console.warn('⚠️ Could not connect to primary MongoDB:', error?.message || error);
		console.log('🔄 Falling back to In-Memory MongoDB server...');
		try {
			const { MongoMemoryServer } = await import('mongodb-memory-server');
			memoryServer = await MongoMemoryServer.create();
			const uri = memoryServer.getUri();
			await mongoose.connect(uri);
			console.log('✅ Mongodb connected to In-Memory fallback at:', uri);
		} catch (memError) {
			console.error('❌ Error while connecting to database:', memError);
			process.exit(1);
		}
	}
};

process.on('SIGINT', async () => {
	if (memoryServer) await memoryServer.stop();
	process.exit(0);
});
process.on('SIGTERM', async () => {
	if (memoryServer) await memoryServer.stop();
	process.exit(0);
});