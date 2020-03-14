import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Button, Modal, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl'
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

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

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;        
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState)) 
                Alert.alert(
                    'Add to Favorites',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPressFavorite()}}
                    ],
                    {cancelable: false}
                );
            if (recognizeComment(gestureState))
                    props.onPressComment();
                
            return true;
        }
    });

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        }, {
            dialogTitle: 'Share ' + title
        });
    }

    if(dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handleViewRef}
            {...panResponder.panHandlers}>
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
                        <Icon raised reverse name={'share'} type='font-awesome' color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                            />
                    </View>
                </Card>
            </Animatable.View>
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
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}/>
            </Card>
        </Animatable.View>
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