
const BASE_URL = 'http://localhost:3001/api'
// const BASE_URL = 'https://social-polling-app-backend.onrender.com/api'

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        SIGNUP: `${BASE_URL}/auth/signup`,
        GET_SESSION: `${BASE_URL}/auth/session`,
    },
    POLLS: {
        CREATE_POLL: `${BASE_URL}/polls/poll/create`,
        DELETE_POLL: (pollId: string) => `${BASE_URL}/polls/poll/${pollId}`,
        UPDATE_POLL: (pollId: string) => `${BASE_URL}/polls/poll/${pollId}`,
        GET_ALL_BY_USER_ID: (userId: string) => `${BASE_URL}/polls/${userId}`,
        SUBMIT_VOTE_FOR_POLL:`${BASE_URL}/votes/vote`,
    },
}
