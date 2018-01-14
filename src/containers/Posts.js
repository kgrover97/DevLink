import React, {Component} from "react";
import {invokeApig} from "../libs/awsLib";
import {ListGroup, ListGroupItem} from "react-bootstrap";

export default class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            body: "",
            comments: []
        };
        if (this.post == null) {
            this.getPost();
        }
    }

    async componentDidMount() {
        try {
            const postInfo = await this.getPost();
            const commentResults = await this.getComments();
            console.log("got post");
            this.setState({
                post: postInfo,
                body: postInfo.body,
                comments: commentResults
            });
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }

    getComments() {
        return invokeApig({path: `/comments/${this.props.match.params.id}`});
    }

    getPost() {
        return invokeApig({path: `/posts/single/${this.props.match.params.id}`});
    }

    renderComments() {
        return (
            <div className="comments">
                <ListGroup>
                    <h1>Comments Section</h1>
                    {this.state.comments.length > 0 ? this.renderCommentsList(this.state.comments) : this.renderNoComments()}
                </ListGroup>
            </div>
        );
    }

    renderCommentsList(comments) {
        return [{}].concat(comments).map(
            (comment, i) =>
                i !== 0
                    ?
                    <ListGroupItem
                        key={comment.commentId}
                        header={comment.body}
                    >
                        {"Commented by " + comment.userId + " at " + new Date(comment.createdAt).toLocaleString()}
                    </ListGroupItem> : null
        );
    }

    renderNoComments() {
        return (
            <p3>This comment section is empty.</p3>
        );
    }


    render() {
        return (
            <div className="Posts">
                <div className="post-info">
                    {this.state.post && <text>
                        <h1>Post Title</h1>
                        <h2>{this.state.post.title}</h2>
                        <h1>Post Body</h1>
                        <h2>{this.state.body}</h2>
                    </text>}
                </div>
                <div className="comment-writer">
                </div>
                <div className="comments-section">
                    {this.state.post && this.renderComments()}
                </div>
            </div>
        );
    }
}
