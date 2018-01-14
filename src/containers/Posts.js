import React, {Component} from "react";
import {invokeApig} from "../libs/awsLib";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Posts.css";

export default class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: null,
            post: null,
            body: "",
            comments: [],
            newComment: ""
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

    validateForm() {
        return this.state.body.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    getComments() {
        return invokeApig({path: `/comments/${this.props.match.params.id}`});
    }

    getPost() {
        return invokeApig({path: `/posts/single/${this.props.match.params.id}`});
    }

    handleSubmit = async event => {
        event.preventDefault();
        const newState = Object.assign({}, this.state);
        newState.newComment = "";
        this.setState({isLoading: true});

        try {
            await this.createComment({
                postId: this.props.match.params.id,
                body: this.state.newComment,
            });
        } catch (e) {
            this.setState({isLoading: false});
            alert(e);
        }

        this.setState({isLoading: false});
        newState.isLoading = false;

        try {
            const commentResults = await this.getComments();
            newState.comments = commentResults;
        } catch (e) {
            alert(e);
        }

        this.setState(newState);
        this.forceUpdate();
    };

    createComment(comment) {
        return invokeApig({
            path: "/comments",
            method: "POST",
            body: comment
        });
    }

    renderComments() {
        return (
            <div className="comments">
                <div className="NewComment">
                    <form onSubmit={this.handleSubmit}>
                        <h4>New Comment</h4>
                        <FormGroup controlId="newComment">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.newComment}
                                bsSize="large"
                                componentClass="textarea"
                            />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Post"
                            loadingText="Posting"
                        />
                    </form>
                </div>
                <ListGroup>
                    <h1>Comments Section</h1>
                    <ul className="list-group">
                        {this.state.comments.length > 0 ? this.renderCommentsList(this.state.comments) : this.renderNoComments()}
                    </ul>
                </ListGroup>
            </div>
        );
    }

    deleteComment(comment){
        return invokeApig({
            path: `/comments/delete/${comment.commentId}`,
            method: "DELETE"
        });
    }

    renderCommentsList(comments) {
        return [{}].concat(comments).map(
            (comment, i) =>
                i !== 0
                    ?
                        <li key={comment.commentId} className="list-group-item">
                            <div>
                                <button onClick={this.deleteComment.bind(this, comment)} type="button" className="btn btn-danger delete-button">Delete</button>
                                <h5>{comment.body}</h5>
                                <div className="poster-details">{"Commented by " + comment.userId + " at " + new Date(comment.createdAt).toLocaleString()}</div>
                            </div>
                        </li> : null

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
