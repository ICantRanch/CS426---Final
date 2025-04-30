
<script>
    import Store from './store.js'

    export let card = {}


    const updateScore = async (type) => {
        let res = await fetch('http://localhost:5004/scores', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: card.id, 
                score: card.score, 
                multiplier: card.multiplier, 
                scoreType: type
            })
        })
        let data = await res.json();
        console.log(data)
        cycleCard()
    }

    const cycleCard = async () => { 
        
        Store.update(async (_cards) => {
            console.log("Reveal Me: ");
            (await _cards).shift()
            let cards = await _cards

            console.log(cards)
            if (!cards.length){
                //Get next 5 cards
                console.log("Fetching new")
                console.log(cards.length)
                let res = await fetch('http://localhost:5002/cards');
                let data = await res.json();
                return data.slice(0,5)

            }else{
                return cards
            }
        })

        
    }

</script>



<div class="row">
    <div class="text-center">
        Sentence: <br>
        
        
        <div class="card">
            <div class="card-body">{card.sentence}</div>
        </div>

        Translation: <br>
        <div class="card">
            <div class="card-body">{card.translation}</div>
        </div>
        Score: {card.score} Multiplier: {card.multiplier}<br>
        <button on:click={() => updateScore(1)} class="btn btn-outline-danger">Reset</button>
        <button on:click={() => updateScore(2)} class="btn btn-outline-warning">Hard</button>
        <button on:click={() => updateScore(3)} class="btn btn-outline-success">Good</button>  
    </div>
</div>