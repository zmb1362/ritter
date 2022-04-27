const helper = require('./helper.js');

const handleRitz = (e) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#ritzText').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!text) {
        helper.handleError('Text is required!');
        return false;
    }

    helper.sendPost(e.target.action, {text, _csrf}, loadAllRitzsFromServer);

    return false;
}

const RitzForm = (props) => {
    return (
        <form id="ritzForm"
            name="ritzForm"
            onSubmit={handleRitz}
            action="/maker"
            method="POST"
            className="ritzForm"
        >
            <label htmlFor="name">Ritz: </label>
            <input id="ritzText" type="text" name="name" placeholder="Ritz Message" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeRitzSubmit" type="submit" value="Send Ritz" />
        </form>
    );
}

const AllRitzList = (props) => {
    if(props.ritzs.length === 0) {
        return (
            <div className='ritzList'>
                <h3 className='emptyRitz'>No Ritzs Yet!</h3>
            </div>
        );
    }

    const ritzNodes = props.ritzs.map(ritz => {
        return (
            <div key={ritz.id} className="ritz">
                <h3 className='ritzText'> {ritz.username}: {ritz.text} </h3>
            </div>
        );
    });

    return (
        <div className='ritzList'>
            {ritzNodes}
        </div>
    );
};

const MyRitzList = (props) => {
    if(props.ritzs.length === 0) {
        return (
            <div className='ritzList'>
                <h3 className='emptyRitz'>No Ritzs Yet!</h3>
            </div>
        );
    }

    const ritzNodes = props.ritzs.map(ritz => {
        return (
            <div key={ritz.id} className="ritz">
                <h3 className='ritzText'> {ritz.username}: {ritz.text} </h3>
            </div>
        );
    });

    return (
        <div className='ritzList'>
            {ritzNodes}
        </div>
    );
};

const loadRitzsFromServer = async () => {
    const response = await fetch ('/getRitzs');
    const data = await response.json();
    ReactDOM.render(
        <MyRitzList ritzs={data.ritzs} />,
        document.getElementById('ritzs')
    );
}

const loadAllRitzsFromServer = async () => {
    const response = await fetch ('/getAll');
    const data = await response.json();
    ReactDOM.render(
        <AllRitzList ritzs={data.ritzs} />,
        document.getElementById('ritzs')
    );
}


const init = async () => {
    const response = await fetch ('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <RitzForm csrf={data.csrfToken} />,
        document.getElementById('makeRitz')
    );

    ReactDOM.render(
        <MyRitzList ritzs={[]} />,
        document.getElementById('ritzs')
    );

    loadAllRitzsFromServer();
}

window.onload = init;