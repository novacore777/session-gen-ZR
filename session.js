import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import fs from "fs-extra"

export async function startPairing(number) {
  const { state, saveCreds } = await useMultiFileAuthState("./sessions")

  const sock = makeWASocket({
    auth: state,
    pairingCode: true,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  const code = await sock.requestPairingCode(number)

  return new Promise((resolve) => {
    sock.ev.on("connection.update", async (update) => {
      if (update.connection === "open") {
        const data = fs.readFileSync("./sessions/creds.json")
        const session = Buffer.from(data).toString("base64")
        resolve({
          pairing_code: code,
          SESSION_ID: session
        })
      }
    })
  })
}
