export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hub_id");

        
    } catch (error) {
        console.log("Error fetching classes", error);
    }


}