google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
const curiosityData = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json'
let marsWeatherData = []
let newArray = []
let date = new Date();
let [yy,mm,dd] = [date.getFullYear(), date.getMonth()+1, date.getDate()]
let end_date = `${yy}-${mm}-${dd}`;
let lastWeek = `${yy}-${mm < 10 ? '0'+ mm : mm}-${dd-7 < 10 ? '0'+ (dd-7) : (dd-7)}`

let loadingDiv = document.querySelector('#loading')
let mainPicture = document.querySelector('#mainPicture')
let picturesContainer = document.querySelector('.pictures-container')
let button = document.querySelector('button')
let inputStartDate = document.querySelector('#startDate')
inputStartDate.setAttribute('value', `${lastWeek}`)

button.addEventListener('click', function(){
    if(inputStartDate.value){
        mainPicture.innerHTML = ``;
        picturesContainer.innerHTML = ``;
        fetchData();
    } else {
        generateAlert();
    }
})

picturesContainer.addEventListener('click', function(e){
    fetchDataForModal(e.target.currentSrc);
})

function fetchDataForModal(datoImg){
    let start_date = inputStartDate.value;
    let astronomyPictures = `https://api.nasa.gov/planetary/apod?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}&thumbs=true`   
    let fetchPictures = () => {
        let pictures = fetch(astronomyPictures)
        .then(res => res.json())
        .catch(err => console.log(`ERRORE: ` + err))
        return pictures;
    }
    fetchPictures()
        .then(pictures => {
            for(let i = 0; i < pictures.length; i++){
                if(pictures[i].url === datoImg || pictures[i].hdurl === datoImg){
                    dataImageForModal(pictures[i])
                }
            }
            })
}

function dataImageForModal(data){
    let modal = document.querySelector('.picture-details-container')
    modal.style.display = 'flex'
    modal.innerHTML = `
    <div class="picture-details">
        <h2>${data.title}</h2>
        <p>${data.explanation}</p>
        <p><strong>Copyright:</strong>${data.copyright}</p>
        <img src="${data.url}" alt="">
    </div>
    `
    window.addEventListener('click', function(e){
        if(e.target === modal){
            modal.style.display = 'none'
        }
    })
    window.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){
            modal.style.display = 'none'
        }
    })
}

function fetchData(){
    let start_date = inputStartDate.value;
    let apiKey = 'ugZaHeF9PAJebE6WUghQhFe9kMtzHfbMazYT8Hf0'
    let astronomyPictures = `https://api.nasa.gov/planetary/apod?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}&thumbs=true`   
    
    let fetchPictures = () => {
        return fetch(astronomyPictures)
        .then(res => {
            console.log(res.status)
            if(res.ok){
                return res.json()
            } else {
                throw new Error(res.status)
            }
        })
    }
    fetchPictures()
    .then(pictures => {
            showLoading();
            generaImmagineDelGiorno(pictures.reverse());
            generaImmaginiPrevious(pictures.reverse());
        })
    .catch(error => {
        console.log(error)
        mainPicture.textContent = error
    })
    .finally(() => console.log('fine'))
}

function showLoading(){
    loadingDiv.style.display = 'flex'
}

function generaImmagineDelGiorno(pictures){
    let imgToday = document.createElement('img')
    imgToday.setAttribute('src', `${pictures[0].hdurl}`)
    let textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.innerHTML = `
        <h3>${pictures[0].title}</h3>
        <p>${pictures[0].explanation}</p>
        ${pictures[0].copyright ? `<p><strong>Copyright:</strong> ${pictures[0].copyright}</p>`:''}
    `
    mainPicture.append(imgToday);
    mainPicture.append(textContainer)
}

function generaImmaginiPrevious(pictures){
    let counter = 1
    let len = pictures.reverse().length
    for(let i = 1; i < len; i++){
        if(pictures[i].media_type === 'image'){
            returnImage(pictures[i])
            counter++
        } else if(pictures[i].media_type === 'video') {
            returnVideo(pictures[i])
            counter++
        } else {
            counter++
        }
        if(counter == len){
            stopLoading()
        }
    }
}

function returnImage(picture){
    let picPrevContainer = document.createElement('div')
    picPrevContainer.classList.add('picture-container');
    let prevImg = document.createElement('img');
    prevImg.setAttribute('src', `${picture.hdurl}`)
    picPrevContainer.append(prevImg)
    picturesContainer.append(picPrevContainer)
}

function returnVideo(frame){
    let picPrevContainer = document.createElement('div')
    picPrevContainer.classList.add('picture-container');
    let video = document.createElement('div');
    video.innerHTML = `
    <iframe src="${frame.url}" title="Aurora Timelapse over Italian Alps" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `
    picPrevContainer.append(video)
    picturesContainer.append(picPrevContainer)
}

function stopLoading(){
    loadingDiv.style.display = 'none'
}

function generateAlert(){
    let alert = document.querySelector('#alert')
        alert.style.display = 'block' 
        setTimeout(function(){
            if(alert.style.display = 'block')
            alert.style.display = 'none'
        },2000)
}

let fetchCuriosityData = () => {
    let data = fetch(curiosityData)
    .then(resp => resp.json())
    .then(data => data.soles)

    return data;
}

fetchCuriosityData().then(
    res => {
        for(let i = 1; i < 668; i++){
            marsWeatherData.push(res[i])
        }
        marsToday(marsWeatherData)
        return marsWeatherData
        }
)
.then(marsWeatherData => 
    getMarsValues(marsWeatherData)
)

let weatherData = []
const ctx = document.getElementById('myChart');

function getMarsValues(marsWeatherData){
    weatherData = newArray.reverse()
    let intestazioni = ['sol','min temp','max temp']
    weatherData.push(intestazioni);
    for(let i = 0; i < marsWeatherData.length; i++){
        let dato = [
            parseInt(marsWeatherData[i].sol), 
            parseInt(marsWeatherData[i].min_temp), 
            parseInt(marsWeatherData[i].max_temp)
        ]
        weatherData.push(dato)
    }

    // var data = google.visualization.arrayToDataTable(weatherData);
    // var options = {
    //     title: `Mars data for the last ${weatherData.length} sols`,
    //     hAxis: {title: 'sols'},
    //     vAxis: {title: 'temp'},
    //     height: 450,
    //     legend: { position: 'bottom' }
    // };
    // var chart = new google.visualization.LineChart(document.getElementById('marsChart'));
    // chart.draw(data, options);


    const labels = weatherData.map(item => item[0]); // Sols come etichette
    const minTemps = weatherData.map(item => item[1]); // Temperature minime
    const maxTemps = weatherData.map(item => item[2]); // Temperature massime

    new Chart(ctx, {
        type: 'line',
        responsive: true,
        data: {
          labels: labels,
          datasets: [{
            label: 'min-temp',
            data: minTemps,
            borderColor: 'blue',
            borderWidth: 1
          },
          {
            label: 'max-temp',
            data: maxTemps,
            borderColor: 'red',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}

function drawChart() {}

window.onresize = function() {
    drawChart();
};

function marsToday(marsData){
    let today = marsData[0]
    let marsToday = document.querySelector('#marsToday')
    marsToday.innerHTML = `
    <h2>Curiosity today:</h2>
    <p>This is my ${today.id} Martian day</p>
    <p>Today the weather is ${today.atmo_opacity}</p>
    `
}


