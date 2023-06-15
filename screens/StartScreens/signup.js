import React,{useState,useRef} from "react";
import {View, Text,ImageBackground,StyleSheet,Button,TextInput,TouchableOpacity,Modal,Image} from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import * as GETAPI from '../../util/fetchApi';
import bglogin from '../../assets/image/bg-login.jpg'
import Entypo from 'react-native-vector-icons/Entypo';
import img_success from '../../assets/image/success-24.png';
const signupValidationSchema = yup.object().shape({
    name: yup
        .string()
        .min(5, ({ min }) => `Họ tên có ít nhất ${min} ký tự`)
        .required('Nhập họ tên!!')
    ,
    username: yup
        .string()
        .min(3, ({ min }) => `Tên đăng nhập có ít nhất ${min} ký tự`)
        .required('Nhập tên đăng nhập !!')
        .test("username_async_validation", "Tài khoản đã tồn tại",async function (value) { // Use function
            const res = await GETAPI.postDataAPI("/user/checkUsername",{'username':value})
            if(res.msg==="The Username already in use"){
                return false
            }else{
                return true
            }
        })
    ,
    email: yup
        .string()
        .email("Vui lòng nhập đúng định dạng Email")
        .required('Nhập Email !!')
        .test("email_async_validation", "Email đã tồn tại",async function (value) { // Use function
            const res = await GETAPI.postDataAPI("/user/checkEmail",{'email':value})
            if(res.msg==="The E-mail already in use"){
                return false
            }else{
                return true
            }
        })
    ,   
    password: yup
        .string()
        .min(6, ({ min }) => `Mật khẩu có ít nhất ${min} ký tự`)
        .required('Nhập mật khẩu để đăng nhập')
    ,
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Vui lòng nhập lại trùng khớp')
        .required('Nhập lại mật khẩu'),
})

export default function SignUp ({navigation}){
    const [hidePass, sethidePass] = useState(true);
    const [showModalSuccess, setshowModalSuccess] = useState(false);
    const formRef = useRef();
    const handleRegister = async(values)=>{
        console.log("trunghvhkvf", values)
        const res = await GETAPI.postDataAPI("/user/register",values)
        if(res.success){
            setshowModalSuccess(true)

        }
        
    }
    const ModalSuccess = ()=>(
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModalSuccess}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{ fontWeight:'bold',marginBottom:10,fontSize:16 }}>Đăng ký thành công !!</Text>
                    <Image source={img_success} style={{width:60,height:60,marginBottom:10}}/>
                    <Text>Bạn có muốn đăng nhập ngay ?</Text>
                    <View style={{width:'80%',flexDirection: 'row',justifyContent:'space-around',paddingTop:10 }}>
                        <TouchableOpacity 
                            style={{ padding:10,backgroundColor:'blue',width:80,alignItems:'center',borderRadius:10 }}
                            onPress={()=>{
                                console.log(formRef.current.values)
                                navigation.replace("login",{
                                    username: formRef.current.values.username,
                                    password: formRef.current.values.password,
                                })
                                }
                            }
                        >
                            <Text style={{ color:'white' }}>Có</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{ padding:10,backgroundColor:'red',width:80,alignItems:'center',borderRadius:10  }}
                            onPress={()=>{
                                formRef.current.resetForm();
                                setshowModalSuccess(false)
                            }}
                        >
                            <Text style={{ color:'white' }}>Để sau</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
    return(
        <View style={styles.wrapper}>
            <ImageBackground source={bglogin} resizeMode="cover" style={styles.background}>
            <View style={styles.child}>
                <Text style={{ color:'white',fontSize: 28,fontWeight:'bold',fontFamily:"Comforter"}}>CTFASHION</Text>
                <Text style={{ color:'white',marginBottom:10 }}>Just beautyful for you</Text>
                <Formik
                    validationSchema={signupValidationSchema}
                    innerRef={formRef}
                    initialValues={{ email:'',username: '', password: '',name:'',confirmPassword:'' }}
                    onSubmit={handleRegister}
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
                        <>
                        <View style={styles.wrapperInput}>
                            <Entypo name="round-brush" size={20} color="white" style={styles.inputIcon}/>
                            <TextInput
                                name="name"
                                placeholder="Nhập tên họ tên"
                                style={[errors.name&&touched.name?{...styles.textInput,borderColor: 'red'}
                                :{...styles.textInput}]}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                placeholderTextColor="gray"
                                value={values.name}
                            />
                        </View>
                        {(errors.name &&touched.name)&&
                            <Text style={styles.errorText}>{errors.name}</Text>
                        }
                        <View style={styles.wrapperInput}>
                            <Entypo name="user" size={20} color="white" style={styles.inputIcon}/>
                            <TextInput
                                name="username"
                                placeholder="Nhập tên đăng nhập"
                                style={[errors.username&& touched.username?{...styles.textInput,borderColor: 'red'}
                                :{...styles.textInput}]}
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                placeholderTextColor="gray"
                                value={values.username}
                            />
                        </View>
                        {(errors.username && touched.username)&&
                            <Text style={styles.errorText}>{errors.username}</Text>
                        }
                           <View style={styles.wrapperInput}>
                            <Entypo name="email" size={20} color="white" style={styles.inputIcon}/>
                            <TextInput
                                name="email"
                                placeholder="Nhập tên email"
                                style={[errors.email&& touched.email?{...styles.textInput,borderColor: 'red'}
                                :{...styles.textInput}]}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                placeholderTextColor="gray"
                                value={values.email}
                                keyboardType="email-address"
                            />
                        </View>
                        {(errors.email && touched.email)&&
                            <Text style={styles.errorText}>{errors.email}</Text>
                        }
                        <View style={styles.wrapperInput}>
                            <Entypo name="lock" size={20} color="white" style={styles.inputIcon}/>
                            <TextInput
                                name="password"
                                placeholder="Mật khẩu"
                                placeholderTextColor="gray"
                                style={[errors.password&&touched.password?{...styles.textInput,borderColor: 'red'}
                                :{...styles.textInput}]}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePass}
                            />
                            <TouchableOpacity onPress={()=>sethidePass(!hidePass)} style={styles.inputIconShowPass}>
                                    {hidePass ?
                                        <Entypo name="eye-with-line" size={20} color="white" />
                                    :
                                        <Entypo name="eye" size={20} color="white" />
                                    }
                                
                            </TouchableOpacity>
                        </View>
                        {(errors.password &&touched.password)&&
                            <Text style={styles.errorText}>{errors.password}</Text>
                        }
                         <View style={styles.wrapperInput}>
                            <Entypo name="cw" size={20} color="white" style={styles.inputIcon}/>
                            <TextInput
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                placeholderTextColor="gray"
                                style={[errors.confirmPassword&& touched.confirmPassword?{...styles.textInput,borderColor: 'red'}
                                :{...styles.textInput}]}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={hidePass}
                            />
                            <TouchableOpacity onPress={()=>sethidePass(!hidePass)} style={styles.inputIconShowPass}>
                                    {hidePass ?
                                        <Entypo name="eye-with-line" size={20} color="white" />
                                    :
                                        <Entypo name="eye" size={20} color="white" />
                                    }
                                
                            </TouchableOpacity>
                        </View>
                        {(errors.confirmPassword && touched.confirmPassword)&&
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        }
                        <View style={{ paddingTop:10 }}>
                            <Button
                                onPress={handleSubmit}
                                title="Đăng ký"
                                disabled={!isValid}
                                color="tomato"
                            />
                        </View>
                        </>
                )}
                </Formik>
            </View>
            <ModalSuccess/>
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1, 
        justifyContent : "center",
        alignItems : "center",
    },
    background:{
        flex:1,
        width:'100%',
    },
    child: {
        flex: 1,
        width:'100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: "center",
        alignItems:'center',  
    },
    wrapperInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIcon: {
        position:'absolute',
        left:20
    },
    textInput: {
        height: 40,
        width: '80%',
        margin: 10,
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        color:"white",
        paddingLeft:40,
        paddingRight:40
    },
    errorText: {
        marginLeft:10,
        fontSize: 14,
        color: 'red',
    },
    inputIconShowPass: {
        position:'absolute',
        right:30
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})