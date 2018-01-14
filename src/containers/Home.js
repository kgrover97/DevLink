import React, {Component} from "react";
import {invokeApig} from '../libs/awsLib';
import "./Home.css";
import {PageHeader, ListGroup, ListGroupItem} from "react-bootstrap";


export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            posts: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const results =
                this.props.match.params.category ? await this.loadCategory() : await this.loadPosts();
            console.log("Got posts! " + results);
            this.setState({posts: results});
        } catch (e) {
            console.log("Error with loading posts");
            alert(e);
        }

        this.setState({isLoading: false});
    }

    loadPosts() {
        return invokeApig({path: "/posts"});
    }

    loadCategory() {
        return invokeApig({path: `/posts/category/${this.props.match.params.category}`})
    }

    renderPostsList(posts) {
        return [{}].concat(posts).map(
            (post, i) =>
                i !== 0
                    ? <ListGroupItem
                        key={post.postId}
                        href={`/posts/${post.postId}`}
                        header={post.title.trim().split("\n")[0]}
                    >
                        {"Created by " + post.userId + " in category " + post.category + " at " + new Date(post.createdAt).toLocaleString()}
                    </ListGroupItem>
                    : <ListGroupItem
                        key="new"
                        href="/posts/new"
                        onClick={this.handlePostClick}
                    >
                        <h4>
                            <b>{"\uFF0B"}</b> Create a new post
                        </h4>
                    </ListGroupItem>
        );
    }

    renderPosts() {
        return (
            <div className="posts">
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderPostsList(this.state.posts)}
                </ListGroup>
            </div>
        );
    }

    handlePostClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    };

    renderLander() {
        return (
            <div className="lander">
                <h1>Welcome to DevLink</h1>
                <p>To see posts, please login or sign-up.</p>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderPosts() : this.renderLander()}
            </div>
        );
    }
}