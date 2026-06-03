const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const ORDER_CODE_PATTERN = /^MP-[0-9]{8}-[A-Z0-9]{4,8}$/;

function randomCode(length: number) {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * CODE_ALPHABET.length);
    return CODE_ALPHABET[index];
  }).join("");
}

export function generateOrderCode(date = new Date()) {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");

  const orderCode = `MP-${datePart}-${randomCode(6)}`;

  if (!ORDER_CODE_PATTERN.test(orderCode)) {
    throw new Error("Generated order code tidak sesuai format.");
  }

  return orderCode;
}
