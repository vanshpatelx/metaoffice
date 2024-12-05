import { Client, ClientOptions } from 'cassandra-driver';

class CassandraClient {
    private static instance: CassandraClient;
    private client: Client;

    private constructor(contactPoints: string[], localDataCenter: string, keyspace?: string, options?: Partial<ClientOptions>) {
        this.client = new Client({
            contactPoints,
            localDataCenter,
            keyspace,
            ...options,
        });
    }

    public static getInstance(contactPoints: string[], localDataCenter: string, keyspace?: string, options?: Partial<ClientOptions>): CassandraClient {
        if (!CassandraClient.instance) {
            CassandraClient.instance = new CassandraClient(contactPoints, localDataCenter, keyspace, options);
        }
        return CassandraClient.instance;
    }

    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            console.log('Connected to Cassandra cluster');
        } catch (error) {
            console.error('Error connecting to Cassandra cluster:', error);
            throw error;
        }
    }

    public async executeQuery(query: string, params?: any[]): Promise<any> {
        try {
            const result = await this.client.execute(query, params, { prepare: true });
            return result.rows;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    public async shutdown(): Promise<void> {
        try {
            await this.client.shutdown();
            console.log('Cassandra client disconnected');
        } catch (error) {
            console.error('Error shutting down Cassandra client:', error);
        }
    }
}

export { CassandraClient };
