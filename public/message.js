const server = new WebSocket(`ws://localhost:9000/${uname}`);
const msg = document.getElementById('msg');
const btn = document.getElementById('btn');
const messages = document.getElementById('messages');

let url = document.URL;
let to = url.split('/')[4];

btn.disbled = false

btn.addEventListener('input', (e) => {
    e.currentTarget.value == "" ? btn.disabled = true : btn.disbled = false;
})

btn.addEventListener('click', (e) => {
    let text = msg.value;
    let message = {
        to: to,
        from: uname,
        msg: text,
        convoName: to
    }
    server.send(JSON.stringify(message));
    let p = document.createElement('p');
    p.innerHTML = text;
    let div = document.createElement('div');
    div.className = "d-flex flex-row-reverse";
    div.appendChild(p);
    messages.appendChild(div);
    msg.value = "";
})

server.onmessage = (e) => {
    console.log(e);
    let data = e.data;
    let p = document.createElement('p');
    p.innerHTML = data;
    let div = document.createElement('div');
    div.className = "d-flex";
    div.appendChild(p);
    messages.appendChild(div);
}