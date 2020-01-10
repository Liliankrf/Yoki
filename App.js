import React, {useState, useEffect} from 'react';
import {Button, Image, Alert, ScrollView, StyleSheet, Modal, Text, TouchableOpacity, View} from 'react-native';
import {homeStyle} from './style/home';
import {fontsStyle} from "./style/fonts";
import {globalStyle} from "./style/global";
import MyHeader from "./components/MyHeader";
import ScanButton from "./components/ScanButton";
import ProductItem from "./components/ProductItem";
import { BarCodeScanner } from 'expo-barcode-scanner';



export default class App extends React.Component {
  constructor(){
    super();

    async getProductFromApi(barcode) {
      try {
        let response = await fetch(
            'https://fr.openfoodfacts.org/api/v0/produit/' + barcode + '.json'
        );
        let responseJson = await response.json();
        return responseJson.product;
      } catch (error) {
        console.error(error);
      }
    }
   
    /*
    Appelée quand la caméra a détecté un code barre,
    testez vous même !
     */
    async _handleBarCodeRead ({ type, data }) {
      // On récupère le produit scanné
      let scannedProduct = await this.getProductFromApi(data);
   
      // On crée un nouvel obj. produit
      let newProduct = {id: 1, name: scannedProduct.product_name, date: new Date()};
   
      let _products = this.state.products; // récupération de la liste actuelle
   
      console.log(scannedProduct);
      console.log(newProduct);
   
      _products.push(newProduct); // ajout du nouveau produit
      this.setState({products : _products}); // on set les nouveau produits dans le state
      this.setState({modalScanVisible: false});
    };

    this.state = {
      modalVisible: false
    }

    this.products = [
      {id: 1, name : 'Coca', date: new Date()},
      {id: 2, name : 'Orangina', date: new Date()},
      {id: 3, name : 'Nestea', date: new Date()},
      {id: 4, name : 'Bière sans alcool', date: new Date()}
    ];

    this.title = "Yiko"
  }


 /* handleBarCodeScanned = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
*/
  handleScanPress = () => {
    this.setModalVisible(true)
    
  };

  setModalVisible = (bool) => {
     this.setState({modalVisible: bool})
  }

  handleProductPress = (id) => {
    alert('Je clique sur un produit avec l\'id : ' + id)
  };

  render() {
        //  const { status } =  BarCodeScanner.requestPermissionsAsync();
    return (
      <View style={globalStyle.container}>
        <MyHeader title={this.title}/>

        <ScanButton handlePress={this.handleScanPress}/>

        <ScrollView style={homeStyle.scrollProductView}>
          {
           this.products.map(
               (produit) => {
                 return (
                     <ProductItem product={produit} key={produit.id} onPressItem={this.handleProductPress}/>
                 )
               }
           )
          }
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{flex: 1}}>
            <MyHeader title="Scanner"/> 

            <BarCodeScanner
          onBarCodeRead={({ type, data }) => this._handleBarCodeRead({ type, data })}
          style={globalStyle.container}
          />
            /*<TouchableOpacity 
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
              style={{
                position: "absolute", 
                backgroundColor: "lightblue", 
                width: "100%",
                height: 70,
                left: 0, 
                bottom: 0}}>


                <Text>Hide Modal</Text>
            </TouchableOpacity>
          </View>
        </Modal>


      </View>
    );
  }
}


