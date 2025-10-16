// src/services/paymentService.js
export const simulatePayment = async (bookingId, token) => {
  try {
    const response = await fetch(`/api/payment/simulate?bookingId=${bookingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Payment failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error simulating payment:", error);
    throw error;
  }
};
