import React,{useEffect,useState,useRef} from 'react';
import {View,TextInput,StyleSheet,Button,Text,Image, TouchableOpacity,ToastAndroid} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup'
import {useSelector,useDispatch} from 'react-redux';
import * as GETAPI from '../../util/fetchApi';
import LoadingCircle from './loadingCircle';
import { SetHTTP } from '../../util/setHTTP';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getUser} from '../../util/getUser';
import ModalPickImage from './modalPickImage';
const editProfileValidationSchema = yup.object().shape({
    name: yup
        .string()
        .min(5, ({ min }) => `Họ tên có ít nhất ${min} ký tự`)
        .required('Nhập họ tên!!')
    ,
    phone: yup
        .string()
        .min(10, ({ min })=> `Số diện thoại ít nhất là ${min} số`)
        .required('Nhập số điện thoại')
    ,
    address: yup
        .string()
        .required('Vui lòng nhập địa chỉ')
    
})
export default function EditProfile({navigation}){
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [showContent, setshowContent] = useState(false);
    const formRef = useRef();
    const dispatch = useDispatch();
    const [visibleModalPickImg, setvisibleModalPickImg] = useState(false);
    const onCloseModalPick = ()=>setvisibleModalPickImg(false);
    useEffect(() => {
        navigation.setOptions({
            headerShown:true,
            title:"Chỉnh sửa thông tin cá nhân",
            headerStyle: {
                height:50
            },
            headerTitleStyle: {
                fontSize:16
            },
        });
        setshowContent(false)
        getInforUser()
    },[currentUser])
    const getInforUser = async() => {
        const data = {"idUser":currentUser.id}
        const res = await GETAPI.postDataAPI("/user/getInforUser",data)
        formRef.current.setValues(res[0])
        if(res[0].phone==null){
            formRef.current.setValues({...formRef.current.values,phone:""})
        }
        if(res[0].address==null){
            formRef.current.setValues({...formRef.current.values,address:""})
        }
        setshowContent(true)
    }
    const handleUpdateProfile = async()=>{
        const dataUser = formRef.current.values
        const res = await GETAPI.postDataAPI("/user/updateProfile",{data:dataUser});
        if(res.msg){
            if(res.msg==="Success"){
                ToastAndroid.show("Chỉnh sửa thành công !", ToastAndroid.SHORT);
                refreshUser()
            }else{
                ToastAndroid.show("Có lỗi rồi !", ToastAndroid.SHORT);
            }
        }
    }
    const refreshUser = async()=>{
        const token =  await AsyncStorage.getItem("@token");
        getUser(token,dispatch)
    }
    return(
        <View style={styles.wrapper}>
            <ModalPickImage 
                visible={visibleModalPickImg} 
                onClose={onCloseModalPick}
                status_avatar = {currentUser.avartar}
                idUser = {currentUser.id}
                refresh = {refreshUser}
            />
            <Formik
                validationSchema={editProfileValidationSchema}
                innerRef={formRef}
                onSubmit={handleUpdateProfile}
            >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
                touched 
            }) => (
                <View style={{ flex:1,alignItems: 'center'}}>
                {showContent ?
                    <>
                    <TouchableOpacity
                        style={{paddingTop:20}}
                        onPress={()=>setvisibleModalPickImg(true)}
                    >
                        {values.avartar===null ?
                            <FontAwesome name="user-circle-o" color="gray" size={85}/>         
                            :
                            <Image source={{ uri:SetHTTP(values.avartar) }} resizeMode="cover"
                            style={{width: 95, height: 95, borderColor: 'red', borderWidth: 0.5, borderRadius: 50}} />
                        }
                    </TouchableOpacity>
                    <TextInput 
                        name="username"
                        placeholder="Nhập tên đăng nhập"
                        style={styles.textInput}
                        value={values.username}
                        selectTextOnFocus={false}
                        editable={false}
                    />
                    <TextInput 
                        name="email"
                        placeholder="Nhập email đăng nhập"
                        style={styles.textInput}
                        value={values.email}
                        editable={false} 
                        selectTextOnFocus={false}
                    />
                    <TextInput 
                        name="name"
                        placeholder="Nhập họ và tên"
                        onBlur={handleBlur('name')}
                        onChangeText={handleChange('name')}
                        style={[errors.name && touched.name ?{...styles.textInput,borderColor: 'red'}
                        :{...styles.textInput}]}
                        value={values.name}
                    />
                    {(errors.name && touched.name) &&
                        <Text style={styles.errorText}>{errors.name}</Text>
                    }
                    <TextInput 
                        name="address"
                        placeholder="Nhập địa chỉ"
                        onBlur={handleBlur('address')}
                        onChangeText={handleChange('address')}
                        style={[errors.address && touched.address ?{...styles.textInput,borderColor: 'red'}
                        :{...styles.textInput}]}
                        value={values.address}
                    />
                    {(errors.address && touched.address) &&
                        <Text style={styles.errorText}>{errors.address}</Text>
                    }
                    <TextInput 
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        onBlur={handleBlur('phone')}
                        onChangeText={handleChange('phone')}
                        style={[errors.phone && touched.phone ?{...styles.textInput,borderColor: 'red'}
                        :{...styles.textInput}]}
                        value={values.phone}
                    />
                    {(errors.phone && touched.phone) &&
                        <Text style={styles.errorText}>{errors.phone}</Text>
                    }
                    <View style={{ paddingTop:10 }}>
                        <Button
                            onPress={handleSubmit}
                            title="cập nhật"
                            color="tomato"
                        />
                    </View>
                    </>
                    : 
                    <View style={{ flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <LoadingCircle />
                    </View>
                }
                </View>
            )   
            }
            </Formik>
           
           
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        flex: 1
    },
    textInput: {
        height: 40,
        width: '80%',
        margin: 10,
        borderColor: 'gray',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        color:"black",
        paddingLeft:20,
        paddingRight:40
    },
    errorText: {
        marginLeft:10,
        fontSize: 14,
        color: 'red',
    }
})