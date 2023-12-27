import axios from 'axios';
import { useContext, useState } from 'react';
import {Destination} from '../components/Structs.js';


const baseUrl = 'https://gm.colinsmale.eu/api/v1';

async function getStatus() {
    const configurationObject = {
        method: 'get',
        url: `${baseUrl}/status`,
    };
    var response;
    try {
        response = await axios(configurationObject);
    } catch (e) {
        console.log(e);
        return '??';
    }
    console.log(response.data);
    return response.data.status;
}

async function getUser(uid) {
    const configurationObject = {
        method: 'get',
        url: `${baseUrl}/users/${uid}`,
    };
    const response = await axios(configurationObject);
    console.log(response.data);
    return response.data;
}

async function loginUser(user, pw, deviceId) {
    var response;
    try {
        response = await axios.post(`${baseUrl}/login`,
            { user: user, password: pw, device: deviceId },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        console.log(JSON.stringify(e));
        return { error: e.message };
    }
    return response.data;
}

async function logoffUser(session, device) {
    var response;
    try {
        response = await axios.post(`${baseUrl}/session/${encodeURIComponent(session)}/logout`,
            { device: device},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        console.log(JSON.stringify(e));
        return { error: e.message };
    }
    return response.data;
}

async function resumeSession(session, deviceId) {
    var response;
    try {
        response = await axios.post(`${baseUrl}/session/${encodeURIComponent(session)}/resume`,
            { device: deviceId},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

async function changePassword(uid, oldpw, newpw) {
    var response;
    try {
        response = await axios.post(`${baseUrl}/users/${encodeURIComponent(uid)}/password`,
            { oldpassword: oldpw, newpassword: newpw },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

async function updateProfile(prof) {
    console.log(`updating profile: ${JSON.stringify(prof)}`);
    var response;
    try {
        response = await axios.put(`${baseUrl}/users/${encodeURIComponent(prof.id)}`,
            prof,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

async function searchDests(opts) {
    const configurationObject = {
        method: 'get',
        url: `${baseUrl}/dests/search`,
    };
    configurationObject.params = opts;
    console.log(`search: ${JSON.stringify(configurationObject)}`);
    const response = await axios(configurationObject);
    console.log(response.data);
    if(Array.isArray(response.data)) {
        return response.data.map((a) => {
            let d = new Destination();
            d.Id = a.id;
            d.Company = a.company;
            d.Postcode = a.postcode;
            d.Site = a.site;
            d.Unit = a.unit;
            d.Notes = a.notes;
            d.Longitude = a.lon;
            d.Latitude = a.lat;
            d.Dist = a.dist;
            return d;
        })
    }
    return response.data;
}

async function registerUser(prof) {
    var response;
    try {
        response = await axios.post(`${baseUrl}/users/register`,
            prof,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

async function addDest(dest) {
    var response;
    const data = {
        id: dest.Id,
        company: dest.Company,
        postcode: dest.Postcode,
        site: dest.Site,
        unit: dest.Unit,
        lat: dest.Latitude,
        lon: dest.Longitude,
        notes: dest.Notes
    };
    try {
        response = await axios.post(`${baseUrl}/dests`,
            data,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

async function updateDest(dest) {
    var response;
    const data = {
        id: dest.Id,
        company: dest.Company,
        postcode: dest.Postcode,
        site: dest.Site,
        unit: dest.Unit,
        lat: dest.Latitude,
        lon: dest.Longitude,
        notes: dest.Notes
    };
    try {
        response = await axios.put(`${baseUrl}/dests/${data.id}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

async function getW3w(lat, lon) {
    var response;
    try {
        response = await axios.get(`${baseUrl}/w3w?lat=${lat}&lon=${lon}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log(response.data);
    } catch (e) {
        return { error: e.message };
    }
    return response.data;
}

module.exports = {
    getStatus,
    getUser,
    loginUser,
    logoffUser,
    resumeSession,
    changePassword,
    searchDests,
    updateProfile,
    registerUser,
    addDest,
    updateDest,
    getW3w
}