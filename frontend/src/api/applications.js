const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getApplications() {
  const response = await fetch(`${API_URL}/api/applications`);

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
}

export async function createApplication(applicationData) {
  const response = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || "Failed to create application");
  }

  return response.json();
}