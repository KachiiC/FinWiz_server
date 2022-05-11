import axios from 'axios'

export const getRequest = (url: string) => {
    return axios.request({
        method: "GET",
        url: url
    })
}

export const getRequestWithHeaders = (url: string, headers: {[x: string]: string }) => {
    return axios.request({
        method: "GET",
        url: url,
        headers: headers
    })
}