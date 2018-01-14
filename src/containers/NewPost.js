import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewPost.css";
import { invokeApig } from "../libs/awsLib";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      title: "",
      body: "",
      category: ""
    };
  }

  validateForm() {
    return this.state.body.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  selectChange = event => {
    this.setState({
      category: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.createNote({
        title: this.state.title,
        body: this.state.body,
        category: this.state.category
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createNote(note) {
    return invokeApig({
      path: "/posts",
      method: "POST",
      body: note
    });
  }

  render() {
    return (
      <div className="NewPost">
        <form onSubmit={this.handleSubmit}>
          <h4>Title</h4>
          <FormGroup controlId="title">
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              bsSize="sm"
            />
          </FormGroup>
          <h4>Category</h4>
          <select className="form-control" value={this.state.category} onChange={this.selectChange}>
            <option value="study">Study</option>
            <option value="projects">Project</option>
            <option value="social">Social</option>
          </select>
          <h4>Body</h4>
          <FormGroup controlId="body">
            <FormControl
              onChange={this.handleChange}
              value={this.state.body}
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
    );
  }
}
