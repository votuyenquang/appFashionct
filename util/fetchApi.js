// import {API_URL} from "@env"
const API_URL  = 'http://192.168.1.140:3001'
// const API_URL = 'http://192.168.56.1:3001'


export const getAPI = async(url)=>{
    console.log("url",API_URL+url)
    const res = await fetch(API_URL+url,
         {
        method:'GET',
        headers:{
            'Accept':'application/json',
            'Content-Type' :'application/json'
        }})
    .then((response)=>response.json())
    .then((responseJson)=>{
       
        return responseJson;
        
    })
    .catch((err)=>{
        console.log(err)
    })
    // console.log("log: ",res)
    return res;
}
export const postDataAPI = async(url,data)=>{
    const res = await fetch(API_URL+url,{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type' :'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response)=>response.json())
    .then((responseJson)=>{
        return responseJson;
    }
    )
    .catch((err)=>{
      console.log(err)
    })
    return res;
}