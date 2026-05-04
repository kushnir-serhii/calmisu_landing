import { FormValues } from "@/pages/DeleteAccountPage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export async function deleteAccount(values: FormValues): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/delete-account-web`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }
}