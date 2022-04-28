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

const RitzList = (props) => {
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

const RitzAds = (props) => {
    return (
        <div>
            <div className='ads'>
                AD
            </div>
            <div style={{clear: "both"}}></div>
            <div style={{marginTop: "3em"}} className='ads'>
                AD
            </div>
        </div>
        
    );
}

const loadRitzsFromServer = async () => {
    const response = await fetch ('/getRitzs');
    const data = await response.json();
    ReactDOM.render(
        <RitzList ritzs={data.ritzs} />,
        document.getElementById('ritzs')
    );
}

const loadAllRitzsFromServer = async () => {
    const response = await fetch ('/getAll');
    const data = await response.json();
    ReactDOM.render(
        <RitzList ritzs={data.ritzs} />,
        document.getElementById('ritzs')
    );
}


const init = async () => {
    const response = await fetch ('/getToken');
    const data = await response.json();

    const statusResponse = await fetch('/getStatus');
    const status = await statusResponse.json();

    const allRitzButton = document.getElementById('allRitzButton');
    const myRitzButton = document.getElementById('myRitzButton');

    allRitzButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadAllRitzsFromServer();
        allRitzButton.classList.add('active');
        myRitzButton.classList.remove('active');
        return false;
    });

    myRitzButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadRitzsFromServer();
        myRitzButton.classList.add('active');
        allRitzButton.classList.remove('active');
        return false;
    });

    ReactDOM.render(
        <RitzForm csrf={data.csrfToken} />,
        document.getElementById('makeRitz')
    );

    ReactDOM.render(
        <RitzList ritzs={[]} />,
        document.getElementById('ritzs')
    );

    if (status.account[0].accountStatus === 0)
    {
        ReactDOM.render(
            <RitzAds />,
            document.getElementById('ad')
        );
    }

    loadAllRitzsFromServer();

    allRitzButton.classList.add('active');
}

window.onload = init;