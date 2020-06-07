import queryString from 'query-string';
import toastr from "toastr/build/toastr.min.js";
const baseURL = localStorage.getItem('baseURL') || location.origin;
function handleError (res) {
    if (!res.ok) {
        console.error(res.statusText);
        return res.json().then(data => {
            // toastr.error(data.message);
            throw Error(data.message);
        });
    }
    return res;
}
const api = {
    getHeaders: () => ({
        'Content-Type': 'application/json',
    }),
    getAllLocations: async function() {
        const apiInstance = this;
        const result = await fetch(`${baseURL}/api/location`, {
            method: "GET",
            headers: apiInstance.getHeaders()
        }).then(handleError)
        return result.json();
    },
    createLocation: async function(newLoc) {
        if (newLoc._id) return;
        const apiInstance = this;
        const result = await fetch(`${baseURL}/api/location`, {
            method: "POST",
            headers: apiInstance.getHeaders(),
            body: JSON.stringify(newLoc)
        }).then(handleError);
        return result.json();

    },
    deleteLocation: async function(locId) {
        if (!locId) return;
        const apiInstance = this;
        const result = await fetch(`${baseURL}/api/location/${locId}`, {
            method: "DELETE",
            headers: apiInstance.getHeaders(),
        }).then(handleError);
        return result.json();
    },
    search: async function (searchString) {
        const apiInstance = this;
        const query = queryString.stringify({ search: searchString });
        const result = await fetch(`${baseURL}/api/location?${query}`, {
            method: "GET",
            headers: apiInstance.getHeaders()
        }).then(handleError);
        return result.json();
    },
    updateLocation: async function(locId, newLoc) {
        const apiInstance = this;
        const result = await fetch(`${baseURL}/api/location/${locId}`, {
            method: "PUT",
            headers: apiInstance.getHeaders(),
            body: JSON.stringify(newLoc)
        }).then(handleError);
        return result.json();
    },
    getGoogleAPIKey: async function() {
        const apiInstance = this;
        const result = await fetch(`${baseURL}/api/google-key`, {
            method: "GET",
            headers: apiInstance.getHeaders()
        }).then(handleError);
        return result.json();
    }
}
export default api;
