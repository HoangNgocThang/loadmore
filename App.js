import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axois from 'axios';

class App extends Component {

  page = 1;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      hasNextPage: false
    }
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {

    try {
      const res = await axois.get(`https://test-omipharma.ominext.group/omicare/v1/search?key=&page=${this.page}&category_id=357`);
      console.log("res:", res);
      this.setState({
        data: [...this.state.data.concat(res.data.data)],
        hasNextPage: res.data.hasNextPage
      })
    } catch (error) {
      console.log("error:", error);
    }
  }

  handleLoadMore = () => {
    if (this.state.hasNextPage) {
      this.page = this.page + 1;
      // deley
      setTimeout(() => {
        this.getProducts()
      }, 2000);

    }
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.avatar} resizeMode="contain" />
        <View style={styles.wrapContent}>
          <Text numberOfLines={2}>{item.product_name}</Text>
          <Text style={styles.price}>{`${item.sale_price} vnđ`}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    if (this.state.data && this.state.data.length < 0) {
      return <></>
    }
    if (!this.state.hasNextPage) {
      return <></>
    }
    return (
      <View style={{ height: 20 }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    )
  }

  render() {
    const { data } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.list}
          data={data}
          keyExtractor={item => `key-${item.id}`}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter()}
          onEndReached={() => this.handleLoadMore()}
          onEndReachedThreshold={.4}
        />
      </SafeAreaView>
    )
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  avatar: {
    width: 80, height: 80
  },
  list: {
    flex: 1,
    padding: 8
  },
  item: {
    marginTop: 8,
    padding: 4,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: 'white'
  },
  wrapContent: {
    flex: 1
  },
  price: {
    marginTop: 4,
    fontWeight: 'bold',
    color: 'blue'
  }
});

export default App;
