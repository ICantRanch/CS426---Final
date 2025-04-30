<script>
    import Store from './store.js'

    let sentence

    const makePost = async (event) => {
        console.log("SentenceAdd: " + sentence)

        let res = await fetch('http://localhost:5000/cards', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sentence
            })
        })

        Store.update(async (_cards) => {
            console.log("Fetching new")
            let res = await fetch('http://localhost:5002/cards');
            let data = await res.json();
            return data
        })

        sentence = '';

    };
</script>

<div>
  <form on:submit={makePost}>
    <div class="form-group">
      <h3>Sentence:</h3>
      <input bind:value={sentence} placeholder= 'Enter sentence to be translated' class="form-control" />
    </div>
    <button class="btn btn-primary">Submit</button>
  </form>
</div>