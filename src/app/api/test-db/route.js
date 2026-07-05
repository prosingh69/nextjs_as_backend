import { ConnectToDB } from "@/lib/mongodb";
import Review from "@/model/review"; 
export async function GET() {
    try {
        await ConnectToDB();
        const reviews = await Review.find({}).limit(1);
        
        return Response.json({ 
            success: true, 
            message: "MongoDB connection successful, Bhai!", 
            databaseData: reviews 
        });
    } catch (error) {
        return Response.json({ 
            success: false, 
            message: "Database se connect nahi ho paya!", 
            error: error.message 
        }, { status: 500 });
    }
}