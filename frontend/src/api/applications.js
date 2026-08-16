const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getApplications() {
  const response = await fetch(`${API_URL}/api/applications`);

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
}

export async function getApplicationById(id) {
  const response = await fetch(
    `${API_URL}/api/applications/${id}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Application not found");
    }

    throw new Error("Failed to fetch application");
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

    throw new Error(
      error.error || "Failed to create application"
    );
  }

  return response.json();
}

export async function updateApplication(id, applicationData) {
  const response = await fetch(
    `${API_URL}/api/applications/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.error || "Failed to update application"
    );
  }

  return response.json();
}