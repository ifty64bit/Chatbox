const search = document.getElementById('search');
search.addEventListener('input', (e) => {
    let q = e.target.value;
    console.log(q);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let results = Array(this.responseText);
            console.log(results);
            console.log(typeof(results));
            results.forEach(r => {
                let child = document.createElement('li');
                child.className = "list-group-item";
                child.innerText = r;
                console.log(child);
                //document.getElementById("searchResult").appendChild(child);
            })
            
        }
    }
    xhr.open('GET', '/api/search/' + q, true);
    xhr.send();
})