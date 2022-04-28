const helper = require('./helper.js');

// Changes user password
const handleChangePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = changeForm.querySelector('#pass').value;
    const newPass = changeForm.querySelector('#newPass').value;
    const newPass2 = changeForm.querySelector('#newPass2').value;
    const _csrf = changeForm.querySelector('#_csrf').value;

    if(!pass || !newPass || !newPass2) {
        helper.handleError('Not all fields filled in!');
        return false;
    }

    helper.sendPost(e.target.action, {pass, newPass, newPass2, _csrf});

    return false;
}

// Changes a user's status for premium
const handleChangeStatus = (e) => {
    e.preventDefault();
    helper.hideError();

    const _csrf = changeForm.querySelector('#_csrf').value;

    helper.sendPost(e.target.action, {_csrf});

    return false;
}

// Component for changing passwords
const ChangeWindow = (props) => {
    return (
        <form id="changeForm"
            name="changeForm"
            onSubmit={handleChangePass}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="pass">Current Password: </label>
            <input id="pass" type="password" name="pass" placeholder="current password" />
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="new password" />
            <label htmlFor="newPass2">New Password (Again): </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" style={{width:"200px"}} value="Change Password" />
        </form>
    );
}

// Button/form component to change a user's account status
const StatusButton = (props) => {
    if (props.status === 0)
    {
        return (
            <form id="statusForm"
            name="statusForm"
            onSubmit={handleChangeStatus}
            action="/changeStatus"
            method="POST"
            className="mainForm"
            >
                <input className="formSubmit" type="submit" style={{width:"250px"}} value="Upgrade to Premium" />
            </form>
        );
    }
    else
    {
        return (
            <form id="statusForm"
            name="statusForm"
            className="mainForm"
            >
                <button className="formSubmit" type="submit" style={{width:"250px"}} value="Already Premium" disabled>Already Premium</button>
            </form>
        );
    }
}

// Init
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const statusResponse = await fetch('/getStatus');
    const status = await statusResponse.json();

    ReactDOM.render(
        <ChangeWindow csrf={data.csrfToken} />,
        document.getElementById('changePass')
    );

    ReactDOM.render(
        <StatusButton csrf={data.csrfToken} status={status.account[0].accountStatus}/>,
        document.getElementById('changeStatus')
    );
}

window.onload = init;