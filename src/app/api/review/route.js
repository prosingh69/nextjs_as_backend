import { ConnectToDB } from "@/lib/mongodb";
import Review from "@/model/review";

export async function POST(request) {
    try {
        await ConnectToDB();

        const { name, rating, review , images} = await request.json();

        if (!name || !rating || !review) {
            return Response.json({ 
                success: false, 
                message: "Name, rating, and review are required!" 
            }, { status: 400 });
        }

        const newReview = await Review.create({
            name,
            rating,
            review,
            images,
        });

        return Response.json({ 
            success: true, 
            message: "Review submitted successfully!", 
            data: newReview 
        }, { status: 201 });

    } catch (error) {
        return Response.json({ 
            success: false, 
            message: "Failed to submit review.", 
            error: error.message 
        }, { status: 500 });
    }
}