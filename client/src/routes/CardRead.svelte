<script>
    import { onMount } from 'svelte';
    import CardReveal from './CardReveal.svelte'
    import CardHidden from './CardHidden.svelte'
    import Store from './store.js'
    
    let cards = []
    let state = 0

    onMount(async () => {
        const res = await fetch('http://localhost:5002/cards'); // CHANGE
        const data = await res.json();
        Store.set(data);
	});

    Store.subscribe(async (_cards) => {
        cards = await _cards
        console.log("Subscribe me: ")
        console.log(cards)
        state = 0
        console.log(state)
    })

    $: filteredItems = cards.slice(1, 4);

</script>




<div class="row">
    <div class="col-md-8 mx-auto">
        <div class="text-center">
            <h3>Card Review</h3>
            <hr />
            {#if Array.isArray(cards) && cards.length}
                {#if state == 0}
                    <CardHidden card = {cards[0]}/>
                    <button on:click={() => state = 1 } class="btn btn-primary">Reveal</button>
                    <br>
                {:else}
                    <CardReveal card = {cards[0]}/>
                    <br>  
                {/if}
                <hr />
                Upcoming Cards:<br>
                {#each filteredItems as card (card.id)}
                    {card.sentence}
                    <br>
                {/each}
            {:else}
                There are no cards to display
            {/if}
        </div>
    </div>
</div>