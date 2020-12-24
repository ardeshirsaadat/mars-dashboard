// const Immutable = require('immutable')
let store = Immutable.Map({
    'user': Immutable.Map({
        name: 'Ardeshir'
    }),
    'apod': '',
    'rovers': Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    'roversStatus': Immutable.Map({})
  })
  const root = document.getElementById('root')
  const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
  }
  const render = async(root, state) => {
    root.innerHTML = responseApp(state)
  }
  
  const renderUI = async() => {
    root.innerHTML = App()
  }
  
  const getroverData = (input) => {
    fetch('/photos', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'rover': input
            }),
        })
        .then(res => res.json())
        .then(data => {
            const {
                rover
            } = data.roverData[0]
            const earth_date = data.roverData[0].earth_date
                //  console.log(rover)
            const {
                id,
                name,
                landing_date,
                launch_date,
                status
            } = rover
            const imagesList = data.roverData.map((element) => element.img_src)
                //  console.log(imagesList)
            const roverObject = {
                    'roversStatus': {
                        id: id,
                        name: name,
                        Landing_date: landing_date,
                        Launch_date: launch_date,
                        status: status,
                        images: imagesList,
                        earth_date: earth_date
                    }
                }
                // console.log(roverObject)  
            updateStore(store, roverObject)
                // console.log(store) 
        })
  }
  
  // create content
  const App = () => {
        return `
  <header></header>
  <main>
      <section>
          <h3>Let's Explore</h3>
          <p>Pick a Rover</p>
      </section>
      ${roverstemplate()}
  </main>
  <footer></footer>
  `
  
    }
    // 
  const roverstemplate = () => {
    const rovers = store.get('rovers')
    const roversArray = rovers.toArray()
    return roversArray.reduce((finalHtmal, input) => {
        return finalHtmal += `
                          <section class = ${input}>  
                            <h1>${input}</h1>
                            <button onclick=rover("${input}")>${input}</button>
                          </section> 
                          `;
    }, '')
  }
  
  const rover = (input) => {
  
    return getroverData(input)
        // return render(root,store,input)
  }
  
  // build image templates for responseApp
  const produceImageTemplate = (images) => {
    return images.reduce((finalHtml, imagelink) => {
        return finalHtml += `<div><img src=${imagelink}></div>`
    }, "")
  }
  
  // responseApp functionalities:
  const responseApp = (state) => {
    const rover_status = state.get('roversStatus')
    const links = state.get('roversStatus').get('images')
    return `<header>
              <h1><u>${rover_status.get('name')}</u></h1>
          </header>
          <section>
              <h2><u>Important Dates</u></h2>
                <p>Landing Date:${rover_status.get('Landing_date')}</p>
                <p>Launch Date:${rover_status.get('Launch_date')}</p>
                <p>Images Taken ON:${rover_status.get('earth_date')}</p>
          </section>
          <section>
              <h2><u>Status Of Mission</u></h2>
                <p>${rover_status.get('status')}</p>
          </section>
          <section>
            <h1><u>Images</u></h1>
            <ul>
              ${produceImageTemplate(links)}
            </ul>  
          </section>  
          `
  }
  
  
  window.onload = function() {
    renderUI()
  }