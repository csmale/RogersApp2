import axios from 'axios';
import { useContext, useState } from 'react';


const baseUrl = 'https://gm.colinsmale.eu';

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
        url: `${baseUrl}/user/${uid}`,
    };
    const response = await axios(configurationObject);
    console.log(response.data);
    return response.data;
}

async function loginUser(user, pw) {
    var response;
    try {
        response = await axios.post(`${baseUrl}/login`,
            { user: user, password: pw },
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
    return response.data;
}

module.exports = {
    getStatus,
    getUser,
    loginUser,
    searchDests
}