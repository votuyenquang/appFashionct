
// import {API_URL} from "@env"

const API_URL  = 'http://192.168.1.140:3001'
// const API_URL = 'http://192.168.56.1:3001'

export const SetHTTP = (urlImage)=>{
    if(urlImage.includes('http')){
        // console.log('SetHTTP :', API_URL+urlImage)
        return urlImage
    }else{      
        return API_URL+urlImage
    }

}

