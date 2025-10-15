export async function GET(req: Request){
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("class_id");

        // Bu's Work
        // Yêu cầu cho Bu
        // Có ClassId => lấy dữ liệu của record_attendance và thông tin của học sinh tương ứng

    } catch (error) {
        
    }
}