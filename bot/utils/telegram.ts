import { TG_TOKEN, TG_CHANNEL } from "../config";

export async function sendTelegramNotif(message: string) {
    try {
        const req = await fetch(`https://api.telegram.org/${TG_TOKEN}/sendMessage?chat_id=${TG_CHANNEL}&text=${encodeURIComponent(message)}&parse_mode=Markdown`, { method: 'GET', redirect: 'follow' })
        const res = await req.json()
        return res
    } catch (e) {
        console.error(e)
    }
}