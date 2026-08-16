const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getApplications() {
  const response = await fetch(`${API_URL}/api/applications`);

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
}