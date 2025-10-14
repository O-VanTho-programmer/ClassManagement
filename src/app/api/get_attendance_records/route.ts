export async function GET(req: Request){
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("class_id");

        // Bu's Work

    } catch (error) {
        
    }
}