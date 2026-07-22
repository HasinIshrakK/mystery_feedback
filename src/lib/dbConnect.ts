import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to DB");
        return;
    };

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB successfully", db.connections);

    } catch (error) {
        console.log("DB connection failed unexpectedly!", error);
        process.exit(1);
    }
};

export default dbConnection;