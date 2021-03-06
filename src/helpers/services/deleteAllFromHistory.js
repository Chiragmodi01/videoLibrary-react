import axios from 'axios';

const deleteAllFromHistory = async(dispatch) => {
    const encodedToken = localStorage.getItem("token");

    const Headers = { authorization: encodedToken}

    try {
        const res = await axios.delete(`/api/user/history/all`, {headers: Headers});
        dispatch({ type: "SET_HISTORY_ARRAY", payload: res.data.history})
    } catch(e) {
        console.log(e.message)
    }
}

export { deleteAllFromHistory };