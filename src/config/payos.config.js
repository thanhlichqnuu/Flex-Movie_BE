import PayOS from "@payos/node";

const PAYOS_CLIENT_ID = Bun.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = Bun.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = Bun.env.PAYOS_CHECKSUM_KEY;

const payos = new PayOS(
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY
);

export default payos;