import { QueryResult } from "pg";
import { PGClient } from "./PGClient";
import { query } from "./query";
import { CassandraClient } from "./CassandraClient";
import { config } from "../config";

class QueryManager {
    private static instance: QueryManager;
    private dbclient: PGClient;
    private cassandraClient: CassandraClient;


    private constructor() {
        this.dbclient = PGClient.getInstance(
            config.DB1.database,
            config.DB1.user,
            config.DB1.password,
            config.DB1.host,
            5432,
            10,
            100
        );

        this.cassandraClient = CassandraClient.getInstance(
            [config.DB2.host],
            config.DB2.localDataCenter
        );
        this.initializeTables();
    }

    private initializeTables(): void {
        const tables = [
            query.createTable.users,
            query.createTable.elements,
            query.createTable.avatars,
            query.createTable.userSpace,

        ];

        const tablesCassandra = [
            query.createKeyspaceQuery,
            query.createTable.space,
            query.createTable.map
        ];

        tables.forEach(async (table) => {
            try {
                await this.dbclient.executeQuery(table);
            } catch (error) {
                console.error('Error initializing table: PG', error);
            }
        });
        tablesCassandra.forEach(async (table) => {
            try {
                await this.cassandraClient.executeQuery(table);
            } catch (error) {
                console.error('Error initializing table: Cassandra', error);
            }
        });
        console.log('Table Created Sucessfully');
    }

    public static getInstance(): QueryManager {
        if (!QueryManager.instance) {
            QueryManager.instance = new QueryManager();
        }
        return QueryManager.instance;
    }

    public async fetchData(query: string, params: any[] = []): Promise<QueryResult | boolean> {
        try {
            return await this.dbclient.executeQuery(query, params);
        } catch (error) {
            console.error('Error fetching data:', error);
            return false;
        }
    }

    public async userSignupMessage(messageContent: string | undefined): Promise<void> {
        if (!messageContent) {
            console.error('No message content provided');
            return;
        }
        try {
            const data = JSON.parse(messageContent);

            if (!data.id || !data.username || !data.password || !data.type) {
                console.error('Invalid user data provided:', data);
                return;
            }
            const isSuccessful = await this.executeInsert(query.insertQuery.addUser, [data.id, data.username, data.password, data.type], 'User Added');
            if (isSuccessful) {
                console.log("Insert operation was successful.");
            } else {
                console.log("Insert operation failed.", data, );
            }

        } catch (error) {
            console.log('Error processing user message:', messageContent, query.insertQuery.addUser);
        }
    }

    // public async processElementMessage(messageContent: string | undefined, partition: number): Promise<void> {
    //     if (!messageContent) {
    //         console.error('No message content provided');
    //         return;
    //     }

    //     try {
    //         const data = JSON.parse(messageContent);

    //         switch (partition) {
    //             case 1: // Add Element Admin
    //                 await this.executeInsert(
    //                     query.insertQuery.addElementAdmin,
    //                     [data.id, data.url, data.size, data.staticElement, data.name],
    //                     'Element'
    //                 );
    //                 break;
    //             case 2: // Update Element Admin
    //                 await this.executeInsert(query.insertQuery.updateElementAdmin, [data.id, data.url], 'Element');
    //                 break;
    //             case 3: // Add Avatar
    //                 await this.executeInsert(query.insertQuery.addAvatar, [data.id, data.name, data.url], 'Avatar');
    //                 break;
    //             case 4: // Add Map
    //                 await this.executeInsert(
    //                     query.insertQuery.addMap,
    //                     [data.id, data.url, data.name, data.dimensions],
    //                     'Map'
    //                 );
    //                 break;
    //             default:
    //                 console.log('Unknown partition:', partition);
    //                 break;
    //         }
    //     } catch (error) {
    //         console.error('Error processing element message:', error);
    //     }
    // }

    // private async executeInsert(query: string, params: any[], entityName: string): Promise<void> {
    //     try {
    //         const result = await this.dbclient.executeQuery(query, params);
    //         console.log(result);
    //         if (result && result.rows && result.rows.length > 0) {
    //             console.log(`${entityName} operation successful:`, result.rows);
    //         } else {
    //             console.error(`Failed to execute operation for ${entityName}`);
    //         }
    //     } catch (error) {
    //         console.error(`Error executing operation for ${entityName}:`, error);
    //     }
    // }
    private async executeInsert(query: string, params: any[], entityName: string): Promise<boolean> {
        try {
            const result = await this.dbclient.executeQuery(query, params);
            if (result) {
                console.log(`${entityName} operation successful.`);
                return true;  // Indicating the operation was successful
            } else {
                console.error(`Failed to execute operation for ${entityName}`);
                return false;  // Indicating failure
            }
        } catch (error) {
            console.error(`Error executing operation for ${entityName}:`, error);
            return false;  // Indicating failure
        }
    }

}

// Usage
const queryManager = QueryManager.getInstance();

export { queryManager };
