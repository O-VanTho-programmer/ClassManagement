import api from "../axios";

export async function checkFaceAuthEnable(public_id:string): Promise<boolean> {
    try {
        const res = await api.get(`/face_recognition/check_enable?public_id=${public_id}`);

        return res.data.isEnable;
    } catch (error) {
        return false;
    }
}