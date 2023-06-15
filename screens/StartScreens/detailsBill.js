import React,{useEffect, useState} from "react";
import {View, Text,StyleSheet,FlatList,Image,Dimensions, TouchableOpacity,Modal,Alert,TextInput,ToastAndroid} from "react-native";
import * as GETAPI from '../../util/fetchApi';
import LoadingCircle from '../StartScreens/loadingCircle'
import moment from 'moment';
import LottieView from "lottie-react-native";
import {SetHTTP} from '../../util/setHTTP';
import truncate from '../../util/truncate';
import {FormatNumber} from '../../util/formatNumber'
import { Rating } from 'react-native-ratings';
import { useSelector } from "react-redux";
import AntDesign from 'react-native-vector-icons/AntDesign';
import VirtualizedViewFlaslist from "../../util/VituallizedViewFlast";
export default function DetailsBill ({navigation,route}){
    const {codeBill} = route.params
    const [dataBill, setdataBill] = useState();
    const [dataProduct, setdataProduct] = useState();
    const [showContent, setshowContent] = useState(false);
    const [dataSale, setdataSale] = useState();
    const [totalPriceProduct, settotalPriceProduct] = useState(0);
    const [showModalRemove, setshowModalRemove] = useState(false);
    const [showModalReview, setshowModalReview] = useState(false);
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    useEffect(() => {
        navigation.setOptions({
            headerShown:true,
            title:"Chi tiết đơn hàng",
            headerStyle: {
                height:50
            },
            headerTitleStyle: {
                fontSize:16
            },
        })
        settotalPriceProduct(0)
        setshowContent(false)
        getBill()
    },[codeBill,showModalReview])
    const getBill = async()=>{
        let tmp = 0;
        const data = {"idOrder":codeBill}
        const bill = await GETAPI.postDataAPI("/order/getBillById",data)
        const product = await GETAPI.postDataAPI("/order/getProductByIdBill",data)
        setdataBill(bill[0])
        setdataProduct(product)
        console.log("Data đây ")
        console.log(product)
        product.map(e=>tmp+=(e.price*e.quanity))
        settotalPriceProduct(tmp)
        if(bill[0].idSale==null){
            console.log("Không có mã")
            setshowContent(true);   
        }else{
            getSale(bill[0].idSale);
        }
       
    }
    const getSale = async(idSale)=>{
        const res = await GETAPI.postDataAPI("/order/getSaleById",{"idSale":idSale})
        setdataSale(res[0])
        setshowContent(true)
    }
    const statusBill = (status)=>{
        if(status===0){
            return "Đang xử lý"
        }else if(status===1){
            return "Đang giao hàng"
        }else if(status===2){
            return "Đã hoàn thành"
        }else if(status===3){
            return "Đã hủy"
        }
    }
    const methodpayment = (method)=>{
        if(method===1){
            return "Chuyển khoản ngân hàng"
        }else if(method===2){
            return "Trả tiền mật"
        }
    }
    const handleEditReview = async(item)=>{
        if(item.reviewStar===null){
            // ToastAndroid.show("Bạn phải đánh giá sao !", ToastAndroid.SHORT);
            ToastAndroid.showWithGravity(
                "Bạn phải đánh giá sao",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
        }else{
            const data = {"idReview":item.idReview,"comment":item.comment,
            "reviewStar":item.reviewStar}
            const res = await GETAPI.postDataAPI("/review/editReview",data)
            if(res.msg){
                if(res.msg==="Success"){
                    getBill()
                    ToastAndroid.show("Cập nhật đánh giá thành công !", ToastAndroid.SHORT);
                }else{
                    ToastAndroid.show("Có lỗi rồi !", ToastAndroid.SHORT);
                }
            }
        }
    }
    const handleAddReview = async(item)=>{
        if(item.reviewStar===null){
            // ToastAndroid.show("Bạn phải đánh giá sao !", ToastAndroid.SHORT);
            ToastAndroid.showWithGravity(
                "Bạn phải đánh giá sao",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
        }else{
            const idUser = currentUser.id;
            const idProduct = item.idProduct;
            const idOrderDetails = item.id;
            const data = {"idUser":idUser,"idProduct":idProduct,"comment":item.comment,
            "reviewStar":item.reviewStar,"idOrderDetails":idOrderDetails}
            const res = await GETAPI.postDataAPI("/review/addReview",data)
            if(res.msg){
                if(res.msg==="Success"){
                    getBill()
                    ToastAndroid.show("Đánh giá thành công !", ToastAndroid.SHORT);
                }else{
                    ToastAndroid.show("Có lỗi rồi !", ToastAndroid.SHORT);
                }
            }
            
        }
    }
    const handleRemoveBill = async()=>{
        const data ={"code_order":codeBill,"status":3}
        const res = await GETAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                Alert.alert('CTFASHION',"Hủy đơn thành công");
                setshowModalRemove(false)
                navigation.goBack()
            }
            else{
                Alert.alert('CTFASHION',"Có lỗi rồi");
                setshowModalRemove(false)
            }
        }
    }
    const renderitemProduct = ({item,index})=>{
        return(
            <View style={{ flex:1,flexDirection:'row',padding:10 }}>
                <Image source={{uri:SetHTTP(item.image)}} style={{width:70,height:100,marginRight:10}}/>
                <View style={{ flexDirection:'column' }}>
                    <Text style={{ fontWeight:'bold' }}>{truncate(item.name_product)}</Text>
                    <Text>{`Màu/Size : ${item.size}`}</Text>
                    <Text>{`Số lượng : ${item.quanity}`}</Text>
                    <Text>{`Tạm tính : ${FormatNumber(item.price*item.quanity)} đ`}</Text>
                </View>
            </View>
        )
    }
    const renderitemProductReview = ({item,index})=>{
        return(
            <View style={{ flex:1 }}>
            <View style={{ flex:1,flexDirection:'row',padding:10 }}>
                <Image source={{uri:SetHTTP(item.image)}} style={{width:70,height:100,marginRight:10}}/>
                 <View style={{ flexDirection:'column'}}>
                    <Text style={{ fontWeight:'bold' }}>{truncate(item.name_product)}</Text>
                    <Text>{`Màu/Size : ${item.size}`}</Text>
                
                </View>
            </View>
            <View style={{ alignItems:'flex-start' }}>
            <Rating
                showRating={false}
                onFinishRating={(value)=>item.reviewStar=value}
                style={{ paddingVertical: 10 }}
                imageSize={24}
                ratingColor="orange"
                startingValue={item.reviewStar}
            />
            </View>
            <TextInput
                style={{ borderColor:"gray", borderWidth: 0.2,padding: 5,marginTop:10,marginBottom:10 }}
                underlineColorAndroid="transparent"
                placeholder="Nhập đánh giá"
                placeholderTextColor="grey"
                numberOfLines={5}
                multiline={true}
                defaultValue={item.comment}
                onChangeText={(e)=>item.comment=e}
            />
            {item.reviewStar===null?
            <TouchableOpacity 
                style={{padding:10,backgroundColor:'tomato'}}
                onPress={()=>handleAddReview(item)}
            >
                <Text style={{color:'white',textAlign:'center' }}>Đánh giá sản phẩm</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity 
                style={{padding:10,backgroundColor:'tomato'}}
                onPress={()=>handleEditReview(item)}
            >
                <Text style={{color:'white',textAlign:'center' }}>Chỉnh sửa đánh giá</Text>
            </TouchableOpacity>
            }
       
            </View>
        )
    }
  
    const ModalRemoveBill = ()=>(
        <Modal
            visible={showModalRemove}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{ fontWeight:'bold',marginBottom:10,fontSize:16,textAlign:'center' }}>
                        Bạn chắc chắn muốn hủy đơn này ?
                    </Text>
                    <View style={{width:'80%',flexDirection: 'row',justifyContent:'space-around',paddingTop:10 }}>
                    <TouchableOpacity 
                            style={{ padding:10,backgroundColor:'blue',width:80,alignItems:'center',borderRadius:10 }}
                            onPress={()=>handleRemoveBill()}
                        >
                            <Text style={{ color:'white' }}>Có</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{ padding:10,backgroundColor:'red',width:80,alignItems:'center',borderRadius:10  }}
                        onPress={()=>setshowModalRemove(false)}
                    >
                        <Text style={{ color:'white' }}>Không</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal> 
    )
    const ModalReview = ()=>(
        <Modal
            visible={showModalReview}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <View style={{ position:'absolute',top:20,right:20 }}>
                    <TouchableOpacity onPress={()=>setshowModalReview(false)}>
                        <AntDesign name="close" color="gray" size={20}/>
                    </TouchableOpacity>
                </View>
                    <Text style={{ fontWeight:'bold',marginBottom:10,fontSize:16,textAlign:'center' }}>
                        Đánh giá sản phẩm 
                    </Text>
                    <View style={{ flex:1 }}>
                    <FlatList 
                        data={dataProduct}
                        renderItem= {renderitemProductReview}
                        keyExtractor= {(item,index)=>index}
                        contentContainerStyle={{paddingBottom:20}}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={()=>(
                        <View style={{ alignItems:'center' }}>
                            <TouchableOpacity 
                                style={{ padding:10,backgroundColor:'red',width:80,alignItems:'center',borderRadius:10,marginTop:10 }}
                                onPress={()=>setshowModalReview(false)}
                            >
                                <Text style={{ color:'white' }}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                        )}
                    />
                    </View>
                
                    
                </View>
            </View>
        </Modal> 
    )
    return (
        <VirtualizedViewFlaslist style={{ flex:1 }}>
            {showContent ?
            <View style={styles.wrapper}>
                <ModalRemoveBill />
                <ModalReview />
                <Text style={{ fontSize:18,fontWeight:'bold' }}>{statusBill(dataBill.status)}</Text>
                <Text>Phương thức thanh toán : {methodpayment(dataBill.method_payment)}</Text>
                <Text>Cập nhật ngày : {moment(dataBill.update_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
                <View style={styles.inforPerson}>
                    <View style={{ flexDirection: 'row'}}>
                    <LottieView  
                        source={require('../../assets/lottierfiles/location-lottie-animation.json')}
                        style={{ width:45, height:30}}
                        autoPlay
                        loop           
                    />    
                    <View style={{ flexDirection: 'column'}}>
                        <View style={{  flexDirection: 'row',alignItems:'center' }}>
                            <Text style={{ fontWeight:'bold',fontSize:16 }}>{dataBill.name}</Text>
                            <Text style={{ marginLeft:20,fontSize:14}}>{dataBill.phone}</Text>
                        </View>
                        <Text style={{fontSize:14 }}>{dataBill.email}</Text>
                        <Text style={{ marginTop:5 , maxWidth:windowW*0.78 }}>{dataBill.address}</Text>
                    </View>
                    </View>
                </View>
                <View >
                    <Text style={{ fontWeight:'bold',fontSize:16,marginTop:10 }}>Sản phẩm</Text>
                    <FlatList 
                        renderItem={renderitemProduct}
                        data={dataProduct}
                        keyExtractor= {(item,index)=>index}
                    />
                    {dataBill.status==2&&
                    <TouchableOpacity 
                        style={{
                            borderWidth:0.5,
                            borderColor: 'gray',
                            padding:10,
                            width:150,
                        }}
                        onPress={()=>setshowModalReview(true)}
                    >
                        <Text style={{ textAlign:'center' }}>Đánh giá ngay</Text>    
                    </TouchableOpacity>
                    }
                    <View>
                        <Text style={{ fontWeight:'bold',fontSize:15,marginTop:2 }}>
                            {`Mã đơn hàng : #${dataBill.code_order}`}
                        </Text>
                        <View style={{ flexDirection:'row',justifyContent:'space-between',padding:10 }}>
                            <View  >
                                <Text>Đặt ngày :</Text>
                                <Text>Cập nhật ngày :</Text>
                                <Text>{`Tổng tiền (${dataProduct.length} sản phẩm) :`}</Text>
                                <Text>Phí vận chuyển :</Text>
                                {dataSale!==undefined &&
                                <Text>Mã khuyến mãi :</Text>
                                }
                                <Text style={{ marginTop:5,fontWeight:'bold',fontSize:16 }}>Tổng cộng</Text>
                            </View>
                            <View >
                                <Text>{moment(dataBill.create_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                <Text>{moment(dataBill.update_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                <Text style={{ fontWeight:'bold' }}>{FormatNumber(totalPriceProduct)+"  đ"}</Text>
                                <Text>{FormatNumber(30000)+"  đ"}</Text>
                                {dataSale!==undefined &&
                                <Text>{`- ${FormatNumber(dataSale.cost_sale)} đ`}</Text>
                                }   
                                <Text style={{ marginTop:5,fontWeight:'bold',fontSize:16 }}>{`${FormatNumber(dataBill.total_price)} đ`}</Text>
                            </View>
                        </View>
                        {dataBill.status===0 &&
                        <TouchableOpacity 
                            style={{ padding:10,backgroundColor:'tomato',textAlign:'center' }}
                            onPress={()=>setshowModalRemove(true)}
                        >
                            <Text style={{ color:'white',textAlign:'center' }}>Hủy đơn</Text>
                        </TouchableOpacity>
                        
                        }
                    </View>
                </View>

            </View>
            :
            <View style={{ flex:1,justifyContent:'center',alignItems: 'center',height:windowH*0.9}}>
                <LoadingCircle />
            </View>
            }
        </VirtualizedViewFlaslist>
    )
}
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        padding:15,
        flexDirection:"column",
    },
    inforPerson:{
        borderWidth:0.2,
        borderColor:'gray',
        padding:10,
        marginTop:10
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