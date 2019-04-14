import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

export default function root_init(node) {
	let tasks = window.tasks;
	ReactDOM.render(<Root tasks={tasks} />, node);
}

class Root extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login_form: {email: "", password: ""},
			task_form: {description: "", title: "", user_id: 0, time_spent: 0},
			session: null,
			tasks: props.tasks,
			users: [],
		};

		//this.fetch_tasks();
		this.fetch_users();
	}

	fetch_tasks() {
    $.ajax("/api/v1/tasks", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { tasks: resp.data });
        this.setState(state1);
      },
    });
  }

	login() {
    $.ajax("/api/v1/auth", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.login_form),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { session: resp.data });
        this.setState(state1);
      }
    });
  }
	
	register_user() {
		$.ajax("/api/v1/users", {
			method: "post",
			dataType: "json",
			data: { 
				user: {
					email: this.state.login_form.email,
					password_hash: this.state.login_form.password
				}
			},
			success: function (data) {
				console.log(data);
			}
		});
	}

	create_task() {
		$.ajax("/api/v1/tasks", {
			method: "post",
			dataType: "json",
			data: { 
				task: {
					user_id: this.state.task_form.user_id,
					description: this.state.task_form.description,
					time_spent: this.state.task_form.time_spent,
					title: this.state.task_form.title
				}
			},
			success: function (data) {
				console.log(data);
			}
		});
	
	}

  update_login_form(data) {
    let form1 = _.assign({}, this.state.login_form, data);
    let state1 = _.assign({}, this.state, { login_form: form1 });
    this.setState(state1);
  }

	update_task_form(data) {
    let form1 = _.assign({}, this.state.task_form, data);
    let state1 = _.assign({}, this.state, { task_form: form1 });
    this.setState(state1);
  }


	fetch_users() {
    $.ajax("/api/v1/users", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { users: resp.data });
        this.setState(state1);
      },
    });
  }

  render() {
		console.log(this.state);
    return <Router>
				<div>
      		<Header session={this.state.session} root={this} />
					<Route path="/" exact={true} render={() =>
						<TaskList tasks={this.state.tasks} root={this} />
					} />
					<Route path="/users" exact={true} render={() =>
						<UserList users={this.state.users} />
					} />
				</div>
			</Router>;
  }
}

function Header(props) {
  let {root, session} = props;
  let session_info;
  if (session == null) {
    session_info = <div className="form-inline my-2">
      <input type="email" placeholder="email"
             onChange={(ev) => root.update_login_form({email: ev.target.value})} />
      <input type="password" placeholder="password"
             onChange={(ev) => root.update_login_form({password: ev.target.value})} />
      <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
			<button className="btn btn-secondary" onClick={() => root.register_user()}>Register</button>
    </div>;
  }
  else {
    session_info = <div className="my-2">
      <p>Logged in as {session.user_id}</p>
    </div>
  }

  return <div className="row my-2">
    <div className="col-4">
      <h1>Tasks3</h1>
    </div>
    <div className="col-4">
      <p>
        <Link to={"/"}>Tasks</Link> |
        <Link to={"/users"}>Users</Link>
      </p>
    </div>
    <div className="col-4">
      {session_info}
    </div>
  </div>;
}

function TaskList(props) {
  let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} />);
	let root = props.root;
  return <div className="row">
    {tasks}
		<div>
		<input type="title" placeholder="title" 
    	onChange={(ev) => root.update_task_form({title: ev.target.value})} />
		<input type="description" placeholder="description" 
    	onChange={(ev) => root.update_task_form({description: ev.target.value})} />
		<input type="user_id" placeholder="user_id" 
    	onChange={(ev) => root.update_task_form({user_id: ev.target.value})} />
		<input type="time_spent" placeholder="time_spent" 
    	onChange={(ev) => root.update_task_form({time_spent: ev.target.value})} />
		</div>


		<button className="btn btn-secondary" onClick={() => root.create_task()}>Add new task</button>
  </div>;
}

function Task(props) {
  let {task} = props;
  return <div className="card col-4">
    <div className="card-body">
      <h2 className="card-title">{task.title}</h2>
      <p className="card-text">{task.description} <br/>
      completed: {task.completed.toString()} <br/>
			assigned to: {task.user_id} </p>
    </div>
  </div>;
}

function UserList(props) {
  let rows = _.map(props.users, (uu) => <User key={uu.id} user={uu} />);
  return <div className="row">
    <div className="col-12">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>email</th>
            <th>manager?</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  </div>;
}

function User(props) {
  let {user} = props;
  return <tr>
    <td>{user.email}</td>
    <td>{user.manager ? "yes" : "no"}</td>
  </tr>;
}

