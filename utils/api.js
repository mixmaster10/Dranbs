import axios from "axios";
import config from "../config";

export const registerUser = async (payload) => {
    return await axios.post(`${config.domain}/api/users`, payload)
}

export const loginUser = async (payload) => {
    return await axios.post(`${config.domain}/api/sessions`, payload)
}

export const socialLogin = async (provider, payload) => {
    const response = await axios.post(`${config.domain}/api/social-login/${provider}`, payload)
    return response.data
}

export const sendResetPasswordLink = async (payload) => {
    const response = await axios.post(`${config.domain}/api/send-reset-password-link`, payload);
    return response.data
}

export const resetPassword = async (payload) => {
    const response = await axios.post(`${config.domain}/api/reset-password`, payload)
    return response.data
}

export const getProfile = async (token) => {
    const response = await axios.get(`${config.domain}/api/profile`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        }
    })
    return response.data
}

export const patchProfile = async (token, payload) => {
    const response = await axios.patch(`${config.domain}/api/profile`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getProducts = async (token, page, siteType, isAll, gender, period) => {
    const response = await axios.get(`${config.domain}/api/products?page=${page}&site_type=${siteType}&all=${isAll}&gender=${gender}&period=${period}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getProductsByBrand = async (token, brandName, page, siteType, gender, period) => {
    const response = await axios.get(`${config.domain}/api/products/${brandName}?site_type=${siteType}&gender=${gender}&period=${period}&page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getProductsByBoard = async (token, username, slug, page) => {
    const response = await axios.get(`${config.domain}/api/products/${username}/${slug}?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleFollowBrand = async (token, brandName) => {
    const response = await axios.post(`${config.domain}/api/toggle-follow-brand`, {
        name: brandName
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBrandInfo = async (token, brandName) => {
    const response = await axios.get(`${config.domain}/api/brand/${brandName}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleLoveProduct = async (token, productId) => {
    const response = await axios.post(`${config.domain}/api/toggle-love-product`, {
        id: productId
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getMyLoves = async (token, page) => {
    const response = await axios.get(`${config.domain}/api/my-loves?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const createBoard = async (token, payload) => {
    const response = await axios.post(`${config.domain}/api/boards`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBoards = async (token, page, productId, sortType) => {
    const response = await axios.get(`${config.domain}/api/boards?page=${page}&product_id=${productId}&order=${sortType}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleProductSaved = async (token, payload) => {
    const response = await axios.post(`${config.domain}/api/toggle-product-saved`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBoardsByCreator = async (token, username, page) => {
    const response = await axios.get(`${config.domain}/api/boards/${username}?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBoardInfo = async (token, username, slug) => {
    const response = await axios.get(`${config.domain}/api/board/${username}/${slug}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleFollowBoard = async (token, username, slug) => {
    const response = await axios.post(`${config.domain}/api/toggle-follow-board`, {
        slug: slug,
        username: username,
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const deleteBoard = async (token, username, slug) => {
    const response = await axios.delete(`${config.domain}/api/board/${username}/${slug}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const changeBoardInfo = async (token, username, slug, payload) => {
    const response = await axios.post(`${config.domain}/api/board/${username}/${slug}`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const uploadBoardImage = async (token, username, slug, formData, onUploadProgress) => {
    const response = await axios.post(`${config.domain}/api/board/${username}/${slug}/image`, formData, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onUploadProgress
    })
    return response.data
}

export const getMyFollowings = async (token, page) => {
    const response = await axios.get(`${config.domain}/api/my-followings?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const submitTicket = async (payload) => {
    const response = await axios.post(`${config.domain}/api/tickets`, payload)
    return response.data
}

export const getNewCount = async (token) => {
    const response = await axios.get(`${config.domain}/api/new-count`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}