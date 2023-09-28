const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getInvitedUsers(token) {
  const res = await fetch(`${api_root}/invited-users?populate=*`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  try {
    if (!res.ok) {
      throw new Error(
        data.message || `Something went wrong. Status: ${res?.status}`
      );
    }
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(`getInvitedUsers Failed. Error: `, error);
    throw new Error(`getInvitedUsers Failed. Error: ${error}`);
  }
}

export async function inviteUser(token, data) {
  const res = await fetch(`${api_root}/invited-users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  try {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || `Something went wrong. Status: ${res?.status}`
      );
    }

    return true;
  } catch (error) {
    const { email } = data.data;
    console.error(`inviteUser Failed. email: ${email}, Error: `, error);
    throw new Error(`inviteUser Failed. email: ${email}, Error: ${error}`);
  }
}
