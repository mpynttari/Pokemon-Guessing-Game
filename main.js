const mainArea = document.querySelector(".main-area")
const POKEMON_TYPES = 
['normal', 'fire', 'fighting', 'water', 
'flying', 'grass', 'poison', 'electric', 
'ground', 'psychic', 'rock', 'ice', 'bug', 
'dragon', 'ghost', 'dark', 'steel']



function createTargetType()
{
    /* assigning the target type of the game out of 17 possible options */

    const all = document.querySelectorAll('.pkmn-div')
    let TARGET
    let allTypes = []

    /* adding all created pokemons' types to a single array */
    all.forEach(el => allTypes.push(el.pkmnInfo.types))


    /* NOTE: dual-type pokemons' types are concatenated strings, and
       aren't recoqnized as separate items, here's a way to split them
       into two separate entries 
       (i.e. transforming  'grass,poison'  into  'grass','poison')
    */

    let x = allTypes.toString()
    let tmp = []
    x.split(',').forEach(e => tmp.push(e))

    const uniqAllTypes = [...new Set(tmp)]


    /* hacky but functional way to make sure the target type is 
       present in some randomized pokemon's type pool 
       (i.e. atleast one generated pokemon has the target type)
    */

    for (let iter = 0; iter < 10; iter++)
    {
        TARGET = POKEMON_TYPES[Math.floor(Math.random() * 17)]
        if (uniqAllTypes.some(e => e === TARGET)) break
    }

    /* adding the data to the DOM */
    const targetSpan = document.querySelector('.target')
    targetSpan.textContent = capitalizeString(TARGET)

    return TARGET
}


const capitalizeString = (string) =>
{
    return `${string.at(0).toUpperCase()}${string.slice(1)}`
}


const fetchPokemonData = async (url) => 
{
    const response = await fetch(url)
    const data = await response.json()
    return data
}


const handleVictory = (targetType) => 
{
    const btn = document.querySelector('.submit-btn')
    const allPokemon = document.querySelectorAll('.pkmn-div')
    const validOptions = []

    
    /* checking which generated pokemon's types corresponed to the
       desired target type 
    */

    allPokemon.forEach(el => el.pkmnInfo.types.find(x => x === targetType) 
    ? validOptions.push(el.pkmnInfo.name) 
    : '')


    btn.addEventListener('click', () => 
    {
        /* getting the name info of all .selected pokemon */
        const allSelected = document.querySelectorAll('.selected')
        const selectedPokemon = []
        allSelected.forEach(el => selectedPokemon.push(el.pkmnInfo.name))
    
        /* comparing the two lists to see if the player has chosen correctly */
        console.log(`${JSON.stringify(validOptions) === JSON.stringify(selectedPokemon)}`)
        console.log(`validOptions: ${validOptions.length}`)
    })

}


const main = async () =>
{
    // creating the playable space
    for (let i = 0; i < 25; i++)
    {
        // choosing pokemon from #1 to #151 (generation I)
        let randomId = Math.max(1, Math.floor(Math.random() * 151))
        let url = `https://pokeapi.co/api/v2/pokemon/${randomId}/`
        
        const newPokemonDiv = document.createElement("div")
        const newPokemonImg = document.createElement("img")
        const newPokemonH3 = document.createElement("h3")

        // creating the new DOM elements for a single cell of a pokemon
        newPokemonDiv.setAttribute("class", "pkmn-div")
        newPokemonImg.setAttribute("class", "pkmn-img")
        newPokemonH3.setAttribute("class", "pkmn-h3")

        // fetching the pokemon data
        const data = await fetchPokemonData(url)
        
        // adding all of a single pokemon's types to a list
        // (in case it has multiple types instead of just one)
        let typesList = []
        for (let type of data.types) typesList.push(type.type.name)
        
        let pkmnInfo = {
            "name": data.name,
            "types": typesList
        }

        
        // assigning the data and appending it to the DOM
        newPokemonImg.src = data.sprites.front_default;
        newPokemonH3.innerText = capitalizeString(pkmnInfo.name);
        
        // assigning the pkmnInfo object to the div
        newPokemonDiv.pkmnInfo = pkmnInfo

        newPokemonDiv.append(newPokemonImg)
        newPokemonDiv.append(newPokemonH3)
        mainArea.append(newPokemonDiv)

        newPokemonDiv.addEventListener("click", (e) => 
        {
            e.preventDefault

            // hacky way to check if the picture of the pokemon was clicked
            // and not the div around or text below it
            // (which caused problems before)

            if (!e.target.parentNode.classList.contains('pkmn-div')) return
            e.target.parentNode.classList.toggle('selected')
        })
    }

    let targetType = createTargetType()
    handleVictory(targetType)

    // console.log(`END OF main()`)
}



/* Calling the main function and populating the play area with Pokemon */
main()
