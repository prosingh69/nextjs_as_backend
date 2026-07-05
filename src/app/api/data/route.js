import { ConnectToDB } from "@/lib/mongodb";
import Review from "@/model/review";

export async function GET() {
    try {
        await ConnectToDB();

        const reviews = await Review.find({});

        return Response.json({ 
            success: true, 
            data: reviews 
        });

    } catch (error) {
        return Response.json({ 
            success: false, 
            message: "Failed to fetch data.", 
            error: error.message 
        }, { status: 500 });
    }
}