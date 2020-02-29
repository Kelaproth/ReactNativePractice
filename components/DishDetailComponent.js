import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Button, Modal } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl'
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props){
    const dish = props.dish;

    if(dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}
            >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                    <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome' color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFavorite()} />
                    <Icon raised reverse name={'pencil'}
                        type='font-awesome' color='#512DA8'
                        onPress={() => { props.onPressComment() }} />
                </View>
            </Card>
        );
    }
    else{
        return (
            <View></View>
        );
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <View style={{alignItems: 'flex-start', flex: 1}}>
                    <Rating imageSize={12} readonly startingValue={item.rating} />
                </View>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return (
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}/>
        </Card>
    );
}

class Dishdetail extends Component{

    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    handleComment() {
        const dishId = this.props.navigation.getParam('dishId', '');
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.setState({
            rating: 1,
            author: "",
            comment: "",
            showModal: false
        })
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal})
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPressFavorite={() => this.markFavorite(dishId)}
                    onPressComment={() => this.toggleModal()}
                    />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal();}}
                    onRequestClose={() => {this.toggleModal();}}    
                    >
                    <View style={{justifyContent: 'center', margin: 20}}>    
                        <Rating 
                            style={{marginBottom: 10}}
                            showRating
                            startingValue={5}
                            minValue={1}
                            onFinishRating={(rating) => {this.setState({rating: rating})}}
                            />
                        <View style={{marginBottom: 20}}>
                            <Input 
                                placeholder='Author'
                                leftIcon={{type: 'font-awesome', name: 'user-o', marginRight: 10}}
                                onChangeText={(text) => {this.setState({author: text})}}
                                />
                            <Input 
                                placeholder='Comment'
                                leftIcon={{type: 'font-awesome', name: 'comment-o', marginRight: 10}}
                                onChangeText={(text) => {this.setState({comment: text})}}
                                />
                        </View>
                        <View style={{marginBottom: 20}}>
                            <Button
                                style={{marginBottom: 10}} 
                                onPress={() => {this.toggleModal(); this.handleComment();}}
                                color='#512DA8'
                                title='Submit'
                            />
                        </View>
                        <View>
                            <Button 
                                style={{marginBottom: 10}}
                                onPress={() => {this.toggleModal();}}
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);