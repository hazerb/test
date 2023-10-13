import { API_BASE_URL } from '../config/config';

export async function fetchData(endpoint, token=null) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
        },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function postData(endpoint, data, token=null) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
}